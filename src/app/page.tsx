"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function Home() {
  return (
    <main>
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden bg-navy">
        <div className="absolute inset-0 bg-gradient-to-t from-navy via-transparent to-navy/50" />
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="relative z-10 text-center px-4 max-w-4xl mx-auto"
        >
          <motion.div variants={fadeUp} className="mb-8">
            <Image
              src="/logo.png"
              alt="Kahal Beis Tefilla Logo"
              width={280}
              height={200}
              className="mx-auto drop-shadow-2xl"
              priority
            />
          </motion.div>
          <motion.h1
            variants={fadeUp}
            className="serif-heading text-primary text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg"
          >
            Kahal Beis Tefilla
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/90 text-lg md:text-2xl font-light mb-10 tracking-wide max-w-2xl mx-auto"
          >
            Growing Together in Torah &amp; Avodas Hashem in the Heart of
            Jerusalem
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              href="/about"
              className="w-full sm:w-auto bg-primary text-navy px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-light transition-all shadow-xl text-center"
            >
              Learn About Us
            </Link>
            <Link
              href="/davening"
              className="w-full sm:w-auto border-2 border-white/30 text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-white/10 transition-all backdrop-blur-sm text-center"
            >
              View Schedule
            </Link>
          </motion.div>
        </motion.div>
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </div>
      </section>

      {/* Welcome Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 bg-bg-alt px-6"
      >
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-4xl font-bold mb-8"
          >
            A Warm Jerusalem Home
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="w-20 h-1 bg-primary mx-auto mb-10"
          />
          <motion.p
            variants={fadeUp}
            className="text-navy/80 text-xl leading-relaxed font-light italic"
          >
            &ldquo;Ramat Eshkol has become the first choice for many families
            looking to call Yerushalayim their home. For a location to become
            home, it needs more than a comfortable apartment &mdash; it requires
            an environment where one feels accepted and has friends who care.
            Kahal Beis Tefilla is first and foremost a community. It is the
            place to form friendships and feel welcome.&rdquo;
          </motion.p>
        </div>
      </motion.section>

      {/* Davening Schedule Section */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <div className="bg-white border-2 border-primary/30 rounded-2xl shadow-2xl overflow-hidden">
            <div className="bg-navy p-8 text-center border-b border-primary/20">
              <h2 className="serif-heading text-primary text-3xl font-bold">
                Davening &amp; Learning Schedule
              </h2>
              <p className="text-white/70 font-medium tracking-widest uppercase text-xs mt-2">
                Beis Medrash Open 6:45 AM &ndash; 11:30 PM
              </p>
            </div>
            <div className="grid md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-primary/10">
              {/* Shacharis */}
              <div className="p-8 group hover:bg-primary/5 transition-colors">
                <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2">
                  <Sun /> Shacharis
                </h3>
                <ul className="space-y-3 text-navy font-medium">
                  <ScheduleItem label="Vasikin" time="At Sunrise" />
                  <ScheduleItem label="First Minyan" time="7:00 AM" />
                  <ScheduleItem label="Second Minyan" time="8:15 AM" />
                </ul>
              </div>
              {/* Mincha */}
              <div className="p-8 group hover:bg-primary/5 transition-colors">
                <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2">
                  <Sunset /> Mincha
                </h3>
                <ul className="space-y-3 text-navy font-medium">
                  <ScheduleItem label="Early Mincha" time="1:45 PM" />
                  <ScheduleItem
                    label="Mincha Bizman"
                    time="15m before Shkiah"
                  />
                </ul>
              </div>
              {/* Maariv */}
              <div className="p-8 group hover:bg-primary/5 transition-colors">
                <h3 className="text-primary font-bold text-lg mb-4 flex items-center gap-2">
                  <Moon /> Maariv
                </h3>
                <ul className="space-y-3 text-navy font-medium">
                  <ScheduleItem
                    label="First Maariv"
                    time="20m after Shkiah"
                  />
                  <ScheduleItem label="Late Maariv" time="9:00 PM" />
                  <ScheduleItem label="Final Maariv" time="10:00 PM" />
                </ul>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      {/* Programs Grid */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={stagger}
        className="py-24 px-6 bg-bg-alt"
      >
        <div className="max-w-7xl mx-auto">
          <motion.div variants={fadeUp} className="mb-16">
            <h2 className="serif-heading text-navy text-4xl font-bold">
              Community Programs
            </h2>
            <p className="text-navy/60 mt-2">
              Engage, grow, and connect through our diverse offerings
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProgramCard
              title="Torah Learning"
              description="Daily Gemara shiurim, Halacha classes, and two full-day kollelim for all levels. Our Beis Medrash is vibrant from early morning until late at night."
              href="/programs#torah"
              gradient="from-navy/80 to-navy/40"
            />
            <ProgramCard
              title="Community Events"
              description="Weekly kiddushim, Shabbatonim, holiday celebrations for Chanukah, Purim, Lag BaOmer, Sukkos, and communal siyumim throughout the year."
              href="/programs#community"
              gradient="from-primary/60 to-navy/40"
            />
            <ProgramCard
              title="Women &amp; Youth"
              description="Women's shiurim, girls' Tehillim groups, and popular youth programs including Avos Ubanim and Masmidim for boys."
              href="/programs#youth"
              gradient="from-navy/70 to-primary/30"
            />
            <ProgramCard
              title="Chesed"
              description="Supporting families with simchos, babysitting, hospital visits, medical networking, and our active tzedakah fund and gemach."
              href="/programs#chesed"
              gradient="from-primary/50 to-navy/50"
            />
          </div>
        </div>
      </motion.section>

      {/* Inspirational Quote */}
      <section className="py-32 px-6 bg-navy relative overflow-hidden text-center">
        <div className="absolute top-0 left-0 w-full h-full opacity-5 pointer-events-none">
          <span className="text-[300px] absolute -top-20 -left-20 text-white leading-none select-none">
            &ldquo;
          </span>
        </div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-4xl mx-auto relative z-10"
        >
          <h2 className="serif-heading text-primary text-3xl md:text-5xl font-bold leading-tight italic">
            &ldquo;The world stands on three things: Torah, Avodah, and Gemilut
            Chasadim.&rdquo;
          </h2>
          <p className="text-white/60 mt-8 font-semibold tracking-[0.3em] uppercase text-sm">
            &mdash; Pirkei Avot 1:2
          </p>
        </motion.div>
      </section>

      {/* Donate CTA */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 px-6 bg-primary/10"
      >
        <div className="max-w-7xl mx-auto bg-white rounded-3xl p-10 md:p-20 shadow-xl border border-primary/20 flex flex-col md:flex-row items-center justify-between gap-12">
          <div className="max-w-xl">
            <h2 className="serif-heading text-navy text-4xl font-bold mb-4">
              Support Our Sanctuary
            </h2>
            <p className="text-navy/70 text-lg leading-relaxed">
              Kahal Beis Tefilla relies on the generosity of our members and
              friends. Your contributions directly support our daily operations,
              kollelim, shiurim, and community chesed programs.
            </p>
          </div>
          <div className="shrink-0">
            <Link
              href="/donate"
              className="bg-primary text-navy px-12 py-5 rounded-xl font-bold text-xl hover:shadow-lg hover:-translate-y-1 transition-all inline-flex items-center gap-3"
            >
              &#x2764; Donate Now
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function ScheduleItem({ label, time }: { label: string; time: string }) {
  return (
    <li className="flex justify-between border-b border-dotted border-navy/20 pb-1">
      <span>{label}</span>
      <span>{time}</span>
    </li>
  );
}

function ProgramCard({
  title,
  description,
  href,
  gradient,
}: {
  title: string;
  description: string;
  href: string;
  gradient: string;
}) {
  return (
    <motion.div variants={fadeUp}>
      <Link href={href}>
        <div className="relative h-80 rounded-2xl overflow-hidden group cursor-pointer shadow-lg">
          <div
            className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-500`}
          />
          <div className="absolute inset-0 bg-navy/20 group-hover:bg-navy/10 transition-colors" />
          <div className="absolute inset-x-0 bottom-0 p-8 translate-y-4 group-hover:translate-y-0 transition-transform">
            <h3 className="serif-heading text-white text-3xl font-bold mb-2">
              {title}
            </h3>
            <p className="text-white/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              {description}
            </p>
            <div className="w-12 h-1 bg-primary mt-4" />
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function Sun() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <circle cx="12" cy="12" r="4" />
      <path d="M12 2v2m0 16v2M4.93 4.93l1.41 1.41m11.32 11.32l1.41 1.41M2 12h2m16 0h2M4.93 19.07l1.41-1.41m11.32-11.32l1.41-1.41" />
    </svg>
  );
}

function Sunset() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M17 18a5 5 0 00-10 0M12 9V2m-7 9h2m12 0h2M5.64 5.64l1.41 1.41m9.9 0l1.41-1.41" />
    </svg>
  );
}

function Moon() {
  return (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
      <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
    </svg>
  );
}
