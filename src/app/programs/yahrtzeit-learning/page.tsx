"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

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
        note: "The first letters of the last seven mishnayos spell נשמה (neshama).",
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
      { en: "Yeshaya, Perek 58", he: "ישעיה פרק נ״ח", excerpt: true },
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
      {/* Hero */}
      <section className="bg-navy py-24 px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.p variants={fadeUp} className="eyebrow text-primary-light/90 mb-4">
            Kahal Beis Tefilla
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="serif-heading text-primary text-5xl md:text-6xl font-bold mb-6 text-balance"
          >
            Yahrtzeit Learning Program
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mx-auto mb-6" />
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light text-pretty"
          >
            Honor the memory of your loved ones with a specific Torah curriculum
          </motion.p>
        </motion.div>
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
            <p className="text-navy/50 text-sm mb-5">
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
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <p className="eyebrow mb-3">Simple &amp; Meaningful</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold mb-5">
              How It Works
            </h2>
            <div className="gold-divider mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Submit Your Request"
              description="Fill out the form below with the yahrtzeit details and your contact information."
            />
            <StepCard
              number="2"
              title="Kollel Learns"
              description="Members of our kollel will complete the specific curriculum on or near the yahrtzeit date."
            />
            <StepCard
              number="3"
              title="Completion"
              description="You'll be notified when the learning is completed. Payment will be requested after the limud is finished."
            />
          </div>
        </div>
      </motion.section>

      {/* Registration Form */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <p className="eyebrow mb-3">Dedicate a Limud</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold mb-5">
              Register for the Program
            </h2>
            <div className="gold-divider mx-auto mb-6" />
            <p className="text-navy/70">
              Please fill out this form, contact us via WhatsApp at{" "}
              <a
                href="https://wa.me/972534631889"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                +972-53-463-1889
              </a>
              , or email{" "}
              <a
                href="mailto:kbtdraw@gmail.com"
                className="text-primary hover:underline"
              >
                kbtdraw@gmail.com
              </a>{" "}
              to navigate the yahrtzeit program.
            </p>
            <p className="text-navy/60 text-sm mt-3">
              The suggested donation is $360.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-primary/20 rounded-2xl p-8 shadow-xl space-y-6"
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
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Additional Notes
                  </label>
                  <textarea
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
    <motion.div variants={fadeUp} className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full text-2xl font-bold mb-4">
        {number}
      </div>
      <h4 className="text-navy font-bold text-xl mb-3">{title}</h4>
      <p className="text-navy/70">{description}</p>
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
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-2">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <input
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
          <span className="text-navy/35 text-sm tabular-nums">{group.items.length}</span>
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
                          <span className="text-navy/35 text-xs font-normal ml-2 align-middle">excerpt</span>
                        )}
                      </span>
                      <span className="hebrew-heading text-navy/55 text-lg leading-none" dir="rtl">
                        {item.he}
                      </span>
                    </div>
                    {item.note && (
                      <p className="text-navy/45 text-sm mt-1 text-pretty">{item.note}</p>
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
