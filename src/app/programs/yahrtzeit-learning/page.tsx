"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const stagger = {
  visible: { transition: { staggerChildren: 0.15 } },
};

export default function YahrtTime() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    niftar: "",
    yahrtzeit: "",
    hebrewDate: "",
    relationship: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Email submission logic here
    const subject = encodeURIComponent("Yahrtzeit Learning Program Request");
    const body = encodeURIComponent(`Name: ${formData.name}
Email: ${formData.email}
Phone: ${formData.phone}

Niftar Name: ${formData.niftar}
Yahrtzeit Date (Hebrew): ${formData.hebrewDate}
Yahrtzeit Date (English): ${formData.yahrtzeit}
Relationship: ${formData.relationship}

Additional Notes:
${formData.notes}`);

    window.location.href = `mailto:kbtdraw@gmail.com?subject=${subject}&body=${body}`;
  };

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
            Yahrtzeit Learning Program
          </motion.h1>
          <motion.p
            variants={fadeUp}
            className="text-white/80 text-xl font-light"
          >
            Honor the memory of your loved ones with a specific Torah curriculum
          </motion.p>
        </motion.div>
      </section>

      {/* Overview */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-4xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="serif-heading text-navy text-4xl font-bold mb-6">
              A Specific Curriculum for a Yahrtzeit
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-8" />
            <p className="text-navy/80 text-lg leading-relaxed">
              Our Yahrtzeit Learning Program provides a specially selected curriculum
              (mesugel) of Torah study dedicated to elevating the neshamah of your
              loved one on their yahrtzeit. Members of our kollel learn specific
              limudim chosen for their spiritual significance.
            </p>
          </motion.div>

          <motion.div
            variants={fadeUp}
            className="bg-white border-2 border-primary/20 rounded-xl p-8 mt-12"
          >
            <h3 className="text-navy font-bold text-2xl mb-4 flex items-center gap-2">
              <BookIcon /> The Limudim
            </h3>
            <p className="text-navy/70 mb-6">
              With your donation, chashuva avreichim and members of the shul will set aside time to learn on the yahrtzeit of your loved one.
            </p>
            <p className="text-navy/70 mb-6">
              The learning includes <strong>mishnayos in the name of the niftar</strong>, certain gemaras, and other limudim which are selected specially for a Yahrtzeit by the Chida (such as Zohar, and more).
            </p>
            <div className="p-4 bg-primary/5 rounded-lg border border-primary/10">
              <p className="text-sm text-navy/70">
                For the complete list of limudim and their sources, please contact us.
              </p>
            </div>
          </motion.div>
        </div>
      </motion.section>

      {/* How It Works */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={stagger}
        className="py-20 px-6 bg-bg-light"
      >
        <div className="max-w-5xl mx-auto">
          <motion.div variants={fadeUp} className="text-center mb-12">
            <h2 className="serif-heading text-navy text-4xl font-bold mb-6">
              How It Works
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto" />
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Submit Your Request"
              description="Fill out the form below with the yahrtzeit details and your contact information."
            />
            <StepCard
              number="2"
              title="Kollel Learns"
              description="Members of our kollel will complete the specific curriculum on or near the yahrtzeit date."
            />
            <StepCard
              number="3"
              title="Completion"
              description="You'll be notified when the learning is completed. Payment will be requested after the limud is finished."
            />
          </div>
        </div>
      </motion.section>

      {/* Registration Form */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-20 px-6 bg-bg-alt"
      >
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="serif-heading text-navy text-4xl font-bold mb-6">
              Register for the Program
            </h2>
            <div className="w-20 h-1 bg-primary mx-auto mb-6" />
            <p className="text-navy/70">
              Please fill out this form, contact us via WhatsApp at{" "}
              <a
                href="https://wa.me/972534631889"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:underline"
              >
                +972-53-463-1889
              </a>
              , or email{" "}
              <a
                href="mailto:kbtdraw@gmail.com"
                className="text-primary hover:underline"
              >
                kbtdraw@gmail.com
              </a>{" "}
              to navigate the yahrtzeit program.
            </p>
            <p className="text-navy/60 text-sm mt-3">
              The suggested donation is $360.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="bg-white border-2 border-primary/20 rounded-2xl p-8 shadow-xl space-y-6"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <FormField
                label="Your Name"
                type="text"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
              <FormField
                label="Email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <FormField
              label="Phone"
              type="tel"
              required
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />

            <div className="border-t border-primary/10 pt-6 mt-6">
              <h4 className="font-bold text-navy mb-4">Yahrtzeit Details</h4>

              <div className="space-y-6">
                <FormField
                  label="Name of Niftar/Nifteres"
                  type="text"
                  required
                  placeholder="e.g., Moshe ben Avraham"
                  value={formData.niftar}
                  onChange={(e) =>
                    setFormData({ ...formData, niftar: e.target.value })
                  }
                />

                <div className="grid md:grid-cols-2 gap-6">
                  <FormField
                    label="Hebrew Date"
                    type="text"
                    required
                    placeholder="e.g., 15 Shevat"
                    value={formData.hebrewDate}
                    onChange={(e) =>
                      setFormData({ ...formData, hebrewDate: e.target.value })
                    }
                  />
                  <FormField
                    label="Yahrtzeit Date (English Calendar)"
                    type="date"
                    required
                    value={formData.yahrtzeit}
                    onChange={(e) =>
                      setFormData({ ...formData, yahrtzeit: e.target.value })
                    }
                  />
                </div>

                <FormField
                  label="Relationship"
                  type="text"
                  placeholder="e.g., Father, Mother, Grandfather"
                  value={formData.relationship}
                  onChange={(e) =>
                    setFormData({ ...formData, relationship: e.target.value })
                  }
                />

                <div>
                  <label className="block text-sm font-semibold text-navy mb-2">
                    Additional Notes
                  </label>
                  <textarea
                    rows={4}
                    className="w-full border-2 border-primary/20 rounded-lg px-4 py-3 text-navy focus:border-primary focus:outline-none transition-colors"
                    placeholder="Any special requests or information..."
                    value={formData.notes}
                    onChange={(e) =>
                      setFormData({ ...formData, notes: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <div className="pt-6">
              <button
                type="submit"
                className="w-full bg-primary text-navy font-bold py-4 rounded-xl hover:shadow-lg hover:-translate-y-0.5 transition-all text-lg"
              >
                Submit Request
              </button>
              <p className="text-sm text-navy/60 text-center mt-4">
                Payment will be requested after the limud is completed.
              </p>
            </div>
          </form>
        </div>
      </motion.section>

      {/* Questions */}
      <motion.section
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        variants={fadeUp}
        className="py-16 px-6 bg-bg-light"
      >
        <div className="max-w-3xl mx-auto text-center">
          <h3 className="text-navy text-2xl font-bold mb-4">Questions?</h3>
          <p className="text-navy/70 mb-6">
            For more information about the Yahrtzeit Learning Program or to discuss
            specific requirements, please contact us:
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="mailto:office@kbtshul.org"
              className="bg-white border-2 border-primary/20 text-navy px-6 py-3 rounded-lg font-semibold hover:bg-primary/5 transition-colors"
            >
              office@kbtshul.org
            </a>
            <Link
              href="/contact"
              className="bg-primary text-navy px-6 py-3 rounded-lg font-semibold hover:shadow-md transition-shadow"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </motion.section>
    </main>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <motion.div variants={fadeUp} className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-primary/10 text-primary rounded-full text-2xl font-bold mb-4">
        {number}
      </div>
      <h4 className="text-navy font-bold text-xl mb-3">{title}</h4>
      <p className="text-navy/70">{description}</p>
    </motion.div>
  );
}

function FormField({
  label,
  type,
  required = false,
  placeholder = "",
  value,
  onChange,
}: {
  label: string;
  type: string;
  required?: boolean;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div>
      <label className="block text-sm font-semibold text-navy mb-2">
        {label}
        {required && <span className="text-primary ml-1">*</span>}
      </label>
      <input
        type={type}
        required={required}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full border-2 border-primary/20 rounded-lg px-4 py-3 text-navy focus:border-primary focus:outline-none transition-colors"
      />
    </div>
  );
}

function BookIcon() {
  return (
    <svg
      className="w-6 h-6 text-primary"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
      strokeWidth={2}
    >
      <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  );
}
