"use client";

import Image from "next/image";
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
          <motion.p variants={fadeUp} className="eyebrow mb-4">
            Kahal Beis Tefilla
          </motion.p>
          <motion.h1
            variants={fadeUp}
            className="serif-heading text-primary text-5xl md:text-6xl font-bold text-balance"
          >
            About Our Kehilla
          </motion.h1>
          <motion.div
            variants={fadeUp}
            className="gold-divider mx-auto mt-6 mb-7"
          />
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light max-w-2xl mx-auto text-pretty"
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
        className="py-24 px-6 bg-bg-alt"
      >
        <div className="max-w-4xl mx-auto">
          <motion.p variants={fadeUp} className="eyebrow mb-3">
            Our Community
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-4xl md:text-5xl font-bold"
          >
            Who We Are
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="gold-divider mt-5 mb-10"
          />
          <div className="space-y-6 text-navy/70 text-lg leading-relaxed">
            <motion.p variants={fadeUp} className="text-pretty">
              Ramat Eshkol has become the first choice for many families who are
              looking to call Yerushalayim their home &mdash; whether it is for
              a few years or for the foreseeable future. Yet many of these
              families are a great distance from their parents, siblings, and
              close friends.
            </motion.p>
            <motion.p variants={fadeUp} className="text-pretty">
              For a location to become home, it needs more than a comfortable
              apartment; it requires an environment where one feels accepted and
              has friends who care.
            </motion.p>
            <motion.p variants={fadeUp} className="text-pretty">
              <strong className="text-navy">
                Kahal Beis Tefilla is first and foremost a community.
              </strong>{" "}
              It is the place to form friendships and feel welcome. The
              kehilla&apos;s activities include programs for men and women, for
              boys and girls.
            </motion.p>
            <motion.p variants={fadeUp} className="text-pretty">
              Our community comprises older couples who have retired to Ramat
              Eshkol, families choosing to bring up their children in
              Yerushalayim Ir Hakodesh, and young newlyweds beginning their
              journey together in Eretz Yisrael.
            </motion.p>
            <motion.p variants={fadeUp} className="font-semibold text-navy text-pretty">
              The unifying feature that unites everyone is the common direction
              we all share &mdash; to grow greater in Torah and Avodas Hashem,
              to grow together.
            </motion.p>
          </div>

          {/* Community Photo */}
          <motion.div variants={fadeUp} className="mt-12">
            <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow duration-300">
              <Image
                src="/community-gathering.jpg"
                alt="A community gathering at Kahal Beis Tefilla"
                width={900}
                height={500}
                className="w-full h-auto object-cover"
              />
            </div>
            <p className="text-navy/50 text-sm text-center mt-3 italic">
              A community gathering at Kahal Beis Tefilla
            </p>
          </motion.div>
        </div>
      </motion.section>

      {/* Our Rav */}
      <motion.section
        id="rav"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-24 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <motion.p variants={fadeUp} className="eyebrow mb-3">
            Spiritual Leadership
          </motion.p>
          <motion.h2
            variants={fadeUp}
            className="serif-heading text-navy text-4xl md:text-5xl font-bold"
          >
            Our Rav
          </motion.h2>
          <motion.div
            variants={fadeUp}
            className="gold-divider mt-5 mb-10"
          />
          <div className="grid md:grid-cols-3 gap-12">
            <motion.div variants={fadeUp} className="md:col-span-1">
              <div className="card p-8 text-center shadow-card hover:shadow-card-hover transition-shadow duration-300">
                <div className="w-48 h-48 rounded-full mx-auto mb-6 overflow-hidden shadow-gold border-4 border-primary/20">
                  <Image
                    src="/rabbi-steinhauer.jpg"
                    alt="Rabbi Dovid Steinhauer"
                    width={192}
                    height={192}
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <h3 className="serif-heading text-navy text-xl font-bold">
                  Rabbi Dovid Steinhauer
                </h3>
                <p className="text-primary font-semibold mt-1">
                  &#x05E9;&#x05DC;&#x05D9;&#x05D8;&quot;&#x05D0;
                </p>
              </div>
            </motion.div>
            <motion.div
              variants={fadeUp}
              className="md:col-span-2 space-y-5 text-navy/70 text-lg leading-relaxed text-pretty"
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
          <p className="eyebrow mb-3">Our Purpose</p>
          <h2 className="serif-heading text-primary text-4xl md:text-5xl font-bold text-balance">
            Our Mission
          </h2>
          <div className="gold-divider mx-auto mt-5 mb-8" />
          <p className="text-white/80 text-xl leading-relaxed font-light text-pretty">
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
