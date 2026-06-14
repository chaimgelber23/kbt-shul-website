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
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    message: "",
  });

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const subject = encodeURIComponent(
      `Message from ${formData.firstName} ${formData.lastName} — KBT Website`
    );
    const body = encodeURIComponent(
      `From: ${formData.firstName} ${formData.lastName}\nEmail: ${formData.email}\n\n${formData.message}`
    );
    window.location.href = `mailto:info@kbtshul.com?subject=${subject}&body=${body}`;
  }

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
            Contact Us
          </motion.h1>
          <motion.div variants={fadeUp} className="gold-divider mx-auto mt-6 mb-6" />
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
        className="py-24 px-6 bg-bg-alt"
      >
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-16">
          {/* Contact Form */}
          <motion.div variants={fadeUp}>
            <p className="eyebrow mb-3">Get In Touch</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold">
              Send Us a Message
            </h2>
            <div className="gold-divider mt-5 mb-8" />
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-navy font-semibold text-sm mb-2">
                    First Name *
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
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
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
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
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white"
                />
              </div>
              <div>
                <label className="block text-navy font-semibold text-sm mb-2">
                  Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 rounded-xl border-2 border-navy/10 focus:border-primary focus:outline-none transition-colors bg-white resize-none"
                />
              </div>
              <button
                type="submit"
                className="btn btn-primary px-10 py-4 text-lg"
              >
                Send Message
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </button>
            </form>
          </motion.div>

          {/* Contact Info & Map */}
          <motion.div variants={fadeUp}>
            <p className="eyebrow mb-3">Our Home in Ramat Eshkol</p>
            <h2 className="serif-heading text-navy text-4xl md:text-5xl font-bold">
              Visit Us
            </h2>
            <div className="gold-divider mt-5 mb-8" />
            <div className="space-y-4 mb-10">
              <div className="card card-hover flex items-start gap-4 p-5">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><path d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                </div>
                <div>
                  <h3 className="text-navy font-bold text-lg">Address</h3>
                  <p className="text-navy/70 leading-relaxed">
                    21 Ramat Hagolan Street
                    <br />
                    Jerusalem, Israel
                  </p>
                </div>
              </div>
              <div className="card card-hover flex items-start gap-4 p-5">
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
              <div className="card card-hover flex items-start gap-4 p-5">
                <div className="size-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                </div>
                <div>
                  <h3 className="text-navy font-bold text-lg">
                    Beis Medrash Hours
                  </h3>
                  <p className="text-navy/70 leading-relaxed">
                    Open daily 6:45 AM &ndash; 11:30 PM
                  </p>
                </div>
              </div>
            </div>

            {/* Map Embed */}
            <div className="rounded-2xl overflow-hidden shadow-card hover:shadow-card-hover transition-shadow border-2 border-primary/20">
              <iframe
                src="https://maps.google.com/maps?q=21+Ramat+Hagolan,+Jerusalem,+Israel&t=&z=16&ie=UTF8&iwloc=&output=embed"
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
