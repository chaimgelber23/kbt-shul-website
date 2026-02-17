"use client";

import { motion } from "framer-motion";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function AboutPage() {
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
            About Our Kehilla
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light max-w-2xl mx-auto"
          >
            A fortress of Torah in the heart of Ramat Eshkol
          </motion.p>
        </motion.div>
      </section>

      {/* Who We Are */}
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
            Who We Are
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="w-20 h-1 bg-primary mb-10"
          />
          <div className="space-y-6 text-navy/80 text-lg leading-relaxed">
            <motion.p variants={fadeUp}>
              Ramat Eshkol has become the first choice for many families who are
              looking to call Yerushalayim their home &mdash; whether it is for
              a few years or for the foreseeable future. Yet many of these
              families are a great distance from their parents, siblings, and
              close friends.
            </motion.p>
            <motion.p variants={fadeUp}>
              For a location to become home, it needs more than a comfortable
              apartment; it requires an environment where one feels accepted and
              has friends who care.
            </motion.p>
            <motion.p variants={fadeUp}>
              <strong>
                Kahal Beis Tefilla is first and foremost a community.
              </strong>{" "}
              It is the place to form friendships and feel welcome. The
              kehilla&apos;s activities include programs for men and women, for
              boys and girls.
            </motion.p>
            <motion.p variants={fadeUp}>
              Our community comprises older couples who have retired to Ramat
              Eshkol, families choosing to bring up their children in
              Yerushalayim Ir Hakodesh, and young newlyweds beginning their
              journey together in Eretz Yisrael.
            </motion.p>
            <motion.p variants={fadeUp} className="font-semibold text-navy">
              The unifying feature that unites everyone is the common direction
              we all share &mdash; to grow greater in Torah and Avodas Hashem,
              to grow together.
            </motion.p>
          </div>
        </div>
      </motion.section>

      {/* Our Rav */}
      <motion.section
        id="rav"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-4xl font-bold mb-8"
          >
            Our Rav
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="w-20 h-1 bg-primary mb-10"
          />
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div variants={fadeUp} className="md:col-span-1">
              <div className="bg-navy/5 rounded-2xl p-8 text-center">
                <div className="w-32 h-32 bg-primary/20 rounded-full mx-auto mb-6 flex items-center justify-center">
                  <span className="text-primary text-4xl font-bold serif-heading">
                    RDS
                  </span>
                </div>
                <h3 className="serif-heading text-navy text-2xl font-bold">
                  Rabbi Dovid Steinhauer
                </h3>
                <p className="text-primary font-semibold mt-1">
                  &#x05E9;&#x05DC;&#x05D9;&#x05D8;&quot;&#x05D0;
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 space-y-5 text-navy/80 text-lg leading-relaxed"
            >
              <p>
                Rav Dovid Steinhauer was born and raised in South Africa under
                the tutelage of Rav Aharon Pfeuffer zt&quot;l. At a young age he
                came to Eretz Yisrael to learn in Yeshivas Kol Torah, under the
                leadership of Rav Shlomo Zalman Auerbach zt&quot;l.
              </p>
              <p>
                Rav Steinhauer subsequently learned in the Mir Yeshiva under Rav
                Yitzchak Ezrachi shlita and Rav Asher Arielli shlita. Rav
                Nosson Tzvi Finkel zt&quot;l appointed Rav Steinhauer, at the
                age of twenty-five, as a Rosh Chabura in the Mir.
              </p>
              <p>
                Today, Rav Steinhauer serves as a maggid shiur in Beis Midrash
                L&apos;Torah, Rosh Chabura in the Jerusalem Kollel, and Rosh
                Kollel of Kollel Hora&apos;ah Ramat Eshkol and Kollel Shas,
                located in the shul.
              </p>
              <p>
                Rav Dovid Steinhauer was zoche to be a talmid of Rav Moshe
                Shapira zt&quot;l and Rav Shlomo Wolbe zt&quot;l for many years,
                and gives nightly shiurim in the shul based on their teachings.
                His online shiurim are followed by hundreds of talmidim around
                the world every week.
              </p>
              <p>
                Rav Steinhauer is also part of the Beis Hora&apos;ah of Shearis
                Yisrael under Rav Dovid Morgenstern shlita, and is available to
                answer questions on halacha throughout the day. He is always
                accessible to guide and advise members of the kehilla.
              </p>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Mission */}
      <section className="py-24 px-6 bg-navy text-center">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeUp}
          className="max-w-3xl mx-auto"
        >
          <h2 className="serif-heading text-primary text-3xl md:text-4xl font-bold mb-8">
            Our Mission
          </h2>
          <p className="text-white/80 text-xl leading-relaxed font-light">
            To provide a warm, welcoming home in Yerushalayim where families can
            grow together in Torah, Avodah, and Gemilut Chasadim. We strive to
            be a true community center &mdash; not just a place for minyanim,
            but a place to form lasting connections in the Ir Hakodesh.
          </p>
        </motion.div>
      </section>
    </main>
  );
}
