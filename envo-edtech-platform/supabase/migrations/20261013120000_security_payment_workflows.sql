-- 20261013120000_security_payment_workflows.sql
-- Fixes missing manual payment review workflow for Learning Center SaaS subscriptions
-- Idempotent, backward-compatible migration

-- 1. Extend envo_payments with audit and currency columns if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'envo_payments' AND column_name = 'currency') THEN
        ALTER TABLE public.envo_payments ADD COLUMN currency VARCHAR(10) DEFAULT 'UZS';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'envo_payments' AND column_name = 'requested_by') THEN
        ALTER TABLE public.envo_payments ADD COLUMN requested_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'envo_payments' AND column_name = 'reviewed_by') THEN
        ALTER TABLE public.envo_payments ADD COLUMN reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'envo_payments' AND column_name = 'rejection_reason') THEN
        ALTER TABLE public.envo_payments ADD COLUMN rejection_reason TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'envo_payments' AND column_name = 'receipt_url') THEN
        ALTER TABLE public.envo_payments ADD COLUMN receipt_url TEXT;
    END IF;
END $$;

-- 2. Create envo_payment_events for immutable audit tracking
CREATE TABLE IF NOT EXISTS public.envo_payment_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    payment_id UUID NOT NULL REFERENCES public.envo_payments(id) ON DELETE CASCADE,
    previous_status VARCHAR(50),
    new_status VARCHAR(50) NOT NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.envo_payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Super admins can view payment events" 
    ON public.envo_payment_events 
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.super_admins WHERE user_id = auth.uid()
        )
    );

-- 3. Implement the missing review_manual_payment RPC
CREATE OR REPLACE FUNCTION public.review_manual_payment(
    p_payment_id UUID,
    p_decision VARCHAR(20), -- 'approved' or 'rejected'
    p_reason TEXT DEFAULT NULL,
    p_reviewer_id UUID DEFAULT auth.uid()
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_payment RECORD;
    v_center_id UUID;
    v_plan VARCHAR(50);
    v_period_count INT := 1;
    v_sub RECORD;
    v_new_end TIMESTAMPTZ;
BEGIN
    -- Verify caller is super admin
    IF NOT EXISTS (SELECT 1 FROM public.super_admins WHERE user_id = auth.uid()) THEN
        RAISE EXCEPTION 'Access denied: Only Super Admins can review manual payments.';
    END IF;

    -- Fetch payment record with row lock
    SELECT * INTO v_payment 
    FROM public.envo_payments 
    WHERE id = p_payment_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Payment record % not found.', p_payment_id;
    END IF;

    IF v_payment.status != 'pending' THEN
        RAISE EXCEPTION 'Payment is already processed with status: %', v_payment.status;
    END IF;

    v_center_id := v_payment.center_id;
    v_plan := v_payment.plan;

    IF p_decision = 'approved' THEN
        -- Update payment record
        UPDATE public.envo_payments
        SET status = 'completed',
            reviewed_by = p_reviewer_id,
            updated_at = timezone('utc'::text, now())
        WHERE id = p_payment_id;

        -- Record event
        INSERT INTO public.envo_payment_events (payment_id, previous_status, new_status, actor_id, notes)
        VALUES (p_payment_id, 'pending', 'completed', p_reviewer_id, COALESCE(p_reason, 'Manual payment verified and approved'));

        -- Activate or extend subscription in 30-day increments (live production rule)
        SELECT * INTO v_sub FROM public.center_subscriptions WHERE center_id = v_center_id;
        
        IF FOUND THEN
            -- If subscription is active and not expired, extend from current end_date; otherwise from now
            IF v_sub.status = 'active' AND v_sub.end_date > timezone('utc'::text, now()) THEN
                v_new_end := v_sub.end_date + (INTERVAL '30 days' * v_period_count);
            ELSE
                v_new_end := timezone('utc'::text, now()) + (INTERVAL '30 days' * v_period_count);
            END IF;

            UPDATE public.center_subscriptions
            SET plan = COALESCE(v_plan, v_sub.plan),
                status = 'active',
                end_date = v_new_end,
                updated_at = timezone('utc'::text, now())
            WHERE center_id = v_center_id;
        ELSE
            -- Insert new subscription
            INSERT INTO public.center_subscriptions (
                center_id, plan, status, start_date, end_date
            ) VALUES (
                v_center_id, 
                COALESCE(v_plan, 'Standard'),
                'active',
                timezone('utc'::text, now()),
                timezone('utc'::text, now()) + (INTERVAL '30 days' * v_period_count)
            );
        END IF;

        RETURN jsonb_build_object(
            'success', true,
            'status', 'completed',
            'center_id', v_center_id,
            'extended_until', v_new_end
        );

    ELSIF p_decision = 'rejected' THEN
        UPDATE public.envo_payments
        SET status = 'rejected',
            reviewed_by = p_reviewer_id,
            rejection_reason = p_reason,
            updated_at = timezone('utc'::text, now())
        WHERE id = p_payment_id;

        INSERT INTO public.envo_payment_events (payment_id, previous_status, new_status, actor_id, notes)
        VALUES (p_payment_id, 'pending', 'rejected', p_reviewer_id, p_reason);

        RETURN jsonb_build_object(
            'success', true,
            'status', 'rejected',
            'reason', p_reason
        );
    ELSE
        RAISE EXCEPTION 'Invalid decision. Must be approved or rejected.';
    END IF;
END;
$$;
