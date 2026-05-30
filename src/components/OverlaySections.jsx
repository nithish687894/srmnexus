import React from 'react';
import { motion } from 'framer-motion';
import CTAButton from './CTAButton';
import { Sparkles, Calendar, Award, CheckSquare, Bell, User, Clock, MessageSquare } from 'lucide-react';

const OverlaySections = () => {
  // Animation presets for consistency
  const textVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
    }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1
      }
    }
  };

  return (
    <div className="w-screen text-slate-100 selection:bg-cyber-cyan/30 select-none">
      
      {/* ==========================================
          SCENE 1: HERO / INTRO
          ========================================== */}
      <section className="h-screen w-screen flex flex-col justify-center relative px-6 md:px-24 max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-10%" }}
          variants={staggerContainer}
          className="flex flex-col items-start gap-4 z-10"
        >
          {/* Futuristic Badge */}
          <motion.div 
            variants={textVariants}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonCyan/40 bg-cyber-cyan/5 text-cyber-neonCyan text-xs font-semibold uppercase tracking-widest shadow-cyan-glow/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonCyan animate-ping" />
            System Launch • SRM Nexus OS
          </motion.div>

          {/* Heading */}
          <motion.h1 
            variants={textVariants}
            className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none mt-2"
          >
            Your student life, <br />
            <span className="bg-gradient-to-r from-cyber-neonCyan via-cyber-indigo to-cyber-neonViolet bg-clip-text text-transparent glow-text-cyan">
              organized intelligently.
            </span>
          </motion.h1>

          {/* Subheading */}
          <motion.p 
            variants={textVariants}
            className="text-sm md:text-lg text-slate-400 max-w-xl font-normal leading-relaxed mt-2"
          >
            SRM Nexus is a futuristic, AI-powered student command center that aggregates attendance, grades, schedules, exams, and tasks into one beautiful WebGL cockpit.
          </motion.p>

          {/* Action Buttons */}
          <motion.div 
            variants={textVariants}
            className="flex flex-wrap gap-4 mt-6"
          >
            <CTAButton variant="primary" onClick={() => alert('Launching demo portal...')}>
              Launch Dashboard <Sparkles size={14} className="animate-pulse" />
            </CTAButton>
            <CTAButton variant="secondary" onClick={() => window.scrollTo({ top: window.innerHeight, behavior: 'smooth' })}>
              Explore Features
            </CTAButton>
          </motion.div>
        </motion.div>

        {/* Animated Mouse Scroll Indicator at bottom */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.65, y: [0, 8, 0] }}
          transition={{ repeat: Infinity, duration: 2 }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-1.5 text-[10px] text-slate-500 font-semibold tracking-widest uppercase"
        >
          <div className="w-5 h-9 rounded-full border-2 border-slate-600 flex justify-center p-1.5">
            <span className="w-1 h-2 bg-cyber-neonCyan rounded-full animate-bounce" />
          </div>
          Scroll Down to Begin
        </motion.div>
      </section>


      {/* ==========================================
          SCENE 2: STUDENT CHAOS
          ========================================== */}
      <section className="h-screen w-screen flex flex-col justify-center relative px-6 md:px-24 max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-10%" }}
          variants={staggerContainer}
          className="flex flex-col items-start gap-4 md:max-w-xl z-10"
        >
          <motion.div 
            variants={textVariants}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-red-500/40 bg-red-950/20 text-red-400 text-xs font-semibold uppercase tracking-widest"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Scene 02 • The Disarray
          </motion.div>

          <motion.h2 
            variants={textVariants}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            Chasing updates across <br />
            <span className="text-red-400 glow-text-red">screenshots and portals.</span>
          </motion.h2>

          <motion.p 
            variants={textVariants}
            className="text-sm md:text-base text-slate-400 leading-relaxed"
          >
            Sluggish administration logins, messy WhatsApp timetable forwards, chaotic sheets, and scattered scribbles. Every semester starts organized and devolves into absolute chaos.
          </motion.p>

          <motion.div 
            variants={textVariants}
            className="grid grid-cols-2 gap-3.5 mt-3 w-full"
          >
            <div className="p-3.5 rounded-xl border border-red-500/10 bg-red-950/10 backdrop-blur-sm text-[11px] text-red-200">
              🚨 <strong>7 Missed Alerts</strong>: Blocked registrations.
            </div>
            <div className="p-3.5 rounded-xl border border-amber-500/10 bg-amber-950/10 backdrop-blur-sm text-[11px] text-amber-200">
              📊 <strong>Lost screenshots</strong>: Where is the room map?
            </div>
          </motion.div>
        </motion.div>
      </section>


      {/* ==========================================
          SCENE 3: SRM NEXUS SOLUTION
          ========================================== */}
      <section className="h-screen w-screen flex flex-col justify-center relative px-6 md:px-24 max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-10%" }}
          variants={staggerContainer}
          className="flex flex-col items-start gap-4 md:max-w-xl z-10 md:ml-auto"
        >
          <motion.div 
            variants={textVariants}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonCyan/40 bg-cyber-cyan/5 text-cyber-neonCyan text-xs font-semibold uppercase tracking-widest shadow-cyan-glow/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonCyan" />
            Scene 03 • The Solution
          </motion.div>

          <motion.h2 
            variants={textVariants}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            One single, clean <br />
            <span className="bg-gradient-to-r from-cyber-neonCyan to-cyber-neonViolet bg-clip-text text-transparent glow-text-cyan">
              Student Operating System.
            </span>
          </motion.h2>

          <motion.p 
            variants={textVariants}
            className="text-sm md:text-base text-slate-400 leading-relaxed"
          >
            SRM Nexus connects all active portal APIs, WhatsApp chat databases, and PDF syllabus updates. It automatically filters out the noise and presents your student life in one clean, holographic control panel.
          </motion.p>
        </motion.div>
      </section>


      {/* ==========================================
          SCENE 4: FEATURES ORBIT
          ========================================== */}
      <section className="h-screen w-screen flex flex-col justify-center relative px-6 md:px-24 max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-10%" }}
          variants={staggerContainer}
          className="flex flex-col items-start gap-3 z-10"
        >
          <motion.div 
            variants={textVariants}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonViolet/40 bg-cyber-violet/5 text-cyber-neonViolet text-xs font-semibold uppercase tracking-widest shadow-violet-glow/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonViolet" />
            Scene 04 • Features Showcase
          </motion.div>

          <motion.h2 
            variants={textVariants}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            Aggregated intelligence <br />
            <span className="text-white">designed to help you pass.</span>
          </motion.h2>

          <motion.p 
            variants={textVariants}
            className="text-sm md:text-base text-slate-400 max-w-xl mb-2"
          >
            Watch the dashboard cards animate inside the 3D cockpit. The UI tracks, forecasts, and schedules your work automatically:
          </motion.p>

          {/* Bullet cards grid */}
          <motion.div 
            variants={textVariants}
            className="grid grid-cols-1 md:grid-cols-2 gap-3.5 w-full max-w-3xl"
          >
            <div className="p-4 rounded-xl border border-white/5 bg-cyber-glass hover:bg-cyber-glassHover backdrop-blur-cyber transition-all duration-300 flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-cyber-cyan/15 text-cyber-neonCyan"><Clock size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Attendance Forecaster</h4>
                <p className="text-[10px] text-slate-400 mt-1">Forecasts your target attendance. Alerts you precisely on how many classes can be safely skipped.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-cyber-glass hover:bg-cyber-glassHover backdrop-blur-cyber transition-all duration-300 flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-cyber-violet/15 text-cyber-neonViolet"><Award size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Marks & GPA Analytics</h4>
                <p className="text-[10px] text-slate-400 mt-1">Aggregates internal scores, computes SGPA, and draws visual progress vectors towards your GPA goal.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-cyber-glass hover:bg-cyber-glassHover backdrop-blur-cyber transition-all duration-300 flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-cyber-cyan/15 text-cyber-neonCyan"><Calendar size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Timetable & Locations</h4>
                <p className="text-[10px] text-slate-400 mt-1">Syncs lectures, practical labs, exam halls, and provides interactive room navigations.</p>
              </div>
            </div>
            <div className="p-4 rounded-xl border border-white/5 bg-cyber-glass hover:bg-cyber-glassHover backdrop-blur-cyber transition-all duration-300 flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-cyber-violet/15 text-cyber-neonViolet"><Bell size={16} /></div>
              <div>
                <h4 className="text-xs font-bold text-white uppercase tracking-wider">Proactive Reminders</h4>
                <p className="text-[10px] text-slate-400 mt-1">Smart notification systems that wake up ahead of slot changes, exam papers, or fees deadlines.</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>


      {/* ==========================================
          SCENE 5: AI ASSISTANT ZOOM
          ========================================== */}
      <section className="h-screen w-screen flex flex-col justify-center relative px-6 md:px-24 max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-10%" }}
          variants={staggerContainer}
          className="flex flex-col items-start gap-4 md:max-w-xl z-10 md:ml-auto"
        >
          <motion.div 
            variants={textVariants}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonViolet/40 bg-cyber-violet/5 text-cyber-neonViolet text-xs font-semibold uppercase tracking-widest shadow-violet-glow/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonViolet animate-pulse" />
            Scene 05 • AI Academic Co-Pilot
          </motion.div>

          <motion.h2 
            variants={textVariants}
            className="text-3xl md:text-5xl font-extrabold tracking-tight"
          >
            Deep AI assistance. <br />
            <span className="bg-gradient-to-r from-cyber-neonCyan to-cyber-neonViolet bg-clip-text text-transparent glow-text-cyan">
              Zero manual searching.
            </span>
          </motion.h2>

          <motion.p 
            variants={textVariants}
            className="text-sm md:text-base text-slate-400 leading-relaxed"
          >
            Instead of searching through files or asking friends, converse with Nexus AI directly in your cockpit. The co-pilot computes details instantly by analyzing class databases, exam calendars, and syllabi.
          </motion.p>
          
          <motion.div
            variants={textVariants}
            className="flex gap-2.5 items-center p-3 rounded-xl border border-cyber-neonViolet/20 bg-cyber-violet/5 text-[10px] text-purple-200 mt-2"
          >
            <div className="p-1 rounded bg-cyber-violet/30 text-cyber-neonViolet"><MessageSquare size={12} /></div>
            <span>Try interacting with the live chat portal inside the 3D dashboard card!</span>
          </motion.div>
        </motion.div>
      </section>


      {/* ==========================================
          SCENE 6: FINAL COMMAND CENTER
          ========================================== */}
      <section className="h-screen w-screen flex flex-col justify-center relative px-6 md:px-24 max-w-6xl mx-auto">
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: false, margin: "-10%" }}
          variants={staggerContainer}
          className="flex flex-col items-center text-center gap-5 z-10 max-w-3xl mx-auto"
        >
          <motion.div 
            variants={textVariants}
            className="flex items-center gap-2 px-3 py-1 rounded-full border border-cyber-neonCyan/40 bg-cyber-cyan/5 text-cyber-neonCyan text-xs font-semibold uppercase tracking-widest shadow-cyan-glow/10"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-cyber-neonCyan" />
            The Ultimate Student OS
          </motion.div>

          <motion.h2 
            variants={textVariants}
            className="text-4xl md:text-7xl font-extrabold tracking-tight leading-none"
          >
            Take back control of <br />
            <span className="bg-gradient-to-r from-cyber-neonCyan via-cyber-indigo to-cyber-neonViolet bg-clip-text text-transparent glow-text-cyan">
              your student life.
            </span>
          </motion.h2>

          <motion.p 
            variants={textVariants}
            className="text-sm md:text-lg text-slate-400 leading-relaxed max-w-xl"
          >
            Stop wasting hours checking tabs, searching messages, or stressing about debarment. Launch SRM Nexus today and manage college intelligently.
          </motion.p>

          <motion.div 
            variants={textVariants}
            className="flex flex-wrap justify-center gap-4 mt-4"
          >
            <CTAButton variant="primary" onClick={() => alert('Initializing account setup...')}>
              Try SRM Nexus Free
            </CTAButton>
            <CTAButton variant="secondary" onClick={() => alert('Opening visual dashboard mockup...')}>
              View Live Demo
            </CTAButton>
          </motion.div>
        </motion.div>
        
        {/* Footer Credit lines */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row justify-between text-[9px] text-slate-600 font-semibold uppercase tracking-widest">
          <span>© 2026 SRM Nexus Portal • Procedural WebGL experience</span>
          <span>Crafted by Antigravity AI • Pair Programming</span>
        </div>
      </section>
      
    </div>
  );
};

export default OverlaySections;
