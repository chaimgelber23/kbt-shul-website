"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

const GOOGLE_FORM_URL = "https://docs.google.com/forms/d/e/1FAIpQLSdrO4uDzo5Uo8F5aayrRFlQv6rmorUef_yCbCkXfKAngqrajg/viewform?embedded=true";

export default function MembershipPage() {
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
                desc: "Shacharis, Mincha, and Maariv every day — ensuring a reliable minyan for the community",
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
            <p className="serif-heading text-navy text-5xl font-bold mb-2">
              100 <span className="text-3xl">&#x20AA;</span>
            </p>
            <p className="text-navy/60 mb-1">per month</p>
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

      {/* Sign Up Form (Google Form Embed) */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-3xl mx-auto">
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
          <motion.div
            variants={fadeUp}
            className="bg-white rounded-2xl shadow-lg overflow-hidden border border-primary/10"
          >
            <iframe
              src={GOOGLE_FORM_URL}
              width="100%"
              height="800"
              className="border-0"
              title="Membership Sign-Up Form"
            >
              Loading form&hellip;
            </iframe>
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
