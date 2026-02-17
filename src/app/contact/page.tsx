"use client";

import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);

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
            Contact Us
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light"
          >
            We&apos;d love to hear from you
          </motion.p>
        </motion.div>
      </section>

      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div variants={fadeUp}>
            <h2 className="serif-heading text-navy text-3xl font-bold mb-8">
              Send Us a Message
            </h2>
            {submitted ? (
              <div className="bg-primary/10 border border-primary/30 rounded-2xl p-10 text-center">
                <svg className="w-12 h-12 text-primary mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" /></svg>
                <h3 className="text-navy text-xl font-bold mb-2">
                  Message Sent!
                </h3>
                <p className="text-navy/70">
                  Thank you for reaching out. We&apos;ll get back to you soon.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSubmitted(true);
                }}
                className="space-y-6"
              >
                <div className="grid sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-navy font-semibold text-sm mb-2">
                      Last Name *
                    </label>
                    <input
                      type="text"
                      required
                      className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    required
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                  />
                </div>
                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    Message *
                  </label>
                  <textarea
                    required
                    rows={5}
                    className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white resize-none"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-primary text-navy px-10 py-4 rounded-xl font-bold text-lg hover:bg-primary-light transition-all shadow-lg"
                >
                  Send Message
                </button>
              </form>
            )}
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div variants={fadeUp}>
            <h2 className="serif-heading text-navy text-3xl font-bold mb-8">
              Visit Us
            </h2>
            <div className="space-y-6 mb-10">
              <div className="flex items-start gap-4">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-navy font-bold text-lg">Address</h3>
                  <p className="text-navy/70">
                    16b Ramat Hagolan Street
                    <br />
                    Jerusalem, Israel
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                </div>
                <div>
                  <h3 className="text-navy font-bold text-lg">Email</h3>
                  <a
                    href="mailto:info@kbtshul.com"
                    className="text-primary hover:text-primary-light transition-colors"
                  >
                    info@kbtshul.com
                  </a>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                </div>
                <div>
                  <h3 className="text-navy font-bold text-lg">
                    Beis Medrash Hours
                  </h3>
                  <p className="text-navy/70">
                    Open daily 6:45 AM &ndash; 11:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="rounded-2xl overflow-hidden shadow-lg border-2 border-primary/20">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3391.5!2d35.2293!3d31.7985!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDQ3JzU0LjYiTiAzNcKwMTMnNDUuNSJF!5e0!3m2!1sen!2sil!4v1"
                width="100%"
                height="300"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Kahal Beis Tefilla Location"
              />
            </div>
          </motion.div>
        </div>
      </motion.section>
    </main>
  );
}
