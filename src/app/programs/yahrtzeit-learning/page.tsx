"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// The actual curriculum the avreichim learn l'ilui nishmas the niftar, selected
// for a yahrtzeit by the Chida and the mekubalim. (he = Hebrew; note = the kavana.)
const LIMUDIM: {
  category: string;
  items: { en: string; he: string; note?: string; excerpt?: boolean }[];
}[] = [
  {
    category: "Mishnayos",
    items: [
      {
        en: "Individual mishnayos spelling the niftar's name",
        he: "משניות (בודדות) על שם הנפטר",
        note: "The essence of the tikkun — the neshama is illuminated through the letters of its name.",
      },
      {
        en: "Maseches Mikvaos, Perek 7",
        he: "מסכת מקוואות פרק ז׳",
        note: "The first letters of the last four mishnayos spell נשמה (neshama).",
      },
      {
        en: "Maseches Keilim, Perek 24",
        he: "מסכת כלים פרק כ״ד",
        note: "Each mishnah closes with “l'taher mikulam” — a remez to the neshama.",
      },
    ],
  },
  {
    category: "Tehillim",
    items: [
      {
        en: "The Bnei Korach kapitlach",
        he: "תהילים — פרקי בני קרח",
        note: "Eight mizmorim that raise the neshama from the levels of Gehinnom.",
      },
    ],
  },
  {
    category: "Chumash",
    items: [
      { en: "Parshas Bereishis (Rishon–Sheni)", he: "פרשת בראשית", excerpt: true },
      { en: "Birkas Kohanim (Parshas Naso)", he: "ברכת כהנים — פרשת נשא", excerpt: true },
      { en: "Vayehi Binso'a HaAron (Parshas Beha'aloscha)", he: "ויהי בנסוע הארון — פרשת בהעלותך", excerpt: true },
      { en: "Parshas Zos HaBracha", he: "פרשת זאת הברכה", excerpt: true },
    ],
  },
  {
    category: "Nevi'im & Kesuvim",
    items: [
      { en: "Shmuel I, Perek 2", he: "שמואל א׳ פרק ב׳", excerpt: true },
      { en: "Yeshaya", he: "ישעיה", excerpt: true },
      { en: "Mishlei, Perek 16", he: "משלי פרק ט״ז", excerpt: true },
      { en: "Mishlei, Perek 31", he: "משלי פרק ל״א", excerpt: true },
    ],
  },
  {
    category: "Gemara",
    items: [
      {
        en: "Berachos 15b",
        he: "ברכות דף ט״ו:",
        note: "גמרא is the roshei teivos of the malachei rachamim — Gavriel, Michael, Refael, Uriel.",
        excerpt: true,
      },
      { en: "Berachos 17a", he: "ברכות דף י״ז.", excerpt: true },
      { en: "Shabbos 89a", he: "שבת דף פ״ט.", excerpt: true },
      { en: "Makkos 23b–24a", he: "מכות דף כ״ג: – כ״ד.", excerpt: true },
      { en: "Sanhedrin 104b", he: "סנהדרין דף ק״ד:", excerpt: true },
      { en: "Zevachim 88b", he: "זבחים דף פ״ח:", excerpt: true },
      { en: "Menachos 43b", he: "מנחות דף מ״ג:", excerpt: true },
    ],
  },
  {
    category: "Zohar",
    items: [
      {
        en: "Zohar / Idra",
        he: "זוהר / אדרא",
        note: "Per the mekubalim, Zohar — from mazhir — illuminates the neshama more than revealed limud.",
        excerpt: true,
      },
    ],
  },
];

