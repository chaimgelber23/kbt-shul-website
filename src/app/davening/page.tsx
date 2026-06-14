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
      <section className="bg-navy py-24 md:py-28 px-6 text-center">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={stagger}
          className="max-w-4xl mx-auto"
        >
          <motion.p
            variants={fadeUp}
            className="eyebrow text-primary mb-4"
          >
            Kahal Beis Tefilla
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="serif-heading text-primary text-5xl md:text-6xl font-bold text-balance"
          >
            Davening Times
          </motion.h1>
          <motion.div
            variants={fadeUp}
            className="gold-divider mx-auto mt-6 mb-6"
          />
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light text-pretty"
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
        className="py-20 md:py-24 px-6 bg-bg-light"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="mb-12 md:mb-14">
            <p className="eyebrow mb-3">Sunday &ndash; Friday</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold">
              Weekday Schedule
            </h2>
            <div className="gold-divider mt-5 mb-4" />
            <p className="text-navy/60 text-lg text-pretty">
              Minyanim throughout the day, from Vasikin to the final Maariv
            </p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
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
        className="py-20 md:py-24 px-6 bg-bg-alt"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="mb-12 md:mb-14">
            <p className="eyebrow mb-3">Friday Night &amp; Shabbos Day</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold">
              Shabbos Schedule
            </h2>
            <div className="gold-divider mt-5 mb-4" />
            <p className="text-navy/60 text-lg text-pretty">
              From Kabbalas Shabbos through Havdalah
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
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
        variants={stagger}
        className="py-20 md:py-24 px-6 bg-bg-light"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="mb-8">
            <p className="eyebrow mb-3">Throughout the Year</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold">
              Yom Tov Schedule
            </h2>
            <div className="gold-divider mt-5 mb-4" />
          </motion.div>
          <motion.div variants={fadeUp} className="card shadow-card hover:shadow-card-hover transition-shadow max-w-3xl p-8 md:p-10">
            <p className="text-navy/70 text-lg leading-relaxed text-pretty">
              Special davening times for Yom Tov are announced before each Chag.
              Please check our weekly announcements or contact us for the latest
              Yom Tov schedule. We host special Neilas HaChag programs and
              communal celebrations throughout the Chagim.
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Learning Schedule */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 md:py-24 px-6 bg-navy"
      >
        <div className="max-w-6xl mx-auto">
          <motion.div variants={fadeUp} className="mb-12 md:mb-14">
            <p className="eyebrow mb-3">Torah Around the Clock</p>
            <h2 className="serif-heading text-primary text-4xl md:text-5xl font-bold">
              Daily Learning Programs
            </h2>
            <div className="gold-divider mt-5 mb-4" />
            <p className="text-white/60 text-lg text-pretty">
              A vibrant Beis Medrash from before Shacharis until late at night
            </p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              variants={fadeUp}
              className="bg-white/5 border border-primary/20 rounded-2xl p-8 transition-colors hover:bg-white/[0.07] hover:border-primary/30"
            >
              <h3 className="serif-heading text-primary font-bold text-xl mb-4">
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
              className="bg-white/5 border border-primary/20 rounded-2xl p-8 transition-colors hover:bg-white/[0.07] hover:border-primary/30"
            >
              <h3 className="serif-heading text-primary font-bold text-xl mb-4">
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
      className="bg-white border-2 border-primary/20 rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover hover:-translate-y-1 transition-all duration-300"
    >
      <div className="bg-navy p-5">
        <h3 className="serif-heading text-primary font-bold text-xl text-center">{title}</h3>
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
