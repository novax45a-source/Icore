import React from 'react';
import {
  Users,
  Building2,
  GraduationCap,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Video,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SAAS_PLANS } from '../lib/plans';
import { formatUSD } from '../lib/commission';
import { EnvoLogo } from '../components/EnvoLogo';

interface LandingPageProps {
  onOpenClassroomDemo: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenClassroomDemo }) => {
  const { setActiveView, enterPreview } = useAuth();

  return (
    <div className="space-y-16 py-8">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-3xl bg-gradient-to-br from-[#050B1A] via-[#0A1530] to-[#0B1220] p-8 sm:p-14 text-white shadow-2xl overflow-hidden border border-[#1F5BFF]/30">
          <div className="absolute top-0 right-0 -mr-20 -mt-20 w-96 h-96 bg-[#1F5BFF]/20 rounded-full blur-3xl pointer-events-none"></div>

          <div className="relative z-10 max-w-3xl space-y-6">
            <div className="flex flex-wrap items-center gap-4">
              <EnvoLogo size="lg" variant="dark" />
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#1F5BFF]/15 text-[#8EC5FF] text-xs font-bold border border-[#1F5BFF]/30">
                <Sparkles className="w-4 h-4 text-[#8EC5FF]" />
                Yagona EdTech Ekotizimi &bull; 2 Ta Mustaqil Biznes Modeli
              </div>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
              O‘quv Markazlari SaaS va Saralangan O‘qituvchilar Bozori
            </h1>

            <p className="text-slate-300 text-sm sm:text-base leading-relaxed">
              ENVO — bir tomondan o‘quv markazlari uchun to‘liq avtomatlashtirilgan boshqaruv tizimi (SaaS),
              ikkinchi tomondan mustaqil o‘qituvchilar va talabalar uchun <strong>1–3 kishilik guruhlarda</strong> 83% sof ulushli professional repetitorlik maydoni.
            </p>

            {/* Main Action CTAs */}
            <div className="flex flex-wrap items-center gap-3 pt-2">
              <button
                onClick={() => setActiveView('marketplace')}
                className="px-6 py-3.5 rounded-2xl bg-[#1F5BFF] hover:bg-blue-600 text-white font-bold text-xs sm:text-sm shadow-lg shadow-[#1F5BFF]/40 transition flex items-center gap-2"
              >
                <span>O‘qituvchi topish</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveView('center_saas')}
                className="px-6 py-3.5 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs sm:text-sm border border-white/20 transition flex items-center gap-2"
              >
                <Building2 className="w-4 h-4 text-[#8EC5FF]" />
                <span>O‘quv Markazlar uchun</span>
              </button>

              <button
                onClick={onOpenClassroomDemo}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm border border-emerald-400/40 transition flex items-center gap-2 shadow-md shadow-emerald-600/30"
              >
                <Video className="w-4 h-4 text-white" />
                <span>Virtual Sinfxonani sinash</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Dual Business Model Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Platformadagi Ikkala Biznes Modeli
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-xs sm:text-sm mt-2">
            Har ikkala yo‘nalish mustaqil ishlaydi va bir-birining daromad yoki hisob tizimiga xalal bermaydi.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Model A: Learning Center SaaS */}
          <div className="bg-white dark:bg-[#0B1220] rounded-3xl border border-slate-200 dark:border-[#1F5BFF]/30 p-8 shadow-sm flex flex-col justify-between hover:border-[#1F5BFF] transition group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-[#1F5BFF]/20 text-[#1F5BFF] dark:text-[#8EC5FF] flex items-center justify-center font-bold">
                <Building2 className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#1F5BFF] dark:text-[#8EC5FF] bg-blue-50 dark:bg-[#1F5BFF]/15 px-2.5 py-0.5 rounded-full inline-block border border-[#1F5BFF]/30">
                Biznes Modeli A
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                O‘quv Markazlari SaaS (CRM / ERP)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Ta’lim markazlari ro‘yxatdan o‘tadi, o‘z shaxsiy brendingi va filiallarini ulaydi,
                o‘qituvchilar va o‘quvchilar bazasini boshqaradi.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Standard ($80), Premium ($112), Pro+ ($200) oylik tariflar
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  30 kunlik avtomatlashtirilgan obuna uzaytirish davri
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Super Admin tomonidan tasdiqlanuvchi to‘lovlar (review_manual_payment)
                </li>
              </ul>
            </div>

            <button
              onClick={() => {
                enterPreview('lc_admin');
                setActiveView('dashboard');
              }}
              className="mt-8 w-full py-3 rounded-xl bg-[#050B1A] dark:bg-[#1F5BFF]/20 hover:bg-[#1F5BFF] text-white font-bold text-xs transition flex items-center justify-center gap-2 border border-[#1F5BFF]/40"
            >
              <span>Markaz Administratori sifatida sinash</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* Model B: Independent Teacher Marketplace */}
          <div className="bg-white dark:bg-[#0B1220] rounded-3xl border border-slate-200 dark:border-[#1F5BFF]/30 p-8 shadow-sm flex flex-col justify-between hover:border-emerald-500 transition group">
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400 flex items-center justify-center font-bold">
                <GraduationCap className="w-6 h-6" />
              </div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/15 px-2.5 py-0.5 rounded-full inline-block border border-emerald-500/30">
                Biznes Modeli B
              </span>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                Mustaqil O‘qituvchilar Bozori (Marketplace)
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                Markazlarga bog‘liq bo‘lmagan repetitorlar verifikatsiyadan o‘tadi, 1–3 kishilik
                mini-guruhlarda dars beradi va har bir to‘lovdan <strong>83% sof daromad</strong> oladi.
              </p>

              <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300 pt-2">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Qat’iy qoida: 83% O‘qituvchiga, 17% ENVO platformasiga
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Har bir guruhda 1–3 o‘quvchi chegarasi (tizimli nazorat)
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  Integratsiyalashgan WebRTC virtual sinfxona & doska
                </li>
              </ul>
            </div>

            <button
              onClick={() => setActiveView('marketplace')}
              className="mt-8 w-full py-3 rounded-xl bg-[#1F5BFF] hover:bg-emerald-600 text-white font-bold text-xs transition flex items-center justify-center gap-2 shadow-md shadow-[#1F5BFF]/30"
            >
              <span>Mustaqil O‘qituvchilar bozoriga kirish</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </section>

      {/* SaaS Pricing Plans Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-50 dark:bg-[#0A1530] rounded-3xl p-8 sm:p-12 border border-slate-200 dark:border-[#1F5BFF]/30 transition-colors">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white">
              O‘quv Markazlari SaaS Obuna Rejalari
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              30 kunlik davr bilan uzaytiriluvchi qat’iy belgilangan narxlar
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAAS_PLANS.map((plan) => (
              <div
                key={plan.id}
                className="bg-white dark:bg-[#0B1220] rounded-2xl p-6 border border-slate-200 dark:border-[#1F5BFF]/20 shadow-xs flex flex-col justify-between transition-colors"
              >
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">{plan.name}</h3>
                  <div className="mt-2 flex items-baseline gap-2">
                    <span className="text-2xl font-extrabold text-slate-900 dark:text-[#8EC5FF]">
                      {formatUSD(plan.priceUsd)}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {formatUSD(plan.oldPriceUsd)}
                    </span>
                    <span className="text-xs text-slate-500 dark:text-slate-400">/ 30 kun</span>
                  </div>
                  <ul className="mt-4 space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    {plan.features.slice(0, 5).map((f, i) => (
                      <li key={i} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-[#1F5BFF] dark:text-[#8EC5FF] flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <button
                  onClick={() => setActiveView('center_saas')}
                  className="mt-6 w-full py-2.5 rounded-xl bg-slate-900 dark:bg-[#1F5BFF]/20 hover:bg-[#1F5BFF] text-white font-bold text-xs transition border border-[#1F5BFF]/30"
                >
                  Markaz uchun tanlash
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};
