-- 20261104100000_independent_marketplace.sql
-- Implements Business Model B: Independent Teacher & Student Marketplace
-- Preserves existing Center SaaS tables and policies completely

-- 1. Extend user_roles to support account_scope
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'user_roles' AND column_name = 'account_scope') THEN
        ALTER TABLE public.user_roles ADD COLUMN account_scope VARCHAR(20) DEFAULT 'center';
    END IF;
END $$;

-- 2. Teacher Applications & Verification Workflow
CREATE TABLE IF NOT EXISTS public.teacher_applications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    legal_name VARCHAR(255) NOT NULL,
    nickname VARCHAR(100) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    date_of_birth DATE NOT NULL,
    gender VARCHAR(20),
    region VARCHAR(100) NOT NULL,
    bio TEXT NOT NULL,
    education TEXT NOT NULL,
    experience_years INT NOT NULL DEFAULT 0,
    subjects TEXT[] NOT NULL DEFAULT '{}',
    exam_tracks TEXT[] NOT NULL DEFAULT '{}',
    certificates JSONB NOT NULL DEFAULT '[]', -- [{ title, issuer, score_or_grade, doc_url }]
    identity_doc_url TEXT, -- private verification file
    guardian_consent_url TEXT, -- required if age 16-17
    status VARCHAR(50) NOT NULL DEFAULT 'submitted' CHECK (status IN ('draft', 'submitted', 'under_review', 'additional_documents_required', 'approved', 'rejected', 'suspended')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.teacher_applications ENABLE ROW LEVEL SECURITY;

-- 3. Teacher Public Profiles
CREATE TABLE IF NOT EXISTS public.teacher_profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    nickname VARCHAR(100) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    subjects TEXT[] NOT NULL DEFAULT '{}',
    exam_tracks TEXT[] NOT NULL DEFAULT '{}',
    experience_years INT DEFAULT 1,
    verified BOOLEAN NOT NULL DEFAULT false,
    rating NUMERIC(3, 2) NOT NULL DEFAULT 5.00,
    review_count INT NOT NULL DEFAULT 0,
    hourly_rate_uzs BIGINT NOT NULL DEFAULT 150000,
    group_monthly_rate_uzs BIGINT NOT NULL DEFAULT 500000,
    is_sponsored BOOLEAN NOT NULL DEFAULT false,
    region VARCHAR(100) DEFAULT 'Toshkent',
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.teacher_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can view approved teacher profiles"
    ON public.teacher_profiles FOR SELECT
    USING (verified = true);

-- 4. Marketplace Courses & Groups (Strict 1-3 Student Invariant)
CREATE TABLE IF NOT EXISTS public.marketplace_courses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    subject VARCHAR(100) NOT NULL,
    exam_track VARCHAR(100),
    level VARCHAR(50) NOT NULL DEFAULT 'Barcha darajalar',
    price_uzs BIGINT NOT NULL CHECK (price_uzs >= 0),
    duration_weeks INT NOT NULL DEFAULT 4,
    learning_objectives TEXT[] DEFAULT '{}',
    published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.marketplace_courses ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.marketplace_groups (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    course_id UUID REFERENCES public.marketplace_courses(id) ON DELETE SET NULL,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    title VARCHAR(150) NOT NULL,
    schedule TEXT NOT NULL, -- e.g. "Dush-Chor-Juma 18:00"
    max_capacity INT NOT NULL DEFAULT 3 CHECK (max_capacity >= 1 AND max_capacity <= 3), -- INVARIANT: 1-3 students
    current_enrolled INT NOT NULL DEFAULT 0 CHECK (current_enrolled >= 0 AND current_enrolled <= max_capacity),
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'full', 'in_progress', 'completed')),
    monthly_fee_uzs BIGINT NOT NULL CHECK (monthly_fee_uzs > 0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.marketplace_groups ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.marketplace_enrollments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    group_id UUID NOT NULL REFERENCES public.marketplace_groups(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'completed', 'cancelled')),
    enrolled_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT unique_student_group UNIQUE(group_id, student_id)
);

ALTER TABLE public.marketplace_enrollments ENABLE ROW LEVEL SECURITY;

-- 5. Individual 1-on-1 Lesson Bookings
CREATE TABLE IF NOT EXISTS public.individual_lesson_bookings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    subject VARCHAR(100) NOT NULL,
    scheduled_start TIMESTAMPTZ NOT NULL,
    scheduled_end TIMESTAMPTZ NOT NULL,
    price_uzs BIGINT NOT NULL CHECK (price_uzs >= 0),
    status VARCHAR(50) NOT NULL DEFAULT 'confirmed' CHECK (status IN ('pending', 'confirmed', 'completed', 'rescheduled', 'cancelled')),
    meeting_link TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.individual_lesson_bookings ENABLE ROW LEVEL SECURITY;