export default function YahrtTime() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    niftar: "",
    yahrtzeit: "",
    hebrewDate: "",
    relationship: "",
    notes: "",
  });

  // Floating "Dedicate a Limud" CTA. It arms only once the reader reaches the
  // "How It Works" section (so it never covers the interactive Limudim accordion
  // above it), and retires for good once the form is reached (so it doesn't
  // resurrect over the Questions/footer). Pure IntersectionObservers — no scroll
  // listener.
  const [showFloat, setShowFloat] = useState(false);
  useEffect(() => {
    const how = document.getElementById("how");
    const register = document.getElementById("register");
    let armed = false;
    let reachedForm = false;
    let registerVisible = false;
    const update = () => setShowFloat(armed && !reachedForm && !registerVisible);
    const ioHow = how
      ? new IntersectionObserver(
          ([e]) => {
            if (e.isIntersecting) armed = true;
            update();
          },
          { threshold: 0.1 }
        )
      : null;
    const ioReg = register
      ? new IntersectionObserver(
          ([e]) => {
            registerVisible = e.isIntersecting;
            if (e.isIntersecting) reachedForm = true;
            update();
          },
          { threshold: 0.12 }
        )
      : null;
    if (how && ioHow) ioHow.observe(how);
    if (register && ioReg) ioReg.observe(register);
    return () => {
      ioHow?.disconnect();
      ioReg?.disconnect();
    };
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Email submission logic here
    const subject = encodeURIComponent("Yahrtzeit Learning Program Request");
    const body = encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Niftar Name: ${formData.niftar}
Yahrtzeit Date (Hebrew): ${formData.hebrewDate}
Yahrtzeit Date (English): ${formData.yahrtzeit}
Relationship: ${formData.relationship}

Additional Notes:
${formData.notes}`);

    window.location.href = `mailto:kbtdraw@gmail.com?subject=${subject}&body=${body}`;
  };

  return (
    <main>
      {/* Hero — rendered statically (no entrance animation) so the LCP headline
          paints immediately and isn't gated behind JS hydration. */}
      <section className="relative min-h-[72vh] flex items-center justify-center overflow-hidden bg-navy">
        <Image
          src="/pictures/beis-medrash-chandeliers.jpg"
          alt="Torah learning in the Kahal Beis Tefilla beis medrash"
          fill
          sizes="100vw"
          className="object-cover"
          priority
        />
        {/* Deep, even scrim keeps the headline zone calm and the tone somber */}
        <div className="absolute inset-0 bg-navy/55" />
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-navy/85 to-navy/80" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(27,42,74,0.5)_100%)]" />

        <div className="relative z-10 max-w-3xl mx-auto text-center px-6 py-24">
          <p className="eyebrow text-primary-light mb-4">Kahal Beis Tefilla</p>
          <h1 className="serif-heading text-primary text-5xl md:text-6xl font-bold mb-6 text-balance">
            Yahrtzeit Learning Program
          </h1>
          <div className="gold-divider mx-auto mb-6" />
          <p className="text-white/90 text-lg md:text-xl font-light text-pretty leading-relaxed">
            Honor a loved one&apos;s neshama with Torah learned in their memory &mdash; a
            curriculum of mishnayos, gemara, and zohar completed by the avreichim of our
            shul on the yahrtzeit.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mt-9">
            <a href="#register" className="btn btn-primary px-8 py-3.5 text-base">
              Dedicate a Limud
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </a>
            <a
              href="#how"
              className="inline-flex items-center gap-2 border border-white/30 text-white px-7 py-3.5 rounded-xl font-semibold hover:bg-white/10 hover:border-white/50 transition-all"
            >
              How it works
            </a>
          </div>

          <p className="mt-7 inline-flex items-center gap-2 bg-navy/50 backdrop-blur-sm rounded-full px-4 py-1.5 text-white/80 text-sm">
            Suggested donation $360 &middot; Payment only after the limud is completed
          </p>
        </div>
      </section>

      {/* Overview */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-10">
            <p className="eyebrow mb-3">A Curriculum With Meaning</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold mb-5">
              A Specific Limud for a Yahrtzeit
            </h2>
            <div className="gold-divider mx-auto mb-8" />
            <p className="text-navy/75 text-lg leading-relaxed text-pretty">
              With your donation, chashuva avreichim and members of the shul set aside
              time to learn l&apos;ilui nishmas your loved one on their yahrtzeit. Each
              limud is chosen for its specific significance &mdash; a curriculum selected
              for a yahrtzeit by the Chida and the mekubalim.
            </p>
          </motion.div>

          {/* The Limudim */}
          <motion.div variants={fadeUp} className="card p-7 sm:p-9 mt-10">
            <h3 className="serif-heading text-navy font-bold text-2xl mb-7 flex items-center gap-2.5">
              <BookIcon /> The Limudim
            </h3>
            <p className="text-navy/65 text-sm mb-5">
              Tap any section to see what is learned.
            </p>
            <div className="space-y-2.5">
              {LIMUDIM.map((group, i) => (
                <LimudGroup key={group.category} group={group} defaultOpen={i === 0} />
              ))}
            </div>
            <div className="mt-8 p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm text-navy/65 text-pretty">
                Items marked <span className="font-medium text-navy/75">excerpt</span> are learned as a portion.
                For the full sources and the kavanos behind each limud, we&apos;re always happy to share &mdash; just reach out.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        id="how"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light scroll-mt-20"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="eyebrow mb-3">Simple &amp; Meaningful</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold mb-5">
              How It Works
            </h2>
            <div className="gold-divider mx-auto" />
          </motion.div>

          <div className="relative grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-6">
            {/* Connecting rail (desktop) */}
            <div
              className="hidden md:block absolute top-7 left-[16.6%] right-[16.6%] h-0.5 bg-primary/25"
              aria-hidden
            />
            <StepCard
              number="1"
              title="Submit Your Request"
              description="Fill out the form below with the yahrtzeit details and your contact information."
            />
            <StepCard
              number="2"
              title="Kollel Learns"
              description="Members of our kollel complete the specific curriculum on or near the yahrtzeit date."
            />
            <StepCard
              number="3"
              title="Completion"
              description="You're notified when the learning is finished. Payment is only requested after the limud is complete."
            />
          </div>
        </div>
      </motion.section>

      {/* Registration Form */}
      <motion.section
        id="register"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 px-6 bg-bg-alt scroll-mt-20"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Dedicate a Limud</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold mb-5">
              Register for the Program
            </h2>
            <div className="gold-divider mx-auto mb-6" />
            <p className="text-navy/70 text-pretty">
              Share the yahrtzeit details below and we&apos;ll arrange the limud
              l&apos;ilui nishmas your loved one.
            </p>
            <div className="mt-5 inline-flex items-center gap-2.5 bg-primary/10 border border-primary/25 rounded-full px-5 py-2">
              <span className="text-navy/60 text-sm">Suggested donation</span>
              <span className="text-navy font-bold text-lg">$360</span>
            </div>
            <p className="mt-4 text-navy/60 text-sm">
              Prefer to reach us directly? WhatsApp{" "}
              <a
                href="https://wa.me/972534631889"
                target="_blank"
                rel="noopener noreferrer"
                className="text-navy font-medium underline underline-offset-2 hover:text-primary-dark"
              >
                +972-53-463-1889
              </a>{" "}
              or email{" "}
              <a
                href="mailto:kbtdraw@gmail.com"
                className="text-navy font-medium underline underline-offset-2 hover:text-primary-dark"
              >
                kbtdraw@gmail.com
              </a>
              .
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border border-primary/15 rounded-2xl p-8 shadow-float space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Your Name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <FormField
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <FormField
              label="Phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div className="border-t border-primary/10 pt-6 mt-6">
              <h4 className="font-bold text-navy mb-4">Yahrtzeit Details</h4>

              <div className="space-y-6">
                <FormField
                  label="Name of Niftar/Nifteres"
                  type="text"
                  required
                  placeholder="e.g., Moshe ben Avraham"
                  value={formData.niftar}
                  onChange={(e) =>
                    setFormData({ ...formData, niftar: e.target.value })
                  }
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    label="Hebrew Date"
                    type="text"
                    required
                    placeholder="e.g., 15 Shevat"
                    value={formData.hebrewDate}
                    onChange={(e) =>
                      setFormData({ ...formData, hebrewDate: e.target.value })
                    }
                  />
                  <FormField
                    label="Yahrtzeit Date (English Calendar)"
                    type="date"
                    required
                    value={formData.yahrtzeit}
                    onChange={(e) =>
                      setFormData({ ...formData, yahrtzeit: e.target.value })
                    }
                  />
                </div>

                <FormField
                  label="Relationship"
                  type="text"
                  placeholder="e.g., Father, Mother, Grandfather"
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                />

                <div>
                  <label htmlFor="yz-notes" className="block text-sm font-semibold text-navy mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    id="yz-notes"
                    rows={4}
                    className="w-full border-2 border-primary/20 rounded-lg px-4 py-3 text-navy focus:border-primary focus:outline-none transition-colors"
                    placeholder="Any special requests or information..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button type="submit" className="btn btn-primary w-full py-4 text-lg">
                Submit Request
              </button>
              <p className="text-sm text-navy/60 text-center mt-4">
                Payment will be requested after the limud is completed.
              </p>
            </div>
          </form>
        </div>
      </motion.section>

      {/* Questions */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16 px-6 bg-bg-light"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-navy text-2xl font-bold mb-4">Questions?</h3>
          <p className="text-navy/70 mb-6">
            For more information about the Yahrtzeit Learning Program or to discuss
            specific requirements, please contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="mailto:office@kbtshul.org" className="btn btn-ghost px-6 py-3">
              office@kbtshul.org
            </a>
            <Link href="/contact" className="btn btn-primary px-6 py-3">
              Contact Us
            </Link>
          </div>
        </div>
      </motion.section>

      {/* Floating CTA — always-present call to action */}
      <AnimatePresence>
        {showFloat && (
          <motion.a
            href="#register"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 24 }}
            transition={{ duration: 0.25, ease: [0.25, 0.1, 0.25, 1] }}
            className="btn btn-primary fixed bottom-6 right-6 z-50 px-6 py-3.5 shadow-float"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
            Dedicate a Limud
          </motion.a>
        )}
      </AnimatePresence>
    </main>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={fadeUp} className="relative text-center">
      <div className="relative z-10 inline-flex items-center justify-center w-14 h-14 bg-primary text-navy rounded-full text-xl font-bold mb-5 shadow-gold ring-4 ring-bg-light">
        {number}
      </div>
      <h4 className="serif-heading text-navy font-bold text-xl mb-2.5">{title}</h4>
      <p className="text-navy/65 text-pretty max-w-xs mx-auto">{description}</p>
    </motion.div>
  );
}

function FormField({
  label,
  type,
  required = false,
  placeholder = "",
  value,
  onChange,
}: {
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  const id = `yz-${label.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "")}`;
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-semibold text-navy mb-2">
        {label}
        {required && (
          <span className="text-primary-dark ml-1" aria-hidden="true">
            *
          </span>
        )}
      </label>
      <input
        id={id}
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border-2 border-primary/20 rounded-lg px-4 py-3 text-navy focus:border-primary focus:outline-none transition-colors"
      />
    </div>
  );
}

function BookIcon() {
  return (
    <svg
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}

function LimudGroup({
  group,
  defaultOpen = false,
}: {
  group: (typeof LIMUDIM)[number];
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border border-primary/15 rounded-xl overflow-hidden bg-white">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-3 px-5 py-3.5 text-left transition-colors ${
          open ? "bg-primary/[0.04]" : "hover:bg-primary/[0.03]"
        }`}
      >
        <span className="flex items-baseline gap-2.5 min-w-0">
          <span className="text-navy font-semibold">{group.category}</span>
          <span className="text-navy/60 text-sm tabular-nums">{group.items.length}</span>
        </span>
        <svg
          className={`w-5 h-5 shrink-0 text-primary transition-transform duration-300 ${open ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          strokeWidth={2.5}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: [0.25, 0.1, 0.25, 1] }}
            className="overflow-hidden"
          >
            <ul className="px-5 pb-5 pt-1.5 space-y-3 border-t border-primary/10">
              {group.items.map((item) => (
                <li key={item.en} className="flex items-start gap-3">
                  <CheckIcon />
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-0.5">
                      <span className="text-navy font-medium">
                        {item.en}
                        {item.excerpt && (
                          <span className="inline-block ml-2 align-middle bg-navy/8 text-navy/70 rounded px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide">
                            excerpt
                          </span>
                        )}
                      </span>
                      <span className="hebrew-heading text-navy/70 text-lg leading-none ms-auto text-right" dir="rtl">
                        {item.he}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-navy/65 text-sm mt-1 text-pretty">{item.note}</p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function CheckIcon() {
  return (
    <span className="shrink-0 mt-0.5 flex items-center justify-center w-5 h-5 rounded-full bg-primary/12 text-primary">
      <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={3}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
      </svg>
    </span>
  );
}
