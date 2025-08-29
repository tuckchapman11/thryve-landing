'use client'
import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';

const PRODUCT_IMG = '/heroproduct.png'; // make sure this exists in /public

// Benefits (icons live in /public)
const benefits = [
  { text: 'Boosts focus and memory',           icon: '/brainbenefit.png', alt: 'Brain icon' },
  { text: 'Promotes muscle gain',              icon: '/dbbenefit.png',    alt: 'Dumbbell icon' },
  { text: 'Fights muscle loss',                icon: '/bicepshield.png',  alt: 'Bicep + shield icon' },
  { text: 'Builds long term brain resilience', icon: '/brainshield.png',  alt: 'Brain + shield icon' },
];

// Product slides (images live in /public)
const productSlides = [
  { src: '/lemonadeflavor.png', alt: 'Lemonade flavor' },
  { src: '/nutritionfacts.png', alt: 'Nutrition facts' },
];

const reviews = [
  { quote: "I've been tryng to find a mind and muscle longevity supplement for a while now so this is really exciting. Lemonade flavor is AMAZING too!", name: "Ethan M.",  rating: 5.0 },
  { quote: "Simple stack that actually makes sense. Makes me happy to know I'm supporting not just muscle longevity but also brain longevity.",   name: "Marcus R.", rating: 5.0 },
  { quote: "Big fan of the lemonade flavor! It's the first thing I take every morning. Excited to see some other flavors though.",                        name: "Tessa K.",  rating: 4.5 },
  { quote: "Definitely seeing strength gains with the formula, also nice to have it paired with a brain support supp.",                                     name: "Riley S.",  rating: 5.0 },
  { quote: "Love the combined creatine with citicoline. Nice to have a muscle AND mind longevity supplement.",                                               name: "Jordan L.", rating: 5.0 },
];

// --- FAQ data ---
const shippingPaymentFaq = [
  {
    q: 'Is checkout secure?',
    a: 'Yes. Payments are handled through Stripe, a leading global payment processor used by brands like Amazon, Lyft, and Shopify. We never see or store your card details.',
  },
  {
    q: 'Am I charged right away or when it ships?',
    a: 'You’ll be charged today to reserve your bottle and lock in launch pricing. If your plans change, you can cancel for a full refund anytime before shipment.',
  },
  {
    q: 'When will my order ship?',
    a: 'Our first production run is scheduled for Fall 2025. As soon as inventory is ready, we’ll email you with tracking details. You’ll also get priority access since launch reservations ship first.',
  },
  {
    q: 'Is this a subscription?',
    a: 'No. This is a one-time purchase for our launch run. Subscriptions may be available later, but your reservation today is a single order only.',
  },
];

const supplementUseFaq = [
  {
    q: 'When should I take it?',
    a: 'Once daily, anytime that fits your routine. What matters most is daily consistency. The long-term benefits build with regular use.',
  },
  {
    q: 'Is it stimulant-free?',
    a: 'Yes. No caffeine or harsh stimulants. You’ll feel steadier focus, not a jittery spike.',
  },
  {
    q: 'Will this replace my preworkout?',
    a: 'No, this isn’t designed to replace your preworkout. Think of it as your foundation supplement for long-term strength, cognition, and resilience.',
  },
  {
    q: 'What about flavors and ingredients?',
    a: 'No sugar and a minimal, clean ingredient label. Lemonade will be the first released flavor.',
  },
];

// ----- Bulletproof star rating -----
function StarIcon({ size = 20, className = "" }) {
  return (
    <svg viewBox="0 0 20 20" width={size} height={size} aria-hidden="true" className={`block ${className}`}>
      <path d="M10 1.8l2.47 5.01 5.54.8-4 3.9.94 5.5L10 14.9 5.05 17l.95-5.5-4-3.9 5.54-.8L10 1.8z" fill="currentColor"/>
    </svg>
  );
}
function StarUnit({ fill = 1, size = 20 }) {
  const pct = Math.max(0, Math.min(fill, 1)) * 100;
  return (
    <span className="relative inline-block" style={{ width: size, height: size, lineHeight: 0 }}>
      <StarIcon size={size} className="text-gray-300" />
      <span className="absolute left-0 top-0 h-full overflow-hidden" style={{ width: `${pct}%` }}>
        <StarIcon size={size} className="text-amber-500" />
      </span>
    </span>
  );
}
function StarRating({ value = 5, size = 20, className = "" }) {
  return (
    <span
      className={`inline-flex items-center gap-1 ${className}`}
      role="img"
      aria-label={`${value.toFixed(1)} out of 5 stars`}
      style={{ lineHeight: 0 }}
    >
      {[0,1,2,3,4].map(i => (
        <StarUnit key={i} size={size} fill={value - i} />
      ))}
    </span>
  );
}
// -----------------------------------

