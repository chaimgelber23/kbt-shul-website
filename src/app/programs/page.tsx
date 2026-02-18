"use client";

import Link from "next/link";
import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function ProgramsPage() {
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
            Our Programs
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light"
          >
            Torah, community, and chesed at the heart of everything we do
          </motion.p>
        </motion.div>
      </section>

      {/* Torah Learning */}
      <motion.section
        id="torah"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <div className="w-6 h-0.5 bg-primary" />
            </div>
            <h2 className="serif-heading text-navy text-4xl font-bold">
              Torah Learning
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-10" />
          <div className="space-y-6 text-navy/80 text-lg leading-relaxed">
            <motion.p variants={fadeUp}>
              At the heart of our community lies a deep commitment to Torah
              learning. On a typical day, the Beis Medrash is vibrant from 6:45
              AM until 11:30 PM, hosting two early-morning kollelim before
              Shacharis, two advanced full-day kollelim, afternoon learning
              programs, three night kollelim, and two special sedarim every Erev
              Shabbos &mdash; in addition to numerous daily shiurim.
            </motion.p>
            <motion.p variants={fadeUp}>
              Whether our members are learning full-time, working professionals,
              or retirees, everyone is actively engaged in Torah.
            </motion.p>
          </div>
          <motion.div
            variants={fadeUp}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProgramFeature
              title="Kollelim"
              description="Two early-morning, two full-day, and three night kollelim"
            />
            <ProgramFeature
              title="Kollel Hora'ah"
              description="Advanced halacha program under Rav Steinhauer"
            />
            <ProgramFeature
              title="Kollel Shas"
              description="In-depth Gemara study located in the shul"
            />
            <ProgramFeature
              title="Nightly Shiurim"
              description="Based on the teachings of Rav Moshe Shapira and Rav Wolbe"
            />
            <ProgramFeature
              title="Online Shiurim"
              description="Followed by hundreds of talmidim worldwide"
            />
            <ProgramFeature
              title="Erev Shabbos Seder"
              description="Special learning programs every Friday"
            />
            <Link href="/programs/yahrtzeit-learning" className="group">
              <div className="bg-white border-2 border-primary/25 rounded-xl p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all">
                <h4 className="text-navy font-bold text-lg mb-2 group-hover:text-primary transition-colors">
                  Yahrtzeit Learning
                </h4>
                <p className="text-navy/60 text-sm">
                  Reserve a day of dedicated Torah learning for a loved
                  one&apos;s yahrtzeit
                </p>
                <span className="inline-flex items-center gap-1 text-primary text-sm font-semibold mt-3 group-hover:gap-2 transition-all">
                  Learn more &#x2192;
                </span>
              </div>
            </Link>
          </motion.div>
        </div>
      </motion.section>

      {/* Community */}
      <motion.section
        id="community"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <div className="w-6 h-0.5 bg-primary" />
            </div>
            <h2 className="serif-heading text-navy text-4xl font-bold">
              Community Events
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-10" />
          <div className="space-y-6 text-navy/80 text-lg leading-relaxed">
            <motion.p variants={fadeUp}>
              Very few shuls in Yerushalayim serve as true community centers
              &mdash; most simply offer minyanim. At Kahal Beis Tefilla, our
              calendar is filled with weekly kiddushim, festive events for
              Chanukah, Purim, Lag BaOmer, Simchas Beis HaSho&apos;eva on
              Sukkos, Chol HaMoed Pesach gatherings, Neilas HaChag on Yom Tov,
              and communal siyumim throughout the year.
            </motion.p>
            <motion.p variants={fadeUp}>
              These are designed as family-friendly events, with special
              attention given to engaging children and creating a welcoming
              atmosphere for all. Our shul is not just a place for strangers to
              form a minyan &mdash; it&apos;s a place to form connections. The
              warmth and camaraderie are palpable the moment you walk through
              the door.
            </motion.p>
          </div>
          <motion.div
            variants={fadeUp}
            className="mt-12 grid sm:grid-cols-2 gap-6"
          >
            <ProgramFeature
              title="Weekly Kiddushim"
              description="Every Shabbos, bringing the community together"
            />
            <ProgramFeature
              title="Yom Tov Celebrations"
              description="Chanukah, Purim, Lag BaOmer, Sukkos, and more"
            />
            <ProgramFeature
              title="Communal Siyumim"
              description="Celebrating Torah milestones together"
            />
            <ProgramFeature
              title="Neilas HaChag"
              description="Special end-of-Yom-Tov gatherings"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Women & Youth */}
      <motion.section
        id="youth"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <div className="w-6 h-0.5 bg-primary" />
            </div>
            <h2 className="serif-heading text-navy text-4xl font-bold">
              Women &amp; Youth
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-10" />
          <motion.p
            variants={fadeUp}
            className="text-navy/80 text-lg leading-relaxed mb-12"
          >
            Our community also offers a variety of shiurim for women,
            girls&apos; Tehillim groups, and popular youth initiatives such as
            Avos Ubanim and Masmidim programs for boys. Nurturing the next
            generation is a core part of our mission.
          </motion.p>
          <motion.div
            variants={fadeUp}
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            <ProgramFeature
              title="Women's Shiurim"
              description="Regular classes and learning opportunities"
            />
            <ProgramFeature
              title="Tehillim Groups"
              description="Girls' Tehillim gatherings"
            />
            <ProgramFeature
              title="Avos Ubanim"
              description="Father-son learning program"
            />
            <ProgramFeature
              title="Masmidim"
              description="Youth learning incentive program"
            />
          </motion.div>
        </div>
      </motion.section>

      {/* Chesed */}
      <motion.section
        id="chesed"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="flex items-center gap-4 mb-8">
            <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <div className="w-6 h-0.5 bg-primary" />
            </div>
            <h2 className="serif-heading text-navy text-4xl font-bold">
              Chesed
            </h2>
          </motion.div>
          <motion.div variants={fadeUp} className="w-20 h-1 bg-primary mb-10" />
          <div className="space-y-6 text-navy/80 text-lg leading-relaxed">
            <motion.p variants={fadeUp}>
              Making the move to Yerushalayim is a beautiful and idealistic
              decision &mdash; but it isn&apos;t always easy. The familiar
              support systems many rely on abroad aren&apos;t always available
              here. That&apos;s where community becomes essential.
            </motion.p>
            <motion.p variants={fadeUp}>
              The strength of Kahal Beis Tefilla lies in its dedication to
              supporting one another &mdash; whether it&apos;s help with making
              simchos, babysitting in a pinch, accompanying someone in the
              hospital, or networking to find the right doctor, specialist, or a
              little protektzia when needed.
            </motion.p>
            <motion.p variants={fadeUp}>
              Our active tzedakah fund and gemach have enabled us to assist
              countless members during times of need &mdash; quietly,
              respectfully, and effectively.
            </motion.p>
          </div>
          <motion.div
            variants={fadeUp}
            className="mt-12 grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <ProgramFeature
              title="Simcha Support"
              description="Help organizing and running celebrations"
            />
            <ProgramFeature
              title="Babysitting Network"
              description="Community-organized childcare support"
            />
            <ProgramFeature
              title="Hospital Visits"
              description="Bikur cholim and companionship"
            />
            <ProgramFeature
              title="Medical Networking"
              description="Help finding doctors and specialists"
            />
            <ProgramFeature
              title="Tzedakah Fund"
              description="Discreet financial assistance"
            />
            <ProgramFeature
              title="Gemach"
              description="Interest-free community loan fund"
            />
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}

function ProgramFeature({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="bg-white border border-primary/15 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow">
      <h4 className="text-navy font-bold text-lg mb-2">{title}</h4>
      <p className="text-navy/60 text-sm">{description}</p>
    </div>
  );
}