-- 6. Marketplace Payments (83% Teacher / 17% ENVO Split)
CREATE TABLE IF NOT EXISTS public.marketplace_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    enrollment_id UUID REFERENCES public.marketplace_enrollments(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES public.individual_lesson_bookings(id) ON DELETE SET NULL,
    item_type VARCHAR(50) NOT NULL CHECK (item_type IN ('group_enrollment', 'individual_lesson', 'sponsored_boost')),
    gross_amount_uzs BIGINT NOT NULL CHECK (gross_amount_uzs > 0),
    teacher_share_uzs BIGINT NOT NULL CHECK (teacher_share_uzs >= 0), -- 83%
    envo_commission_uzs BIGINT NOT NULL CHECK (envo_commission_uzs >= 0), -- 17%
    provider_fee_uzs BIGINT NOT NULL DEFAULT 0,
    currency VARCHAR(10) NOT NULL DEFAULT 'UZS',
    provider VARCHAR(50) NOT NULL DEFAULT 'uzcard' CHECK (provider IN ('uzcard', 'humo', 'visa', 'mastercard', 'payme', 'click')),
    status VARCHAR(50) NOT NULL DEFAULT 'completed' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    external_reference VARCHAR(150),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.marketplace_payments ENABLE ROW LEVEL SECURITY;

-- 7. Teacher Wallets & Immutable Ledger
CREATE TABLE IF NOT EXISTS public.teacher_wallets (
    teacher_id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    available_balance_uzs BIGINT NOT NULL DEFAULT 0 CHECK (available_balance_uzs >= 0),
    pending_balance_uzs BIGINT NOT NULL DEFAULT 0 CHECK (pending_balance_uzs >= 0),
    total_earned_uzs BIGINT NOT NULL DEFAULT 0 CHECK (total_earned_uzs >= 0),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.teacher_wallets ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.teacher_wallet_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    payment_id UUID REFERENCES public.marketplace_payments(id) ON DELETE SET NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('lesson_credit', 'payout_hold', 'payout_settled', 'refund_debit')),
    amount_uzs BIGINT NOT NULL,
    balance_after_uzs BIGINT NOT NULL,
    description TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.teacher_wallet_transactions ENABLE ROW LEVEL SECURITY;

CREATE TABLE IF NOT EXISTS public.teacher_payout_requests (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    amount_uzs BIGINT NOT NULL CHECK (amount_uzs >= 100000),
    card_number_masked VARCHAR(20) NOT NULL, -- e.g. 8600 **** **** 1234
    bank_name VARCHAR(100),
    cardholder_name VARCHAR(150) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected', 'processing')),
    admin_notes TEXT,
    reviewed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.teacher_payout_requests ENABLE ROW LEVEL SECURITY;

-- 8. Reviews
CREATE TABLE IF NOT EXISTS public.marketplace_reviews (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    teacher_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    rating INT NOT NULL CHECK (rating >= 1 AND rating <= 5),
    comment TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.marketplace_reviews ENABLE ROW LEVEL SECURITY;

-- 9. Transactional Group Enrollment Enforcing 1-3 Capacity Limit
CREATE OR REPLACE FUNCTION public.enroll_in_marketplace_group(
    p_group_id UUID,
    p_student_id UUID
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_group RECORD;
    v_count INT;
    v_enrollment_id UUID;
BEGIN
    -- Lock group row to prevent concurrent race condition
    SELECT * INTO v_group 
    FROM public.marketplace_groups 
    WHERE id = p_group_id 
    FOR UPDATE;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Group % does not exist', p_group_id;
    END IF;

    -- Count active enrollments
    SELECT COUNT(*) INTO v_count 
    FROM public.marketplace_enrollments 
    WHERE group_id = p_group_id AND status = 'active';

    IF v_count >= v_group.max_capacity THEN
        RAISE EXCEPTION 'Guruh to‘lgan! Maksimal sig‘im: % o‘quvchi.', v_group.max_capacity;
    END IF;

    -- Check if student already enrolled
    IF EXISTS (
        SELECT 1 FROM public.marketplace_enrollments 
        WHERE group_id = p_group_id AND student_id = p_student_id AND status = 'active'
    ) THEN
        RAISE EXCEPTION 'Siz allaqachon ushbu guruhga a‘zo bo‘lgansiz.';
    END IF;

    -- Create enrollment
    INSERT INTO public.marketplace_enrollments (group_id, student_id, status)
    VALUES (p_group_id, p_student_id, 'active')
    RETURNING id INTO v_enrollment_id;

    -- Update current_enrolled count and status
    UPDATE public.marketplace_groups
    SET current_enrolled = v_count + 1,
        status = CASE WHEN (v_count + 1) >= max_capacity THEN 'full' ELSE 'open' END,
        updated_at = timezone('utc'::text, now())
    WHERE id = p_group_id;

    RETURN jsonb_build_object(
        'success', true,
        'enrollment_id', v_enrollment_id,
        'new_enrolled_count', v_count + 1,
        'capacity', v_group.max_capacity
    );
END;
$$;

-- 10. Process Marketplace Payment with Exact 83% / 17% Split
CREATE OR REPLACE FUNCTION public.process_marketplace_payment(
    p_student_id UUID,
    p_teacher_id UUID,
    p_item_type VARCHAR(50),
    p_gross_amount BIGINT,
    p_enrollment_id UUID DEFAULT NULL,
    p_booking_id UUID DEFAULT NULL,
    p_provider VARCHAR(50) DEFAULT 'uzcard'
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
DECLARE
    v_teacher_share BIGINT;
    v_envo_commission BIGINT;
    v_payment_id UUID;
    v_wallet RECORD;
    v_new_balance BIGINT;
BEGIN
    -- Strict financial formula: Teacher 83%, ENVO 17%
    -- Integer division with correct precision
    v_teacher_share := ROUND(p_gross_amount * 0.83);
    v_envo_commission := p_gross_amount - v_teacher_share;

    -- Insert payment ledger record
    INSERT INTO public.marketplace_payments (
        student_id, teacher_id, enrollment_id, booking_id,
        item_type, gross_amount_uzs, teacher_share_uzs,
        envo_commission_uzs, provider, status
    ) VALUES (
        p_student_id, p_teacher_id, p_enrollment_id, p_booking_id,
        p_item_type, p_gross_amount, v_teacher_share,
        v_envo_commission, p_provider, 'completed'
    ) RETURNING id INTO v_payment_id;

    -- Ensure teacher wallet exists and lock it
    INSERT INTO public.teacher_wallets (teacher_id, available_balance_uzs, pending_balance_uzs, total_earned_uzs)
    VALUES (p_teacher_id, 0, 0, 0)
    ON CONFLICT (teacher_id) DO NOTHING;

    SELECT * INTO v_wallet 
    FROM public.teacher_wallets 
    WHERE teacher_id = p_teacher_id 
    FOR UPDATE;

    v_new_balance := v_wallet.available_balance_uzs + v_teacher_share;

    UPDATE public.teacher_wallets
    SET available_balance_uzs = v_new_balance,
        total_earned_uzs = v_wallet.total_earned_uzs + v_teacher_share,
        updated_at = timezone('utc'::text, now())
    WHERE teacher_id = p_teacher_id;

    -- Append to immutable transaction ledger
    INSERT INTO public.teacher_wallet_transactions (
        teacher_id, payment_id, type, amount_uzs, balance_after_uzs, description
    ) VALUES (
        p_teacher_id, v_payment_id, 'lesson_credit', v_teacher_share, v_new_balance,
        'Dars to‘lovi (83% ulush): ' || p_item_type
    );

    RETURN jsonb_build_object(
        'success', true,
        'payment_id', v_payment_id,
        'gross_amount', p_gross_amount,
        'teacher_share', v_teacher_share,
        'envo_commission', v_envo_commission
    );
END;
$$;

-- 11. Founder Super Admin Automatic Recognition Trigger
CREATE OR REPLACE FUNCTION public.handle_founder_superadmin()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public, auth, pg_temp
AS $$
BEGIN
    IF NEW.email = 'novax45.a@gmail.com' THEN
        INSERT INTO public.super_admins (user_id)
        VALUES (NEW.id)
        ON CONFLICT (user_id) DO NOTHING;

        INSERT INTO public.user_roles (user_id, role, account_scope)
        VALUES (NEW.id, 'super_admin', 'platform')
        ON CONFLICT (user_id) DO UPDATE
        SET role = 'super_admin', account_scope = 'platform';
    END IF;
    RETURN NEW;
END;
$$;