function RefundIcon({ className = "h-5 w-5" }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" className={className} aria-hidden="true">
      <path d="M9 7H6v3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 10a8 8 0 1 0 8-8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ThryveLanding() {
  const [sticky, setSticky] = useState(false);



  // measure sticky height once and on resize
  const [stickyH, setStickyH] = useState(0);
  useEffect(() => {
    const el = document.querySelector('[data-sticky-cta]');
    const measure = () =>
      setStickyH(el ? Math.ceil(el.getBoundingClientRect().height) : 0);
    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, []);

  // Product slider
  const [slide, setSlide] = useState(0);
  const nextSlide = () => setSlide((s) => (s + 1) % productSlides.length);
  const prevSlide = () => setSlide((s) => (s - 1 + productSlides.length) % productSlides.length);

  // Reviews slider (desktop)
  const reviewsRef = useRef(null);
  const scrollReviews = (dir = 1) => {
    const el = reviewsRef.current;
    if (!el) return;
    const width = el.getBoundingClientRect().width;
    const amount = Math.round(width * 0.9);
    el.scrollBy({ left: dir * amount, behavior: 'smooth' });
  };

// ✅ Sticky shows whenever the top logo strip is NOT visible.
//    It hides only when that strip is visible (top of page).
useEffect(() => {
  const topLogo = document.getElementById('top-logo-strip');
  if (!topLogo) return;

  const io = new IntersectionObserver(
    ([entry]) => {
      // any part of the logo strip visible => hide sticky
      setSticky(!entry.isIntersecting);
    },
    // small thresholds help prevent flicker on partial pixels
    { threshold: [0, 0.01] }
  );

  io.observe(topLogo);
  return () => io.disconnect();
}, []);



  const scrollToOffer = (e) => {
    e?.preventDefault?.();
    const target = document.getElementById('offer');
    if (!target) return;
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const [openSP, setOpenSP] = useState(() => shippingPaymentFaq.map(() => false));
  const [openSU, setOpenSU] = useState(() => supplementUseFaq.map(() => false));
  const toggleFaq = (cat, i) => {
    if (cat === 'sp') setOpenSP(prev => prev.map((v, idx) => (idx === i ? !v : v)));
    else setOpenSU(prev => prev.map((v, idx) => (idx === i ? !v : v)));
  };

  return (
    // 👇 clamp any horizontal overflow (fixes black gutter on mobile)
    <div className="min-h-screen bg-white text-gray-900 antialiased overflow-x-hidden">
      
{/* Sticky top CTA */}
<div
  data-sticky-cta
  className={`fixed left-0 right-0 top-0 z-[9999] transition-transform duration-300 ${
    sticky ? 'translate-y-0' : '-translate-y-full'
  }`}
>
  <div className="mx-auto max-w-6xl px-4">
    {/* keep pill narrower than viewport and centered on mobile */}
    <div className="
      mt-3
      mx-auto w-[min(640px,calc(100vw-1.5rem))] md:w-auto md:mx-0
      rounded-2xl border border-gray-200 bg-white/90 backdrop-blur p-2 shadow-md
    ">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Image
            src="/logo.png"
            alt="Thryve logo"
            width={120}
            height={28}
            className="h-6 w-auto md:h-7"
            priority
          />
        </div>
        <a
          href="#offer"
          onClick={scrollToOffer}
          className="rounded-xl bg-emerald-500 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-emerald-600"
        >
          Reserve Now
        </a>
      </div>
    </div>
  </div>
</div>



{/* Brand logo strip — full-bleed, no top gap */}
<section id="top-logo-strip" className="relative mt-0 mb-8 md:mb-10">
  <div className="relative left-1/2 right-1/2 -ml-[50vw] -mr-[50vw] w-screen overflow-hidden bg-white/90 border-b border-emerald-100 shadow-sm">
    {/* green bubbly glow */}
    <div className="pointer-events-none absolute inset-0">
      <div className="absolute -left-24 -top-16 h-48 w-48 rounded-full bg-emerald-200/55 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-24 w-64 rounded-full bg-[radial-gradient(closest-side,theme(colors.teal.200),transparent)] opacity-70 blur-2xl" />
      <div className="absolute -right-24 -bottom-16 h-52 w-52 rounded-full bg-cyan-200/50 blur-3xl" />
    </div>

    {/* centered logo within your page width */}
    <div className="relative z-10 mx-auto max-w-6xl px-4 py-3 md:py-4 flex justify-center">
      <Image
        src="/logo.png"
        alt="Thryve Daily"
        width={220}
        height={70}
        className="h-8 md:h-12 w-auto"
        priority
      />
    </div>
  </div>
</section>


{/* HERO */}
<header className="relative bg-white pt-8 md:pt-10 pb-10 md:pb-12 -mb-8 md:-mb-12">
  <div className="mx-auto max-w-6xl px-4 text-center">

    {/* Badge — smaller on mobile only */}
    <p className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-emerald-200 bg-emerald-50
                   px-2 py-0.5 text-[10px] font-semibold text-emerald-700
                   md:px-3 md:py-1 md:text-xs">
      One Scoop Daily Formula
    </p>

    {/* Headline */}
    <h1 className="max-w-3xl mx-auto font-extrabold leading-tight tracking-tight
                   text-2xl md:text-5xl">
      Daily Mind + Muscle Defense
    </h1>

    {/* Subheadline */}
    <p className="mt-4 max-w-2xl mx-auto text-gray-600
                  text-[15px] leading-6 md:text-lg md:leading-7">
      Clinically Proven Ingredients to Support Muscle & Memory Health as You Age
    </p>

    {/* CTA — moved UP on mobile; desktop unchanged */}
    <div className="relative z-10 mt-3 md:mt-6 flex justify-center">
      <a
        href="#offer"
        onClick={scrollToOffer}
        className="rounded-2xl bg-emerald-500 px-5 py-2.5 text-[15px] font-semibold text-white shadow-sm
                   hover:bg-emerald-600 md:px-6 md:py-3 md:text-base"
      >
        Reserve Your Discounted Bottle
      </a>
    </div>

    {/* Reassurance lines — small, and spaced to match CTA gap on mobile */}
    <p className="relative z-10 mt-3 text-[11px] leading-tight text-gray-500 md:mt-2 md:text-xs">
      Secure your spot for launch — ships fall 2025
    </p>
    <div className="relative z-10 mt-3 md:mt-3 flex items-center justify-center gap-3
                    text-[11px] text-gray-500 md:text-xs">
      <div className="flex items-center gap-1.5">
        <span className="shrink-0">🔒</span>
        <span>Secure checkout (Stripe)</span>
      </div>
      <span className="opacity-40">•</span>
      <div>Refund ANYTIME before shipment</div>
    </div>

    {/* Product image — bigger on mobile, pushed DOWN away from reassurance */}
    <div className="relative mt-8 md:-mt-9 mx-auto w-full max-w-[1050px] md:max-w-[1150px] z-0">
      <Image
        src={PRODUCT_IMG}
        alt="Thryve — Mind + Muscle Defense"
        width={2200}
        height={2200}
        priority
        sizes="(max-width: 768px) 100vw, 1050px"
        className="w-full h-auto max-h-[96vh] md:max-h-[85vh] object-contain
                   scale-[1.22] md:scale-100"
      />
    </div>

    {/* Trust bar — compact on mobile; desktop unchanged */}
    <div className="relative z-30 mx-auto mt-4 md:-mt-28 lg:-mt-32 max-w-6xl">
      <div className="relative overflow-hidden rounded-xl border border-gray-200 bg-white p-2 md:p-4 shadow-sm">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -left-8 -top-8 h-24 w-24 rounded-full blur-xl opacity-50 bg-[radial-gradient(closest-side,theme(colors.sky.200),transparent)]" />
          <div className="absolute left-1/2 top-0 -translate-x-1/2 h-16 w-40 blur-xl opacity-40 bg-[radial-gradient(closest-side,theme(colors.cyan.200),transparent)]" />
          <div className="absolute -right-8 -bottom-8 h-24 w-24 rounded-full blur-xl opacity-50 bg-[radial-gradient(closest-side,theme(colors.indigo.200),transparent)]" />
        </div>

        {/* Mobile: one compact row, no scroll */}
        <ul className="relative z-10 md:hidden grid grid-cols-3 text-center text-[12px] font-semibold text-gray-700 leading-tight">
          <li className="px-2 py-1.5">Clinically backed</li>
          <li className="px-2 py-1.5 border-x border-gray-200">Made in USA</li>
          <li className="px-2 py-1.5">Zero sugar</li>
        </ul>

        {/* Desktop/tablet: keep the existing 4-up grid */}
        <div className="relative z-10 hidden md:grid grid-cols-2 lg:grid-cols-4 gap-3 text-center text-sm font-medium text-gray-600">
          {[
            'Clinically backed ingredients',
            'Made in USA • cGMP facility',
            'No proprietary blends • Clinically dosed',
            'Zero sugar • Daily use',
          ].map((t) => (
            <div key={t}>{t}</div>
          ))}
        </div>
      </div>
    </div>

  </div>
</header>

{/* sentinel: hero end (controls sticky show) */}
<div id="sticky-show-after-hero" className="h-px w-full pointer-events-none" />


{/* PROBLEM — compact on mobile; desktop unchanged */}
<section className="relative mx-auto max-w-6xl px-4 py-12 md:py-28">
  <div className="relative overflow-hidden rounded-3xl border border-gray-200 shadow-sm md:min-h-[78vh] bg-gradient-to-b from-sky-50 via-cyan-50/40 to-white">
    {/* subtle vignette + grain + light blue bubbly glows */}
    <div className="pointer-events-none absolute inset-0">
      {/* soft blue “bubbles” */}
      <div className="absolute -left-24 -top-20 h-56 w-56 rounded-full bg-sky-200/45 blur-3xl" />
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-28 w-72 rounded-full bg-[radial-gradient(closest-side,theme(colors.cyan.200),transparent)] opacity-60 blur-2xl" />
      <div className="absolute -right-24 -bottom-24 h-64 w-64 rounded-full bg-blue-200/40 blur-3xl" />

      {/* vignette + grain (kept) */}
      <div className="absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)] bg-neutral-900/5" />
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-multiply"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='160' height='160' viewBox='0 0 160 160'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.8' numOctaves='4' stitchTiles='stitch'/></filter><rect width='100%' height='100%' filter='url(%23n)' opacity='0.35'/></svg>\")",
          backgroundSize: '160px 160px',
        }}
      />
    </div>

    {/* content (mobile: narrowed & smaller; md+: original sizing) */}
    <div className="relative z-10 mx-auto w-full max-w-[30rem] md:max-w-none px-3 sm:px-4 md:px-10 pt-8 md:pt-16 pb-10 md:pb-20">
      <h2 className="text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">It Starts At Age 30...</h2>

      {/* Hide the long paragraph on mobile; keep on md+ */}
      <p className="hidden md:block mt-4 text-base text-gray-700 md:pr-2">
        Your lifts start to feel a bit heavier, you aren't recovering like you were in your 20’s, and your focus just
        slips in ways you can’t control. Left unchecked, aging can take a toll on your mind and muscle sooner and
        faster than expected.
      </p>

      <div className="mt-6 md:mt-16 grid gap-4 sm:gap-5 md:gap-8 md:grid-cols-3">
        {[
          {
            icon: '/dumbbell.png',
            alt: 'dumbbell icon',
            title: 'Muscle Loss',
            body:
              'Your strength quietly starts to slip away. That means less power in the gym, less definition in the mirror, and a body that feels weaker with age.',
          },
          {
            icon: '/timer.png',
            alt: 'hourglass icon',
            title: 'Slower Recovery',
            body:
              'Soreness starts to hang around for weeks. Small tweaks turn into nagging injuries, and the workouts that once energized you start to feel like a grind.',
          },
          {
            icon: '/brain.png',
            alt: 'brain icon',
            title: 'Fading Focus',
            body:
              'Your brain doesn’t fire like it used to. You lose your train of thought mid-sentence, forget simple tasks, and struggle to focus in the gym and at work.',
          },
        ].map((f) => (
          <div
            key={f.title}
            className="rounded-lg md:rounded-2xl border border-gray-200 bg-white p-4 md:p-9 shadow-sm text-center"
          >
            {/* icon box (smaller on mobile) */}
            <div className="mx-auto mb-3 md:mb-6 flex h-12 w-12 md:h-16 md:w-16 items-center justify-center rounded-xl border-[1.6px] border-gray-900/80">
              <img src={f.icon} alt={f.alt} className="h-7 w-7 md:h-10 md:w-10 object-contain" />
            </div>

            <div className="text-base md:text-xl font-semibold">{f.title}</div>
            <p className="mt-2 md:mt-4 text-[13px] leading-6 md:text-sm text-gray-600">{f.body}</p>
          </div>
        ))}
      </div>
    </div>
  </div>
</section>



{/* SOLUTION / OUTCOMES — Benefits left, product image on the right */}
<section className="relative mx-auto max-w-6xl px-4 py-12 md:py-16">
  {/* Big product image on the RIGHT (desktop only) */}
  <div className="pointer-events-none absolute inset-y-0 right-[-10%] hidden md:flex items-center z-0 overflow-hidden">
    <div className="relative h-full max-h-[80vh] w-[64vw] max-w-[1280px] min-w-[620px]">
      <Image
        src="/benefitsproductpic.png"
        alt="Thryve Daily — product"
        fill
        priority
        sizes="(min-width: 1024px) 60vw, 100vw"
        className="object-contain scale-[1.24]"
      />
    </div>
  </div>

  {/* 2-col grid */}
  <div className="relative z-10 grid items-start gap-10 md:grid-cols-2">
    {/* LEFT: copy + benefits */}
    <div>
      {/* Mobile-only size drop to match other section headers */}
      <h2 className="text-xl md:text-4xl font-bold">But You Can Do Something About It</h2>

      {/* Mobile-only subhead size; desktop restored to original defaults */}
      <p className="mt-3 text-gray-600 text-[15px] leading-6 md:text-base md:leading-6">
        A clinically proven formula that defends your strength, speeds up recovery, and keeps your mind sharp as you age.
      </p>

      {/* Benefits — smaller on mobile */}
      <ul className="mt-6 space-y-3 md:space-y-4">
        {benefits.map((b) => (
          <li key={b.text} className="flex items-center gap-3 md:gap-4">
            <div className="flex h-10 w-10 md:h-14 md:w-14 items-center justify-center rounded-2xl bg-emerald-50 ring-1 ring-emerald-100">
              <img src={b.icon} alt={b.alt} className="h-6 w-6 md:h-11 md:w-11 object-contain" />
            </div>
            <span className="text-[15px] md:text-lg font-semibold leading-tight">{b.text}</span>
          </li>
        ))}
      </ul>

      {/* Mobile product image — bigger, centered, behind the CTA */}
      <div className="md:hidden mt-1">
        <div className="mx-auto w-[min(820px,calc(100vw-1rem))]">
          <div className="relative aspect-square overflow-hidden z-0 pointer-events-none">
            <Image
              src="/benefitsproductpic.png"
              alt="Thryve Daily — product"
              fill
              priority
              sizes="(max-width: 768px) 100vw, 820px"
              className="object-contain origin-center scale-[1.7]"
            />
          </div>
        </div>
      </div>

      {/* Mobile CTA — pulled up and above the image */}
      <div className="md:hidden flex justify-center relative z-10 -mt-4">
        <a
          href="#offer"
          onClick={scrollToOffer}
          className="rounded-2xl bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-600"
        >
          Reserve Now
        </a>
      </div>

    </div>

    {/* RIGHT: desktop CTA — unchanged */}
    <div className="hidden md:flex h-full items-end justify-center z-10">
      <div className="md:-translate-x-4 md:transform">
        <a
          href="#offer"
          onClick={scrollToOffer}
          className="rounded-2xl bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-600"
        >
          Reserve Now
        </a>
      </div>
    </div>
  </div>
</section>



{/* SOCIAL PROOF (full-bleed on mobile, centered on desktop) */}
<section aria-label="Customer testimonials" className="py-10 md:py-16">
  {/* Desktop container */}
  <div className="md:mx-auto md:max-w-6xl md:px-6">
    <h3 className="px-4 md:px-0 text-xl md:text-2xl font-bold">
      What Early Testers Are Saying
    </h3>

    {/* MOBILE: full-bleed, snap-per-card scroller (unchanged) */}
    <div className="relative mt-4 md:hidden full-bleed">
      <ul
        ref={reviewsRef}
        className="
          flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-4
          [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden
          scroll-px-4
        "
      >
        {reviews.map((t) => (
          <li
            key={t.name}
            className="snap-center shrink-0 w-[calc(100vw-2rem)]"
          >
            <figure className="h-full rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-2">
                <StarRating value={t.rating} size={18} />
              </div>
              <blockquote className="text-[15px] leading-6 text-gray-700">
                “{t.quote}”
              </blockquote>
              <figcaption className="mt-3 text-sm font-semibold text-gray-600">
                {t.name}
              </figcaption>
            </figure>
          </li>
        ))}
      </ul>

      {/* mobile arrows (unchanged if you already added them) */}
      <button
        type="button"
        onClick={() => scrollReviews(-1)}
        aria-label="Scroll testimonials left"
        className="absolute left-4 top-1/2 flex md:hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300/70 bg-white/80 text-gray-900 shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-gray-400 z-10"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
      <button
        type="button"
        onClick={() => scrollReviews(1)}
        aria-label="Scroll testimonials right"
        className="absolute right-4 top-1/2 flex md:hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300/70 bg-white/80 text-gray-900 shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-gray-400 z-10"
      >
        <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
          <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>

    {/* DESKTOP/TABLET: scroller with a rounded container + shadow */}
    <div className="relative mt-6 hidden md:block">
      <div className="relative rounded-3xl border border-gray-200 bg-white/80 shadow-sm px-2 py-3">
        {/* left arrow */}
        <button
          type="button"
          onClick={() => scrollReviews(-1)}
          aria-label="Scroll testimonials left"
          className="absolute left-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300/70 bg-white/80 text-gray-900 shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-gray-400 md:flex z-10"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M12.5 4.5 7 10l5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        <ul
          ref={reviewsRef}
          className="
            flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1
            [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden
          "
        >
          {reviews.map((t) => (
            <li key={t.name} className="snap-start min-w-[40%] lg:min-w-[32%] xl:min-w-[28%]">
              <figure className="flex h-full min-h-[220px] flex-col rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex-1">
                  <StarRating value={t.rating} size={20} className="mb-3" />
                  <blockquote className="text-base leading-relaxed text-gray-700">“{t.quote}”</blockquote>
                </div>
                <figcaption className="mt-4 text-sm font-semibold text-gray-600">{t.name}</figcaption>
              </figure>
            </li>
          ))}
        </ul>

        {/* right arrow */}
        <button
          type="button"
          onClick={() => scrollReviews(1)}
          aria-label="Scroll testimonials right"
          className="absolute right-3 top-1/2 hidden h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-gray-300/70 bg-white/80 text-gray-900 shadow-sm transition hover:bg-white/90 focus:outline-none focus:ring-2 focus:ring-gray-400 md:flex z-10"
        >
          <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
            <path d="M7.5 4.5 13 10l-5.5 5.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>
    </div>
  </div>
</section>




{/* INGREDIENTS — mobile cards smaller & centered; desktop unchanged */}
<section id="actives" className="mx-auto max-w-[90rem] px-3 sm:px-6 py-12">
  <div className="relative mx-auto w-full max-w-[80rem] overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
    {/* backdrop (unchanged) */}
    <div className="pointer-events-none absolute inset-0 z-0">
      <div className="absolute inset-0 bg-gradient-to-b from-sky-50 via-sky-100 to-indigo-50" />
      <div className="absolute -top-24 -left-24 h-[28rem] w-[28rem] rounded-full blur-3xl opacity-80 bg-[radial-gradient(closest-side,theme(colors.sky.300),transparent)]" />
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 h-[20rem] w-[20rem] rounded-full blur-2xl opacity-70 bg-[radial-gradient(closest-side,theme(colors.cyan.300),transparent)]" />
      <div className="absolute -bottom-32 right-[-12%] h-[32rem] w-[32rem] rounded-full blur-3xl opacity-75 bg-[radial-gradient(closest-side,theme(colors.indigo.300),transparent)]" />
    </div>

    <div className="relative z-10 mx-auto max-w-6xl px-4 md:px-8 pt-8 md:pt-10 pb-10 md:pb-12">
      <div className="md:text-center">
        <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-left md:text-center">
          Two Proven Ingredients
        </h2>
        {/* Hide this subheader on mobile; show on desktop */}
        <p className="hidden md:block mt-2 max-w-3xl text-left md:text-center md:mx-auto text-[15px] md:text-base text-gray-600">
          Two of the most proven ingredients for your mind and muscles - combined into one daily scoop to keep you stronger and sharper for longer.
        </p>
      </div>

      {/* grid: center children on mobile so cards never clip */}
      <div className="mt-8 md:mt-10 grid grid-cols-1 md:grid-cols-[auto_auto] gap-y-6 md:gap-x-18 justify-items-center md:justify-items-stretch">

        {/* Citicoline */}
        <article
          className="
            w-[92%] max-w-[420px] md:w-[390px] lg:w-[410px]
            overflow-hidden rounded-2xl md:rounded-3xl border border-black bg-white shadow-sm
          "
        >
          <div className="relative h-40 sm:h-44 md:h-52 w-full">
            <Image
              src="/citicoline.png"
              alt="Citicoline (CDP-Choline)"
              fill
              className="object-cover"
              sizes="(min-width:1024px) 410px, (min-width:768px) 390px, 92vw"
            />
          </div>
          <div className="p-4 md:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-base md:text-lg font-semibold">Citicoline (CDP-Choline)</h3>
              <span className="rounded-full border border-gray-300 px-2.5 md:px-3 py-0.5 text-xs md:text-sm text-gray-800">
                250&nbsp;mg
              </span>
            </div>
            <div className="mt-2 md:mt-3 border-t border-gray-200 pt-2 md:pt-3">
              <p className="text-[13px] md:text-sm leading-6 text-gray-700">
                Supports memory, focus, and mental energy by boosting acetylcholine - the brain chemical for learning and recall.
                Feel sharper, stay focused longer, and protect clarity as you age.
              </p>
              <ul className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
                {['Focus', 'Memory', 'Neuroprotection'].map((t) => (
                  <li key={t} className="rounded-full border border-gray-300 px-2.5 py-0.5 text-[11px] md:text-xs font-medium text-gray-800">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        {/* Creatine */}
        <article
          className="
            w-[92%] max-w-[420px] md:w-[390px] lg:w-[410px]
            overflow-hidden rounded-2xl md:rounded-3xl border border-black bg-white shadow-sm
          "
        >
          <div className="relative h-40 sm:h-44 md:h-52 w-full">
            <Image
              src="/creatine.png"
              alt="Creatine Monohydrate"
              fill
              className="object-cover"
              sizes="(min-width:1024px) 410px, (min-width:768px) 390px, 92vw"
            />
          </div>
          <div className="p-4 md:p-5">
            <div className="flex items-baseline justify-between gap-3">
              <h3 className="text-base md:text-lg font-semibold">Creatine Monohydrate</h3>
              <span className="rounded-full border border-gray-300 px-2.5 md:px-3 py-0.5 text-xs md:text-sm text-gray-800">
                5&nbsp;g
              </span>
            </div>
            <div className="mt-2 md:mt-3 border-t border-gray-200 pt-2 md:pt-3">
              <p className="text-[13px] md:text-sm leading-6 text-gray-700">
                Clinically proven to boost muscle growth, recovery, and brain health. By raising phosphocreatine stores, creatine fuels quick energy (ATP) to build lean muscle, speed up recovery, and fight age-related decline.
              </p>
              <ul className="mt-2 md:mt-3 flex flex-wrap gap-1.5 md:gap-2">
                {['Strength', 'Power', 'Recovery'].map((t) => (
                  <li key={t} className="rounded-full border border-gray-300 px-2.5 py-0.5 text-[11px] md:text-xs font-medium text-gray-800">
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

      </div>
    </div>
  </div>
</section>



{/* PRODUCT + LAUNCH OFFER */}
<section
  id="offer"
  style={{ scrollMarginTop: `${stickyH + 12}px` }}
  className="mx-auto max-w-6xl px-4 py-16"
>
  {/* sentinel: hide sticky when offer is reached */}
  <div id="sticky-hide-near-offer" className="h-px w-full pointer-events-none" />

  <div className="grid items-start gap-8 md:grid-cols-2">
    {/* LEFT: Product gallery with thumbnails (small + centered) */}
    <div className="order-1">
      <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
        {/* Big image */}
        <div
          className="relative mx-auto aspect-square w-full max-w-[460px] rounded-2xl overflow-hidden bg-white"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'ArrowLeft') prevSlide();
            if (e.key === 'ArrowRight') nextSlide();
          }}
          aria-label="Product image gallery"
        >
          <Image
            key={productSlides[slide].src}
            src={productSlides[slide].src}
            alt={productSlides[slide].alt}
            fill
            priority
            className="object-contain p-4"
          />
          {/* Nav arrows */}
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 ring-1 ring-gray-200 px-2 py-1 hover:bg-white"
          >‹</button>
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 ring-1 ring-gray-200 px-2 py-1 hover:bg-white"
          >›</button>
        </div>

        {/* Thumbnails — smaller + centered */}
        <div className="mt-4 flex justify-center gap-3">
          {productSlides.map((img, i) => (
            <button
              key={img.src}
              type="button"
              onClick={() => setSlide(i)}
              aria-label={`View ${img.alt}`}
              className={`relative h-16 w-16 rounded-lg overflow-hidden border bg-white ${i === slide ? 'ring-2 ring-emerald-500' : 'hover:border-gray-300'}`}
            >
              <Image src={img.src} alt="" fill className="object-contain p-1.5" sizes="64px" />
            </button>
          ))}
        </div>
      </div>
    </div>

    {/* RIGHT: Launch offer — CTA on one line, scarcity under CTA (left-aligned) */}
    <div className="order-2 self-start">
      <div
        className="relative overflow-hidden rounded-3xl border border-emerald-100 bg-white p-6 md:p-8 shadow-sm
                   origin-top scale-[0.94] md:scale-100"
      >
        {/* bubbly emerald/teal/sky glow layer */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-16 -left-16 h-40 w-40 rounded-full bg-emerald-200/60 blur-3xl" />
          <div className="absolute left-1/2 top-1/3 -translate-x-1/2 h-24 w-72 rounded-full bg-[radial-gradient(closest-side,theme(colors.teal.200),transparent)] opacity-80 blur-2xl" />
          <div className="absolute -bottom-20 -right-20 h-56 w-56 rounded-full bg-sky-200/55 blur-3xl" />
        </div>

        <div className="relative z-10 flex flex-col">
          <h3 className="text-2xl font-bold">Launch Offer</h3>
          <p className="mt-2 text-gray-600">
            Reserve your bottle today and lock in discounted launch pricing. Ships fall 2025.
          </p>

          {/* Price row */}
          <div className="mt-4 flex items-end gap-3">
            <div className="text-5xl font-extrabold tracking-tight">$39</div>
            <div className="pb-1 text-gray-500 line-through">$49</div>
            <span className="ml-auto inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              Save 20%
            </span>
          </div>

          {/* Info pills */}
          <div className="mt-3 flex flex-wrap gap-1.5">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-800">
              <span aria-hidden className="text-[13px] leading-none">🍋</span> Lemonade
            </span>
            <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-800">30 Servings</span>
            <span className="inline-flex items-center rounded-full border border-gray-300 px-2.5 py-1 text-xs font-medium text-gray-800">Lasts ~1 month</span>
          </div>

          {/* CTA row + free-shipping pill, with scarcity directly under CTA */}
          <div className="mt-6 grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-2">
            {/* CTA (single line) */}
            <a
              id="buy"
              href="https://buy.stripe.com/dRmaEY8Zc1cA0D0dFYgQE0b"
              className="inline-flex items-center justify-center rounded-2xl bg-emerald-500 px-6 py-3 text-base font-semibold text-white shadow-sm hover:bg-emerald-600"
            >
              Reserve Your Spot
            </a>

            {/* Free shipping pill to the right */}
            <div className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path d="M3 8h10v7H3z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <path d="M13 11h4l3 3v4h-7v-7z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round"/>
                <circle cx="7" cy="19" r="2" stroke="currentColor" strokeWidth="1.8"/>
                <circle cx="18" cy="19" r="2" stroke="currentColor" strokeWidth="1.8"/>
              </svg>
              Free U.S. shipping included
            </div>

            {/* Scarcity — sits under CTA, aligned with CTA's left edge */}
            <div className="col-start-1 col-end-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-800 ring-1 ring-amber-200">
                <svg width="14" height="14" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M10 2l8 14H2L10 2z" stroke="currentColor" strokeWidth="1.6" />
                  <circle cx="10" cy="14.5" r="1" fill="currentColor" />
                  <path d="M10 7.5v4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                </svg>
                Only 250 bottles available — selling fast.
              </span>
            </div>
          </div>

          {/* How Preorder Works (unchanged) */}
          <div className="mt-6 rounded-2xl border border-emerald-100 bg-emerald-50/40 p-4 md:p-5">
            <div className="text-sm font-semibold text-gray-900">How Preorder Works</div>
            <ol className="mt-3 grid gap-3 sm:grid-cols-3 text-sm text-gray-700">
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-emerald-100 text-emerald-600">
                  {/* credit card with lock */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <rect x="3" y="8" width="18" height="10" rx="2" stroke="currentColor" strokeWidth="1.8"/>
                    <path d="M8 8V6a4 4 0 118 0v2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"/>
                  </svg>
                </span>
                <span>Checkout now to lock in launch pricing and your limited spot.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-emerald-100 text-emerald-600">
                  {/* star / badge */}
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path d="M12 3l2.6 5.3 5.9.9-4.3 4.1 1 5.8L12 16.9 6.8 20l1-5.8-4.3-4.1 5.9-.9L12 3z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round"/>
                  </svg>
                </span>
                <span>Get priority access for the first production run.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-8 w-8 items-center justify-center rounded-full bg-white ring-1 ring-emerald-100 text-emerald-600">
                  <RefundIcon className="h-5 w-5" />
                </span>
                <span>Cancel payment for a full refund anytime before we ship.</span>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  </div>
</section>


{/* FAQ */}
<section className="mx-auto max-w-6xl px-4 py-8 md:py-12">
  <h3 className="text-lg md:text-2xl font-bold">FAQ</h3>

  <div className="mt-5 md:mt-8 space-y-6 md:space-y-12">
    {/* Shipping & Payment */}
    <div>
      <h4 className="text-sm md:text-lg font-semibold text-gray-900">Shipping &amp; Payment</h4>
      {/* prevent card stretching */}
      <div className="mt-3 md:mt-4 grid gap-3 md:gap-4 md:grid-cols-2 items-start">
        {shippingPaymentFaq.map((f, i) => {
          const open = openSP[i];
          const contentId = `sp-a-${i}`;
          return (
            <div
              key={f.q}
              className="rounded-xl md:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => toggleFaq('sp', i)}
                className="w-full flex items-center justify-between gap-3 md:gap-4 p-3 md:p-5 text-left"
              >
                <span className="font-semibold text-gray-900 text-[13px] md:text-base">{f.q}</span>
                <svg
                  className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20" fill="none" aria-hidden="true"
                >
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                id={contentId}
                className={`${open ? 'block' : 'hidden'} px-3 pb-3 md:px-5 md:pb-5 text-[12px] leading-5 md:text-sm md:leading-relaxed text-gray-600`}
              >
                {f.a}
              </div>
            </div>
          );
        })}
      </div>
    </div>

    {/* Supplement Use */}
    <div>
      <h4 className="text-sm md:text-lg font-semibold text-gray-900">Supplement Use</h4>
      {/* prevent card stretching */}
      <div className="mt-3 md:mt-4 grid gap-3 md:gap-4 md:grid-cols-2 items-start">
        {supplementUseFaq.map((f, i) => {
          const open = openSU[i];
          const contentId = `su-a-${i}`;
          return (
            <div
              key={f.q}
              className="rounded-xl md:rounded-2xl border border-gray-200 bg-white shadow-sm overflow-hidden"
            >
              <button
                type="button"
                aria-expanded={open}
                aria-controls={contentId}
                onClick={() => toggleFaq('su', i)}
                className="w-full flex items-center justify-between gap-3 md:gap-4 p-3 md:p-5 text-left"
              >
                <span className="font-semibold text-gray-900 text-[13px] md:text-base">{f.q}</span>
                <svg
                  className={`h-4 w-4 md:h-5 md:w-5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
                  viewBox="0 0 20 20" fill="none" aria-hidden="true"
                >
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </button>
              <div
                id={contentId}
                className={`${open ? 'block' : 'hidden'} px-3 pb-3 md:px-5 md:pb-5 text-[12px] leading-5 md:text-sm md:leading-relaxed text-gray-600`}
              >
                {f.a}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  </div>
</section>



{/* FOOTER */}
<footer className="border-t border-gray-200 bg-white py-10">
  <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 md:flex-row">
    <div className="flex items-center gap-2">
      <Image
        src="/logo.png"
        alt="Thryve Daily"
        width={160}
        height={40}
        className="h-8 md:h-9 w-auto"
        priority={false}
      />
    </div>
    <div className="text-xs text-gray-500">© {new Date().getFullYear()} Thryve Daily. All rights reserved.</div>
  </div>
</footer>

    </div>
  );
}
