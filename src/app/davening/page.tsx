"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.1 } },
};

export default function DaveningPage() {
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
            Davening Times
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light"
          >
            Beis Medrash open daily 6:45 AM &ndash; 11:30 PM
          </motion.p>
        </motion.div>
      </section>

      {/* Weekday Schedule */}
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
            className="serif-heading text-navy text-3xl font-bold mb-10"
          >
            Weekday Schedule
          </motion.h2>
          <div className="grid md:grid-cols-3 gap-8">
            <ScheduleCard
              title="Shacharis"
              items={[
                { label: "Vasikin", time: "At Sunrise" },
                { label: "First Minyan", time: "7:00 AM" },
                { label: "Second Minyan", time: "8:15 AM" },
              ]}
            />
            <ScheduleCard
              title="Mincha"
              items={[
                { label: "Early Mincha", time: "1:45 PM" },
                { label: "Mincha Bizman", time: "15m before Shkiah" },
              ]}
            />
            <ScheduleCard
              title="Maariv"
              items={[
                { label: "First Maariv", time: "20m after Shkiah" },
                { label: "Late Maariv", time: "9:00 PM" },
                { label: "Final Maariv", time: "10:00 PM" },
              ]}
            />
          </div>
        </div>
      </motion.section>

      {/* Shabbos Schedule */}
      <motion.section
        id="shabbos"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-3xl font-bold mb-10"
          >
            Shabbos Schedule
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <ScheduleCard
              title="Friday Night"
              items={[
                { label: "Mincha &amp; Kabbalas Shabbos", time: "At Candle Lighting" },
                { label: "Erev Shabbos Learning Seder", time: "After Maariv" },
              ]}
            />
            <ScheduleCard
              title="Shabbos Day"
              items={[
                { label: "Shacharis (Vasikin)", time: "At Sunrise" },
                { label: "Shacharis (Main)", time: "8:30 AM" },
                { label: "Mincha Gedolah", time: "12:30 PM" },
                { label: "Mincha", time: "Before Shkiah" },
                { label: "Maariv &amp; Havdalah", time: "After Shabbos" },
              ]}
            />
          </div>
        </div>
      </motion.section>

      {/* Yom Tov */}
      <motion.section
        id="yomtov"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <h2 className="serif-heading text-navy text-3xl font-bold mb-6">
            Yom Tov Schedule
          </h2>
          <p className="text-navy/70 text-lg leading-relaxed max-w-3xl">
            Special davening times for Yom Tov are announced before each Chag.
            Please check our weekly announcements or contact us for the latest
            Yom Tov schedule. We host special Neilas HaChag programs and
            communal celebrations throughout the Chagim.
          </p>
        </div>
      </motion.section>

      {/* Learning Schedule */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-navy"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-primary text-3xl font-bold mb-10"
          >
            Daily Learning Programs
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              variants={fadeUp}
              className="bg-white/5 border border-primary/20 rounded-2xl p-8"
            >
              <h3 className="text-primary font-bold text-xl mb-4">
                Morning Programs
              </h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">&#x2022;</span>
                  Two early-morning kollelim before Shacharis
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">&#x2022;</span>
                  Two advanced full-day kollelim
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">&#x2022;</span>
                  Kollel Hora&apos;ah &amp; Kollel Shas
                </li>
              </ul>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="bg-white/5 border border-primary/20 rounded-2xl p-8"
            >
              <h3 className="text-primary font-bold text-xl mb-4">
                Evening Programs
              </h3>
              <ul className="space-y-3 text-white/80">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">&#x2022;</span>
                  Three night kollelim
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">&#x2022;</span>
                  Nightly shiurim by the Rav
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">&#x2022;</span>
                  Special learning sedarim every Erev Shabbos
                </li>
              </ul>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function ScheduleCard({
  title,
  items,
}: {
  title: string;
  items: { label: string; time: string }[];
}) {
  return (
    <motion.div
      variants={fadeUp}
      className="bg-white border-2 border-primary/20 rounded-2xl overflow-hidden shadow-lg"
    >
      <div className="bg-navy p-5">
        <h3 className="text-primary font-bold text-xl text-center">{title}</h3>
      </div>
      <ul className="p-6 space-y-4">
        {items.map((item) => (
          <li
            key={item.label}
            className="flex justify-between border-b border-dotted border-navy/15 pb-2 text-navy font-medium"
          >
            <span dangerouslySetInnerHTML={{ __html: item.label }} />
            <span className="text-navy/60">{item.time}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  );
}
