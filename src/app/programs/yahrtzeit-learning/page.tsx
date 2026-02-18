"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// Google Form integration
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSd5B0F38NpQEG9_LX6L3s4hm2ZerHc9o8C8ju-HgEMIo89Sdg/formResponse";

const FORM_FIELDS = {
  dateOfYahrtzeit: "entry.545323566",
  nameOfNiftar: "entry.530730126",
  nameOfDonor: "entry.1044438578",
  email: "entry.1412711219",
  comments: "entry.433594988",
} as const;

// Limudim data
const limudim = [
  {
    letter: "\u05DE",
    title: "Mishnayos",
    short: "Learned by the letters of the niftar\u2019s name",
    detail:
      "Mishnayos are learned according to the letters of the niftar\u2019s name \u2014 spelling out the neshamah\u2019s identity through Torah. The word \u2018Mishnah\u2019 (\u05DE\u05E9\u05E0\u05D4) has the same letters as \u2018Neshamah\u2019 (\u05E0\u05E9\u05DE\u05D4).",
    source: "Based on the teachings of the Arizal and the Chidah",
  },
  {
    letter: "\u05D2",
    title: "Gemaras",
    short: "Specific sections selected for a yahrtzeit",
    detail:
      "Sections from Maseches Brachos, Shabbos, Makkos, Sanhedrin, Zvachim, Menachos, and more \u2014 each specially selected for their relevance to a yahrtzeit.",
    source: "As prescribed by the Chidah",
  },
  {
    letter: "\u05D6",
    title: "Zohar HaKadosh",
    short: "Excerpts from the Zohar and Idra",
    detail:
      "According to the mekubalim, the study of Zohar provides the greatest benefit to the neshamah. The Zohar is called \u2018Zohar\u2019 because it illuminates.",
    source: "The Chidah emphasizes this based on the mekubalim",
  },
  {
    letter: "\u05EA",
    title: "Tehillim",
    short: "Chapters with special tefillos",
    detail:
      "Chapters of Tehillim including Perakim 42 through 50, with special tefillos. The name of the niftar is woven into the recitation.",
    source: "Following the minhag of gedolei Yisroel",
  },
  {
    letter: "\u05D7",
    title: "Chumash & Navi",
    short: "Selections from Torah and Prophets",
    detail:
      "Selections from Parshas Bereishis, Naso, V\u2019Zos HaBracha, and sections from Shmuel Alef and Yeshaya \u2014 as prescribed by the Chidah.",
    source: "Specifically prescribed by the Chidah",
  },
  {
    letter: "\u05DB",
    title: "Additional Limudim",
    short: "Mikvaos & Keilim",
    detail:
      "Mishnayos from Maseches Mikvaos and Maseches Keilim. Mikvaos represents purification and tahara; Keilim represents the body as a vessel for the soul.",
    source: "Selected by the Chidah for their significance",
  },
];

