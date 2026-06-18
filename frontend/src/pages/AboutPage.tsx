import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ArrowRight, Heart, Lightbulb, Users, Target } from 'lucide-react';
import PageTransition from '../components/PageTransition';

const AboutPage = () => {
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
              About BloodConnect
            </h1>
            <p className="text-xl text-slate-400 max-w-2xl mx-auto">
              Building the world's most advanced AI-powered blood management and donor relationship platform.
            </p>
          </motion.div>
        </section>

        {/* Mission Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-6">Our Mission</h2>
              <p className="text-lg text-slate-300 mb-4 leading-relaxed">
                We exist to save lives by connecting blood donors, hospitals, and blood banks through intelligent technology. Every second matters during a medical emergency, and our platform is designed to eliminate delays and maximize efficiency.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                By leveraging AI and real-time data, we're transforming how blood is sourced, managed, and distributed across healthcare networks globally.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8 }}
              className="grid grid-cols-2 gap-6"
            >
              {[
                { icon: <Heart className="w-8 h-8" />, label: 'Donors', value: '10,000+' },
                { icon: <Target className="w-8 h-8" />, label: 'Hospitals', value: '250+' },
                { icon: <Users className="w-8 h-8" />, label: 'Blood Banks', value: '120+' },
                { icon: <Lightbulb className="w-8 h-8" />, label: 'Lives Saved', value: '50,000+' },
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-6 backdrop-blur-md text-center"
                >
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-red-500/20 to-red-500/5 flex items-center justify-center text-red-400 mb-4 mx-auto">
                    {stat.icon}
                  </div>
                  <p className="text-2xl font-bold text-red-400 mb-1">{stat.value}</p>
                  <p className="text-sm text-slate-400">{stat.label}</p>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Values Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-bold mb-4">Our Core Values</h2>
            <p className="text-lg text-slate-400">What drives us forward</p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ staggerChildren: 0.1 }}
            className="grid md:grid-cols-4 gap-6"
          >
            {[
              { title: 'Compassion', desc: 'Every decision centered on saving lives' },
              { title: 'Innovation', desc: 'Leveraging AI to solve complex problems' },
              { title: 'Reliability', desc: 'Enterprise-grade security and uptime' },
              { title: 'Collaboration', desc: 'Connecting all stakeholders seamlessly' },
            ].map((value, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6 }}
                className="rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/2 p-8 backdrop-blur-md text-center hover:border-red-500/50 transition"
              >
                <h3 className="text-2xl font-bold mb-3">{value.title}</h3>
                <p className="text-slate-400">{value.desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </section>

        {/* CTA Section */}
        <section className="relative z-10 max-w-7xl mx-auto px-6 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="rounded-3xl border border-red-500/30 bg-gradient-to-r from-red-500/20 to-rose-500/10 backdrop-blur-md p-12 md:p-20 text-center"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">Join Our Mission</h2>
            <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
              Be part of a movement to transform blood management and save millions of lives.
            </p>
            <motion.button
              whileHover={{ scale: 1.05, boxShadow: '0 0 30px rgba(239, 68, 68, 0.4)' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.location.href = '/app/register'}
              className="px-8 py-4 bg-gradient-to-r from-red-600 to-red-500 rounded-full font-semibold text-white text-lg flex items-center justify-center gap-2 mx-auto hover:shadow-lg transition"
            >
              🚀 Get Started Today
              <ArrowRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </section>
      </div>
    </PageTransition>
  );
};

export default AboutPage;
