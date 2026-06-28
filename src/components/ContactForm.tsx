import { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { business, contactCopy } from "../data/content";

const inputClass =
  "w-full border border-curly-border bg-white px-4 py-3 text-curly-body text-sm focus:outline-none focus:border-curly-accent transition-colors";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [topic, setTopic] = useState(contactCopy.inquiryTypes[0]);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!email.trim() && !phone.trim()) {
      setError("Please add an email or phone so we can reply.");
      return;
    }

    const subject = `Website inquiry: ${topic}`;
    const body = [
      `Name: ${name.trim()}`,
      `Email: ${email.trim() || "—"}`,
      `Phone: ${phone.trim() || "—"}`,
      `Topic: ${topic}`,
      "",
      message.trim(),
    ].join("\n");

    window.location.href = `mailto:${business.email}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="premium-card mobile-card lg:rounded-none lg:shadow-none card-pad text-center"
      >
        <div className="w-14 h-14 border border-curly-accent/40 flex items-center justify-center mb-6 mx-auto">
          <Check size={24} className="text-curly-accent-dark" strokeWidth={1.5} />
        </div>
        <h3 className="font-serif text-2xl mb-3">Thanks for reaching out</h3>
        <p className="prose-body-sm max-w-sm mx-auto mb-6">
          Your email app should have opened with your message ready to send. We'll get back to you
          within 24 hours. For anything urgent, please call the studio.
        </p>
        <a href={business.phoneHref} className="curly-link justify-center w-full">
          Call {business.phone}
        </a>
      </motion.div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="premium-card mobile-card lg:rounded-none lg:shadow-none card-pad"
    >
      <p className="curly-label-gold mb-2">Send a Message</p>
      <h3 className="font-serif text-2xl mb-6">How can we help?</h3>

      <div className="space-y-4">
        <div>
          <label htmlFor="contact-name" className="curly-label block mb-2">
            Full Name *
          </label>
          <input
            id="contact-name"
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className={inputClass}
            placeholder="Your name"
          />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <div>
            <label htmlFor="contact-email" className="curly-label block mb-2">
              Email
            </label>
            <input
              id="contact-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="contact-phone" className="curly-label block mb-2">
              Phone
            </label>
            <input
              id="contact-phone"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
              placeholder="(917) 555-0123"
            />
          </div>
        </div>
        <div>
          <label htmlFor="contact-topic" className="curly-label block mb-2">
            Topic
          </label>
          <select
            id="contact-topic"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className={inputClass}
          >
            {contactCopy.inquiryTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="contact-message" className="curly-label block mb-2">
            Message
          </label>
          <textarea
            id="contact-message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            rows={4}
            className={`${inputClass} resize-y`}
            placeholder="Tell us what you're looking for…"
          />
        </div>
      </div>

      {error && (
        <p className="text-sm text-red-700 mt-4" role="alert">
          {error}
        </p>
      )}

      <button type="submit" className="curly-btn-gold w-full mt-6">
        Send Message
      </button>
      <p className="text-[11px] text-curly-muted text-center mt-4 leading-relaxed">
        {contactCopy.formNote}
      </p>
    </form>
  );
}
