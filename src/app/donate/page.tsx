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
            Support Our Community
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light max-w-2xl mx-auto"
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
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-5xl mx-auto">
          <motion.p
            variants={fadeUp}
            className="text-navy/80 text-lg leading-relaxed text-center max-w-3xl mx-auto mb-16"
          >
            Kahal Beis Tefilla relies on the generosity of our members and
            friends worldwide. Your contributions directly support our daily
            operations, kollelim, shiurim, community events, and chesed
            programs. Choose one of our secure donation options below.
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
                Donate in Shekels
              </h3>
              <p className="text-navy/60 mb-6">
                Secure credit card donation in Israeli Shekels via Nedarim Plus
              </p>
              <span className="inline-flex items-center gap-2 bg-primary text-navy px-8 py-3 rounded-xl font-bold group-hover:bg-primary-light transition-colors">
                Donate Now &#x2192;
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
                Donate via Kollel Ner Naftali
              </h3>
              <p className="text-navy/60 mb-6">
                Tax-deductible donations through Kollel Ner Naftali
              </p>
              <span className="inline-flex items-center gap-2 bg-primary text-navy px-8 py-3 rounded-xl font-bold group-hover:bg-primary-light transition-colors">
                Donate Now &#x2192;
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
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-3xl font-bold mb-10 text-center"
          >
            What Your Donation Supports
          </motion.h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: "&#x1F4D6;",
                title: "Torah Learning",
                desc: "Kollelim, shiurim, and a vibrant Beis Medrash open from early morning to late night",
              },
              {
                icon: "&#x1F91D;",
                title: "Community Events",
                desc: "Weekly kiddushim, holiday celebrations, and family-friendly programming",
              },
              {
                icon: "&#x2764;",
                title: "Chesed Programs",
                desc: "Tzedakah fund, gemach, and support for families in need",
              },
              {
                icon: "&#x1F46A;",
                title: "Youth Programs",
                desc: "Avos Ubanim, Masmidim, and engaging activities for children",
              },
              {
                icon: "&#x1F3DB;",
                title: "Building Upkeep",
                desc: "Maintaining our shul as a welcoming home for the community",
              },
              {
                icon: "&#x1F4E2;",
                title: "Online Shiurim",
                desc: "Reaching hundreds of talmidim worldwide through digital classes",
              },
            ].map((item) => (
              <motion.div
                key={item.title}
                variants={fadeUp}
                className="bg-white border border-primary/15 rounded-xl p-8 shadow-sm text-center"
              >
                <span
                  className="text-4xl mb-4 block"
                  dangerouslySetInnerHTML={{ __html: item.icon }}
                />
                <h3 className="text-navy font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-navy/60 text-sm">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      {/* Quote */}
      <section className="py-20 px-6 bg-navy text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto"
        >
          <h2 className="serif-heading text-primary text-3xl font-bold italic mb-6">
            &ldquo;Tzedakah is equal to all the other commandments
            combined.&rdquo;
          </h2>
          <p className="text-white/60 font-semibold tracking-[0.3em] uppercase text-sm">
            &mdash; Bava Basra 9a
          </p>
        </motion.div>
      </section>
    </main>
  );
}
