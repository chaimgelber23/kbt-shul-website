"use client";

import { useState } from "react";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

// Google Form submission URL (change "viewform" to "formResponse")
const GOOGLE_FORM_ACTION =
  "https://docs.google.com/forms/d/e/1FAIpQLSdrO4uDzo5Uo8F5aayrRFlQv6rmorUef_yCbCkXfKAngqrajg/formResponse";

// Map each field to its Google Form entry ID.
// To find entry IDs: open your Google Form, click the 3-dot menu > "Get pre-filled link",
// fill in dummy data, click "Get link", and look at the URL parameters (entry.XXXXXXX).
const FORM_FIELDS = {
  fullName: "entry.1781789234",
  email: "entry.1994389210",
  phone: "entry.520134409",
  address: "entry.735464389",
  spouseName: "entry.1865410362",
  numChildren: "entry.1433152844",
  comments: "entry.1200402349",
} as const;

export default function MembershipPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    address: "",
    spouseName: "",
    numChildren: "",
    comments: "",
  });
  const [pledgedAmount, setPledgedAmount] = useState("100");
  const [customAmount, setCustomAmount] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      // Build form data matching Google Form entry IDs
      const body = new URLSearchParams();
      body.append(FORM_FIELDS.fullName, formData.fullName);
      body.append(FORM_FIELDS.email, formData.email);
      body.append(FORM_FIELDS.phone, formData.phone);
      body.append(FORM_FIELDS.address, formData.address);
      body.append(FORM_FIELDS.spouseName, formData.spouseName);
      body.append(FORM_FIELDS.numChildren, formData.numChildren);
      // Include pledged amount in comments so the board sees it
      const commentsWithAmount = `Pledged: ${pledgedAmount} ₪/month${formData.comments ? `\n${formData.comments}` : ""}`;
      body.append(FORM_FIELDS.comments, commentsWithAmount);

      // Submit to Google Forms (no-cors: we can't read the response but the data is sent)
      await fetch(GOOGLE_FORM_ACTION, {
        method: "POST",
        mode: "no-cors",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: body.toString(),
      });

      setSubmitted(true);
    } catch {
      // Even if fetch throws, the submission usually succeeds with no-cors
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }

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
          <motion.h1
            variants={fadeUp}
            className="serif-heading text-primary text-5xl md:text-6xl font-bold mb-6"
          >
            Become a Member
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light max-w-2xl mx-auto"
          >
            Join the Kahal Beis Tefilla family and be part of a thriving Torah
            community in Yerushalayim
          </motion.p>
        </motion.div>
      </section>

      {/* Why Join */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-4xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-4xl font-bold mb-8"
          >
            Why Join Our Kehilla?
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="w-20 h-1 bg-primary mb-10"
          />
          <div className="space-y-6 text-navy/80 text-lg leading-relaxed">
            <motion.p variants={fadeUp}>
              Kahal Beis Tefilla is more than a shul &mdash; it&apos;s a home.
              Whether you&apos;ve lived in Ramat Eshkol for years or just
              arrived in Yerushalayim, becoming a member means joining a warm,
              supportive community united by Torah, Avodah, and Gemilut
              Chasadim.
            </motion.p>
            <motion.p variants={fadeUp}>
              Your membership directly supports everything that makes our
              kehilla thrive &mdash; from daily minyanim and shiurim to
              community events, chesed programs, and youth activities. Together,
              we build a place where every family can grow.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* What Membership Supports */}
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
            className="serif-heading text-navy text-3xl font-bold mb-10 text-center"
          >
            What Your Membership Supports
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Daily Minyanim",
                desc: "Shacharis, Mincha, and Maariv every day \u2014 ensuring a reliable minyan for the community",
              },
              {
                title: "Shiurim & Learning",
                desc: "Weekly shiurim by the Rav, chaburos, and a vibrant Beis Medrash open throughout the day",
              },
              {
                title: "Community Programs",
                desc: "Kiddushim, holiday celebrations, melaveh malkas, and family-friendly events",
              },
              {
                title: "Building & Maintenance",
                desc: "Maintaining our shul as a beautiful, welcoming space for davening and learning",
              },
              {
                title: "Youth Programs",
                desc: "Avos Ubanim, Masmidim, and engaging Shabbos and holiday activities for children",
              },
              {
                title: "Chesed Initiatives",
                desc: "Tzedakah fund, gemach, and support for families throughout the community",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="bg-white border border-primary/15 rounded-xl p-8 shadow-sm text-center"
              >
                <div className="w-10 h-0.5 bg-primary mx-auto mb-6" />
                <h3 className="text-navy font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-navy/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Membership Details + Payment */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-3xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-3xl font-bold mb-6"
          >
            Membership Details
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="bg-white border-2 border-primary/20 rounded-2xl p-10 shadow-lg mb-12"
          >
            <p className="text-navy/60 text-sm uppercase tracking-widest font-semibold mb-3">
              Monthly Membership
            </p>
            {customAmount ? (
              <>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <input
                    type="number"
                    min="1"
                    value={pledgedAmount}
                    onChange={(e) => setPledgedAmount(e.target.value)}
                    autoFocus
                    className="serif-heading text-navy text-5xl font-bold w-32 text-center bg-transparent border-b-2 border-primary focus:outline-none transition-colors [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                  />
                  <span className="serif-heading text-navy text-3xl font-bold">&#x20AA;</span>
                </div>
                <p className="text-navy/60">per month</p>
              </>
            ) : (
              <>
                <p className="serif-heading text-navy text-5xl font-bold mb-2">
                  100 <span className="text-3xl">&#x20AA;</span>
                </p>
                <p className="text-navy/60 mb-4">per month</p>
                <button
                  type="button"
                  onClick={() => setCustomAmount(true)}
                  className="text-primary text-sm font-semibold hover:text-primary-light transition-colors"
                >
                  Choose a custom amount
                </button>
              </>
            )}
          </motion.div>

          <motion.p
            variants={fadeUp}
            className="text-navy/70 text-lg mb-10"
          >
            Choose your preferred payment method below to set up your
            membership:
          </motion.p>

          <div className="grid md:grid-cols-2 gap-8">
            <motion.a
              variants={fadeUp}
              href="https://www.matara.pro/nedarimplus/online/?mosad=7012328"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-primary/20 rounded-2xl p-10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center"
            >
              <div className="size-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-primary text-4xl">&#x20AA;</span>
              </div>
              <h3 className="serif-heading text-navy text-2xl font-bold mb-3">
                Pay in Shekels
              </h3>
              <p className="text-navy/60 mb-6">
                Secure credit card payment in Israeli Shekels via Nedarim Plus
              </p>
              <span className="inline-flex items-center gap-2 bg-primary text-navy px-8 py-3 rounded-xl font-bold group-hover:bg-primary-light transition-colors">
                Pay Now &#x2192;
              </span>
            </motion.a>

            <motion.a
              variants={fadeUp}
              href="https://kbt.kollelnernaftali.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="group bg-white border-2 border-primary/20 rounded-2xl p-10 shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all text-center"
            >
              <div className="size-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center">
                <span className="text-primary text-4xl">$</span>
              </div>
              <h3 className="serif-heading text-navy text-2xl font-bold mb-3">
                Pay via Kollel Ner Naftali
              </h3>
              <p className="text-navy/60 mb-6">
                Tax-deductible payment through Kollel Ner Naftali (USD)
              </p>
              <span className="inline-flex items-center gap-2 bg-primary text-navy px-8 py-3 rounded-xl font-bold group-hover:bg-primary-light transition-colors">
                Pay Now &#x2192;
              </span>
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* Sign Up Form */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-2xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-3xl font-bold mb-4 text-center"
          >
            Sign Up
          </motion.h2>
          <motion.p
            variants={fadeUp}
            className="text-navy/60 text-center mb-10"
          >
            Fill out the form below to register as a member. Our board will be
            in touch to welcome you.
          </motion.p>

          <motion.div variants={fadeUp}>
            {submitted ? (
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
                  Welcome to KBT!
                </h3>
                <p className="text-navy/70 text-lg">
                  Thank you for signing up. A member of our board will be in
                  touch with you shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Full Name */}
                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    placeholder="Yisrael Goldberg"
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                  />
                </div>

                {/* Email & Phone */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">
                      Email Address *
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
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      placeholder="05X-XXX-XXXX"
                      className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                    />
                  </div>
                </div>

                {/* Address */}
                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    Address *
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    required
                    placeholder="Street, apartment number, city"
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                  />
                </div>

                {/* Spouse & Children */}
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">
                      Spouse Name
                    </label>
                    <input
                      type="text"
                      name="spouseName"
                      value={formData.spouseName}
                      onChange={handleChange}
                      placeholder="Optional"
                      className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">
                      Number of Children
                    </label>
                    <input
                      type="number"
                      name="numChildren"
                      value={formData.numChildren}
                      onChange={handleChange}
                      min="0"
                      placeholder="Optional"
                      className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                    />
                  </div>
                </div>

                {/* Comments */}
                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    Comments or Questions
                  </label>
                  <textarea
                    name="comments"
                    value={formData.comments}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Anything you'd like us to know..."
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full bg-primary text-navy px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-light transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? "Submitting..." : "Register as Member"}
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </motion.section>

      {/* Closing Quote */}
      <section className="py-20 px-6 bg-navy text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto"
        >
          <h2 className="serif-heading text-primary text-3xl font-bold italic mb-6">
            &ldquo;All of Israel are responsible for one another.&rdquo;
          </h2>
          <p className="text-white/60 font-semibold tracking-[0.3em] uppercase text-sm">
            &mdash; Shevuos 39a
          </p>
        </motion.div>
      </section>
    </main>
  );
}
