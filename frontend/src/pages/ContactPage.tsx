import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, MapPin, Send } from 'lucide-react';
import { FormEvent, useState } from 'react';
import PageTransition from '../components/PageTransition';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // Here you would typically send the form data to a backend
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <PageTransition>
      <div className="bg-gradient-to-br from-[#0b0f14] via-[#0d1117] to-[#161b22] text-white overflow-hidden">
        {/* Background elements */}
        <div className="fixed inset-0 pointer-events-none z-0 opacity-30">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse animation-delay-2000" />
        </div>

        {/* Hero Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16 md:py-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center space-y-6"
          >
            <h1 className="text-5xl md:text-6xl font-bold">
              Get In Touch
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Have questions about BloodConnect? We'd love to hear from you. Get in touch with our team today.
            </p>
          </motion.div>
        </section>

        {/* Contact Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12">
            {/* Contact Info */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-4xl font-bold mb-6">Contact Information</h2>
                <p className="text-lg text-slate-400 mb-8">
                  Reach out to our team for support, partnerships, or general inquiries.
                </p>
              </div>

              {[
                {
                  icon: '📧',
                  label: 'Email',
                  value: 'support@bloodconnect.ai',
                  href: 'mailto:support@bloodconnect.ai?subject=Support%20Request&body=Hello%20Team%2C%0A%0AI%20need%20assistance%20with%20...',
                },
                {
                  icon: '📞',
                  label: 'Phone',
                  value: '+91 8072971296',
                  href: 'tel:+918072971296',
                },
                { icon: <MapPin className="w-6 h-6" />, label: 'Address', value: '123 Healthcare Blvd, Medical City, MC 12345' },
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="flex gap-4 items-start"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center text-red-400 flex-shrink-0">
                    {typeof item.icon === 'string' ? <span className="text-xl">{item.icon}</span> : item.icon}
                  </div>
                  <div className="flex flex-col">
                    <h3 className="font-semibold text-lg">{item.label}</h3>
                    {item.href ? (
                      <a
                        href={item.href}
                        className="mt-1 inline-flex items-center gap-2 rounded-lg px-3 py-1 text-sm text-slate-200 transition hover:from-cyan-400 hover:to-blue-500 hover:bg-gradient-to-r"
                        target={item.href.startsWith('http') ? '_blank' : undefined}
                        rel={item.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      >
                        <span className="text-sm text-slate-300">{item.value}</span>
                      </a>
                    ) : (
                      <p className="text-slate-400 mt-1 text-sm">{item.value}</p>
                    )}
                  </div>
                </motion.div>
              ))}

              <div className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-8 backdrop-blur-md">
                <h3 className="font-semibold text-lg mb-4">Response Time</h3>
                <p className="text-slate-400">
                  We typically respond to inquiries within 24 hours during business days. For urgent matters, please call our support line.
                </p>
              </div>
            </motion.div>

            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold mb-2">Full Name</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-red-500/50 focus:bg-white/10 transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Email Address</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-red-500/50 focus:bg-white/10 transition"
                    placeholder="your@email.com"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Subject</label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-red-500/50 focus:bg-white/10 transition"
                    placeholder="How can we help?"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2">Message</label>
                  <textarea
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    rows={5}
                    className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white placeholder-slate-500 outline-none focus:border-red-500/50 focus:bg-white/10 transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {submitted && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-emerald-300 text-center"
                  >
                    ✓ Thank you! We've received your message and will get back to you soon.
                  </motion.div>
                )}

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="w-full px-8 py-3 bg-gradient-to-r from-red-600 to-red-500 rounded-full font-semibold text-white flex items-center justify-center gap-2 hover:shadow-[0_0_20px_rgba(239,68,68,0.4)] transition"
                >
                  <Send className="w-5 h-5" />
                  Send Message
                </motion.button>
              </form>
            </motion.div>
          </div>
        </section>
      </div>
    </PageTransition>
  );
};

export default ContactPage;