export default function YahrtzeitLearningPage() {
  const [expandedCards, setExpandedCards] = useState<Set<number>>(new Set());
  const [formData, setFormData] = useState({
    dateOfYahrtzeit: "",
    nameOfNiftar: "",
    nameOfDonor: "",
    email: "",
    comments: "",
  });
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [copied, setCopied] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const body = new URLSearchParams();
      body.append(FORM_FIELDS.dateOfYahrtzeit, formData.dateOfYahrtzeit);
      body.append(FORM_FIELDS.nameOfNiftar, formData.nameOfNiftar);
      body.append(FORM_FIELDS.nameOfDonor, formData.nameOfDonor);
      body.append(FORM_FIELDS.email, formData.email);
      body.append(FORM_FIELDS.comments, formData.comments);

      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      setSubmitted(true);
    } catch {
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

  const pageUrl =
    typeof window !== "undefined" ? window.location.href : "";
  const shareMessage = `I wanted to share this with you \u2014 Kahal Beis Tefilla in Yerushalayim offers a special yahrtzeit learning program. A group of avreichim learn Mishnayos, Gemaras, Zohar, Tehillim, and more on the day of the yahrtzeit. You can reserve a date at: ${pageUrl}`;

  async function copyLink() {
    await navigator.clipboard.writeText(shareMessage);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareWhatsApp() {
    window.open(
      `https://wa.me/?text=${encodeURIComponent(shareMessage)}`,
      "_blank"
    );
  }

  function shareEmail() {
    const subject = encodeURIComponent(
      "Yahrtzeit Learning Program \u2014 Kahal Beis Tefilla"
    );
    const body = encodeURIComponent(shareMessage);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }

  return (
    <main>
      {/* ── Hero ── */}
      <section className="bg-navy py-24 px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          {/* Memorial candle */}
          <motion.div variants={fadeUp} className="flex justify-center mb-8">
            <svg
              width="48"
              height="48"
              viewBox="0 0 48 48"
              fill="none"
              className="text-white/60"
            >
              <rect
                x="14"
                y="20"
                width="20"
                height="22"
                rx="2"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                opacity="0.3"
              />
              <rect
                x="16"
                y="26"
                width="16"
                height="14"
                rx="1"
                fill="currentColor"
                opacity="0.15"
              />
              <line
                x1="24"
                y1="26"
                x2="24"
                y2="16"
                stroke="currentColor"
                strokeWidth="1"
                opacity="0.4"
              />
              <ellipse cx="24" cy="13" rx="4" ry="6" fill="#C4A245" opacity="0.8" />
              <ellipse cx="24" cy="14" rx="2" ry="3.5" fill="#D0B055" />
              <ellipse cx="24" cy="14.5" rx="1" ry="2" fill="#FFF8E7" opacity="0.9" />
            </svg>
          </motion.div>

          <motion.h1
            variants={fadeUp}
            className="serif-heading text-primary text-4xl sm:text-5xl md:text-6xl font-bold mb-6"
          >
            Yahrtzeit Learning Program
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-lg sm:text-xl font-light max-w-2xl mx-auto"
          >
            Dedicate a day of Torah learning in memory of a loved one on their
            yahrtzeit
          </motion.p>
        </motion.div>
      </section>

      {/* ── Description + Key Details ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-5xl mx-auto">
          <motion.p
            variants={fadeUp}
            className="text-navy/80 text-lg leading-relaxed max-w-3xl mx-auto text-center mb-14"
          >
            A group of chashuva avreichim and shul members learn a comprehensive
            program of Torah study on the day of the yahrtzeit, l&apos;ilui
            nishmas your loved one. Performed under the leadership of Rav Dovid
            Steinhauer Shlit&quot;a.
          </motion.p>

          <div className="grid sm:grid-cols-3 gap-6">
            {[
              {
                heading: "One Person Per Day",
                body: "Each yahrtzeit gets a full day of dedicated learning",
              },
              {
                heading: "$360",
                sub: "Suggested Donation",
                body: "Covers the full program of limudim",
                accent: true,
              },
              {
                heading: "Reserve in Advance",
                body: "Dates fill up \u2014 secure yours early",
              },
            ].map((card) => (
              <motion.div
                key={card.heading}
                variants={fadeUp}
                className="bg-white border border-primary/15 rounded-xl p-8 shadow-sm text-center"
              >
                <h3
                  className={`font-bold mb-1 ${
                    card.accent
                      ? "serif-heading text-primary text-4xl"
                      : "text-navy text-lg"
                  }`}
                >
                  {card.heading}
                </h3>
                {card.sub && (
                  <p className="text-navy/50 text-sm font-semibold uppercase tracking-wide mb-2">
                    {card.sub}
                  </p>
                )}
                <p className="text-navy/60 text-sm mt-2">{card.body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* ── The Limudim ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-3xl font-bold mb-4 text-center"
          >
            What is Learned
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="w-20 h-1 bg-primary mx-auto mb-12"
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {limudim.map((item, i) => {
              const isOpen = expandedCards.has(i);
              return (
                <motion.div
                  key={item.title}
                  variants={fadeUp}
                  className="bg-white border border-primary/15 rounded-xl shadow-sm overflow-hidden"
                  onMouseEnter={() =>
                    setExpandedCards((prev) => new Set(prev).add(i))
                  }
                  onMouseLeave={() =>
                    setExpandedCards((prev) => {
                      const next = new Set(prev);
                      next.delete(i);
                      return next;
                    })
                  }
                  onClick={() =>
                    setExpandedCards((prev) => {
                      const next = new Set(prev);
                      if (next.has(i)) next.delete(i);
                      else next.add(i);
                      return next;
                    })
                  }
                >
                  <div className="p-6 cursor-pointer sm:cursor-default">
                    <div className="flex items-start gap-4">
                      <div className="shrink-0 size-12 bg-primary/10 rounded-full flex items-center justify-center">
                        <span className="hebrew-heading text-primary text-xl font-bold">
                          {item.letter}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-navy font-bold text-lg">
                          {item.title}
                        </h3>
                        <p className="text-navy/50 text-sm mt-1">
                          {item.short}
                        </p>
                      </div>
                    </div>
                  </div>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-6 pt-0 border-t border-primary/10">
                          <p className="text-navy/70 text-sm leading-relaxed mt-4">
                            {item.detail}
                          </p>
                          <p className="text-primary/70 text-xs mt-3 italic">
                            {item.source}
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* ── Reserve a Date Form ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-2xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-3xl font-bold mb-4 text-center"
          >
            Reserve a Date
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-navy/60 text-center mb-4"
          >
            Reserve a day of learning for your loved one&apos;s yahrtzeit.
            Suggested donation: $360.
          </motion.p>
          <motion.p
            variants={fadeUp}
            className="text-navy/50 text-sm text-center mb-10"
          >
            Payment will only be requested after the learning has been completed.
          </motion.p>

          <motion.div variants={fadeUp}>
            {submitted ? (
              <div className="space-y-8">
                <div className="bg-primary/10 border border-primary/30 rounded-2xl p-12 text-center">
                  <svg
                    className="w-16 h-16 text-primary mx-auto mb-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  <h3 className="serif-heading text-navy text-2xl font-bold mb-3">
                    Registration Successful
                  </h3>
                  <p className="text-navy/70 text-lg mb-4">
                    Someone will email you to confirm before the yahrtzeit.
                  </p>
                  <p className="text-navy/50 text-sm">
                    Payment will only be requested after the learning has been
                    completed.
                  </p>
                </div>

                <div className="text-center">
                  <p className="text-navy/60 text-sm mb-6">
                    If you would like to make the donation for the learning now,
                    use these links:
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    <a
                      href="https://www.matara.pro/nedarimplus/online/?mosad=7012328"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white border-2 border-primary/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center"
                    >
                      <div className="size-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-primary text-3xl">&#x20AA;</span>
                      </div>
                      <h3 className="serif-heading text-navy text-xl font-bold mb-2">
                        Pay in Shekels
                      </h3>
                      <p className="text-navy/60 text-sm mb-4">
                        Via Nedarim Plus
                      </p>
                      <span className="inline-flex items-center gap-2 bg-primary text-navy px-6 py-2.5 rounded-xl font-bold text-sm group-hover:bg-primary-light transition-colors">
                        Pay Now &#x2192;
                      </span>
                    </a>

                    <a
                      href="https://kbt.kollelnernaftali.org/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group bg-white border-2 border-primary/20 rounded-2xl p-8 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center"
                    >
                      <div className="size-16 bg-primary/10 rounded-full mx-auto mb-4 flex items-center justify-center">
                        <span className="text-primary text-3xl">$</span>
                      </div>
                      <h3 className="serif-heading text-navy text-xl font-bold mb-2">
                        Pay via Kollel Ner Naftali
                      </h3>
                      <p className="text-navy/60 text-sm mb-4">
                        Tax-deductible (USD)
                      </p>
                      <span className="inline-flex items-center gap-2 bg-primary text-navy px-6 py-2.5 rounded-xl font-bold text-sm group-hover:bg-primary-light transition-colors">
                        Pay Now &#x2192;
                      </span>
                    </a>
                  </div>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    Date of Yahrtzeit *
                  </label>
                  <input
                    type="text"
                    name="dateOfYahrtzeit"
                    value={formData.dateOfYahrtzeit}
                    onChange={handleChange}
                    required
                    placeholder="e.g. 15 Cheshvan"
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                  />
                </div>

                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    Name of Niftar / Nifteres *
                  </label>
                  <input
                    type="text"
                    name="nameOfNiftar"
                    value={formData.nameOfNiftar}
                    onChange={handleChange}
                    required
                    placeholder="Hebrew name ben/bas father's name"
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                  />
                </div>

                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="nameOfDonor"
                      value={formData.nameOfDonor}
                      onChange={handleChange}
                      required
                      placeholder="Your full name"
                      className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">
                      Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="you@example.com"
                      className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    Comments or Questions
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={3}
                    placeholder="Anything you'd like us to know..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-navy px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-light transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Reserve This Date"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* ── Share With Family ── */}
      <section className="py-20 px-6 bg-navy">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={stagger}
          className="max-w-3xl mx-auto text-center"
        >
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-primary text-3xl font-bold mb-4"
          >
            Know someone who would appreciate this?
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-white/60 text-lg mb-10"
          >
            Share this program with a parent, grandparent, or anyone who would
            like to dedicate a day of learning.
          </motion.p>

          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            {/* Copy Link */}
            <button
              onClick={copyLink}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
            >
              {copied ? (
                <>
                  <svg
                    className="w-5 h-5 text-primary"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                  Copied!
                </>
              ) : (
                <>
                  <svg
                    className="w-5 h-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  Copy Link
                </>
              )}
            </button>

            {/* WhatsApp */}
            <button
              onClick={shareWhatsApp}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
            >
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
              </svg>
              WhatsApp
            </button>

            {/* Email */}
            <button
              onClick={shareEmail}
              className="w-full sm:w-auto flex items-center justify-center gap-3 bg-white/10 hover:bg-white/20 text-white px-8 py-3.5 rounded-xl font-semibold transition-all"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
              </svg>
              Email
            </button>
          </motion.div>
        </motion.div>
      </section>

      {/* ── Closing / Contact ── */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16 px-6 bg-bg-light"
      >
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-navy/60 text-sm">
            For questions, contact{" "}
            <a
              href="mailto:kbtdraw@gmail.com"
              className="text-primary hover:text-primary-light transition-colors font-semibold"
            >
              kbtdraw@gmail.com
            </a>{" "}
            or WhatsApp{" "}
            <a
              href="https://wa.me/13476620889"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light transition-colors font-semibold"
            >
              +1 347 662 0889
            </a>
          </p>
        </div>
      </motion.section>
    </main>
  );
}
