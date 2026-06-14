"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function DonatePage() {
  return (
    <main>
      {/* Hero */}
      <section className="bg-navy py-24 md:py-28 px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.p
            variants={fadeUp}
            className="eyebrow mb-4"
          >
            Partner With Us
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="serif-heading text-primary text-5xl md:text-6xl font-bold text-balance"
          >
            Support Our Community
          </motion.h1>
          <motion.div
            variants={fadeUp}
            className="gold-divider mx-auto mt-6 mb-6"
          />
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light max-w-2xl mx-auto text-pretty"
          >
            Your generosity sustains our Torah learning, community programs, and
            chesed initiatives
          </motion.p>
        </motion.div>
      </section>

      {/* Donation Options */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 md:py-24 px-6 bg-bg-alt"
      >
        <div className="max-w-5xl mx-auto">
          <motion.p
            variants={fadeUp}
            className="text-navy/70 text-lg leading-relaxed text-center max-w-3xl mx-auto mb-16 text-pretty"
          >
            Kahal Beis Tefilla relies on the generosity of our members and
            friends worldwide. Your contributions directly support our daily
            operations, kollelim, shiurim, community events, and chesed
            programs. Choose one of our secure donation options below.
          </motion.p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.a
              variants={fadeUp}
              href="https://www.matara.pro/nedarimplus/online/?mosad=7012328"
              target="_blank"
              rel="noopener noreferrer"
              className="group card card-hover shadow-card hover:shadow-card-hover border-2 border-primary/20 rounded-2xl p-10 text-center"
            >
              <div className="size-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <span className="text-primary text-4xl">&#x20AA;</span>
              </div>
              <h3 className="serif-heading text-navy text-xl md:text-2xl font-bold mb-3">
                Donate in Shekels
              </h3>
              <p className="text-navy/70 mb-8 leading-relaxed text-pretty">
                Secure credit card donation in Israeli Shekels via Nedarim Plus
              </p>
              <span className="btn btn-primary px-8 py-3.5 text-base">
                Donate Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.a>

            <motion.a
              variants={fadeUp}
              href="https://kbt.kollelnernaftali.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="group card card-hover shadow-card hover:shadow-card-hover border-2 border-primary/20 rounded-2xl p-10 text-center"
            >
              <div className="size-20 bg-primary/10 rounded-full mx-auto mb-6 flex items-center justify-center group-hover:bg-primary/15 transition-colors">
                <span className="text-primary text-4xl">$</span>
              </div>
              <h3 className="serif-heading text-navy text-xl md:text-2xl font-bold mb-3">
                Donate via Kollel Ner Naftali
              </h3>
              <p className="text-navy/70 mb-8 leading-relaxed text-pretty">
                Tax-deductible donations through Kollel Ner Naftali
              </p>
              <span className="btn btn-primary px-8 py-3.5 text-base">
                Donate Now
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </motion.a>
          </div>
        </div>
      </motion.section>

      {/* What Your Donation Supports */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 md:py-24 px-6 bg-bg-light"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-14">
            <p className="eyebrow mb-3">Your Impact</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold">
              What Your Donation Supports
            </h2>
            <div className="gold-divider mx-auto mt-5 mb-4" />
            <p className="text-navy/60 text-lg text-pretty">
              Every gift strengthens Torah, community, and chesed in Ramat Eshkol
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                title: "Torah Learning",
                desc: "Kollelim, shiurim, and a vibrant Beis Medrash open from early morning to late night",
              },
              {
                title: "Community Events",
                desc: "Weekly kiddushim, holiday celebrations, and family-friendly programming",
              },
              {
                title: "Chesed Programs",
                desc: "Tzedakah fund, gemach, and support for families in need",
              },
              {
                title: "Youth Programs",
                desc: "Avos Ubanim, Masmidim, and engaging activities for children",
              },
              {
                title: "Building Upkeep",
                desc: "Maintaining our shul as a welcoming home for the community",
              },
              {
                title: "Online Shiurim",
                desc: "Reaching hundreds of talmidim worldwide through digital classes",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="card card-hover shadow-card hover:shadow-card-hover border border-primary/15 rounded-xl p-8 text-center"
              >
                <div className="gold-divider mx-auto mb-6" />
                <h3 className="serif-heading text-navy font-bold text-lg md:text-xl mb-3">
                  {item.title}
                </h3>
                <p className="text-navy/70 text-sm leading-relaxed text-pretty">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quote */}
      <section className="py-24 md:py-28 px-6 bg-navy text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto"
        >
          <h2 className="serif-heading text-primary text-3xl md:text-4xl font-bold italic leading-tight text-balance">
            &ldquo;Tzedakah is equal to all the other commandments
            combined.&rdquo;
          </h2>
          <div className="gold-divider mx-auto mt-7 mb-6" />
          <p className="text-white/60 font-semibold tracking-[0.3em] uppercase text-sm">
            &mdash; Bava Basra 9a
          </p>
        </motion.div>
      </section>
    </main>
  );
}
