import React from 'react';
import { motion } from 'motion/react';
import { 
  ShieldCheck, 
  Send, 
  Mail, 
  Phone, 
  MapPin, 
  Sparkles,
  ExternalLink,
  Lock,
  CheckCircle2,
  Globe
} from 'lucide-react';

interface FooterBannerProps {
  onOpenExternalResources?: () => void;
}

export const FooterBanner: React.FC<FooterBannerProps> = ({ onOpenExternalResources }) => {
  // Staggered variants for Developer Contact block
  const contactContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1
      }
    }
  };

  const lineVariants = {
    hidden: { opacity: 0, y: 5 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { 
        duration: 0.2, 
        ease: 'easeOut'
      }
    }
  };

  return (
    <motion.footer 
      initial={{ y: 25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.28, ease: 'easeOut' }}
      className="w-full mt-12 bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 border-t-2 border-amber-500/40 text-slate-100 shadow-2xl relative overflow-hidden transition-all duration-300"
    >
      {/* Background ambient glow pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(212,175,55,0.08),transparent_40%),radial-gradient(circle_at_80%_100%,rgba(59,130,246,0.08),transparent_40%)] pointer-events-none" />
      
      {/* Top Metallic Gold Accent Bar */}
      <div className="h-0.5 w-full bg-gradient-to-r from-amber-600/20 via-amber-400 to-amber-600/20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 relative z-10 space-y-5">
        
        {/* UNIFIED DEVELOPER CONTACT & RESEARCH4LIFE ACCESS BLOCK */}
        <div className="bg-slate-900/90 backdrop-blur-md p-5 rounded-2xl border border-slate-800 shadow-xl">
          <motion.div 
            variants={contactContainerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Header Title */}
            <motion.div variants={lineVariants} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2 border-b border-slate-800/90">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-400 shrink-0" />
                <span>Developer Contact & Research4Life Portal Integration</span>
              </div>
              <div className="flex items-center space-x-1.5 bg-emerald-950/80 border border-emerald-500/40 px-3 py-1 rounded-full text-[11px] font-bold text-emerald-300 w-fit">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span>Active Research4Life Full access via HRVL</span>
              </div>
            </motion.div>

            {/* Main Content Row: Contact Info Grid + Portal Launcher Side-by-Side */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
              
              {/* Contact Information Fields (Col 8) */}
              <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Phone */}
                <motion.div variants={lineVariants} className="flex items-center space-x-2 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
                  <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                  <span className="font-mono text-slate-400 text-[11px]">Phone:</span>
                  <a href="tel:+251933310270" className="font-mono font-bold text-slate-200 hover:text-emerald-300 transition-colors">
                    +251-933-31-0270
                  </a>
                </motion.div>

                {/* Primary Email */}
                <motion.div variants={lineVariants} className="flex items-center space-x-2 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
                  <Mail className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-mono text-slate-400 text-[11px]">Email:</span>
                  <a href="mailto:henz@hirnarvl.onmicrosoft.com" className="font-mono font-medium text-slate-200 hover:text-amber-300 transition-colors truncate">
                    henz@hirnarvl.onmicrosoft.com
                  </a>
                </motion.div>

                {/* Dev Email */}
                <motion.div variants={lineVariants} className="flex items-center space-x-2 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
                  <Mail className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-mono text-slate-400 text-[11px]">Dev Email:</span>
                  <a href="mailto:clexhena@gmail.com" className="font-mono font-medium text-slate-200 hover:text-sky-300 transition-colors truncate">
                    clexhena@gmail.com
                  </a>
                </motion.div>

                {/* Telegram */}
                <motion.div variants={lineVariants} className="flex items-center space-x-2 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
                  <Send className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                  <span className="font-mono text-slate-400 text-[11px]">Telegram:</span>
                  <a 
                    href="https://t.me/ADNIS_Focal02EndUSERS2HRVL" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="font-mono font-bold text-sky-400 hover:text-sky-300 transition-colors inline-flex items-center gap-1 truncate"
                  >
                    <span>@ADNIS_Focal02EndUSERS2HRVL</span>
                    <ExternalLink className="w-2.5 h-2.5 shrink-0" />
                  </a>
                </motion.div>

                {/* Location */}
                <motion.div variants={lineVariants} className="sm:col-span-2 flex items-center space-x-2 bg-slate-950/70 px-3 py-2 rounded-xl border border-slate-800">
                  <MapPin className="w-3.5 h-3.5 text-rose-400 shrink-0" />
                  <span className="font-mono text-slate-400 text-[11px]">Location:</span>
                  <span className="font-semibold text-slate-200 tracking-wide">HIRNA, WEST HARARGHE, ETHIOPIA</span>
                </motion.div>
              </div>

              {/* Research4Life Direct Portal Launchers (Col 4) */}
              <div className="lg:col-span-4 flex flex-col justify-center space-y-2 bg-slate-950/60 p-3 rounded-xl border border-rose-500/30">
                <a
                  href="/api/r4l-login"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full inline-flex items-center justify-center space-x-2 px-4 py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer group"
                >
                  <Lock className="w-3.5 h-3.5 text-rose-200" />
                  <span>Launch Research4Life Securely</span>
                  <ExternalLink className="w-3.5 h-3.5 group-hover:translate-x-0.5 transition-transform" />
                </a>

                {onOpenExternalResources && (
                  <button
                    onClick={onOpenExternalResources}
                    className="w-full inline-flex items-center justify-center space-x-2 px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-lg text-[11px] font-semibold transition-colors cursor-pointer"
                  >
                    <Globe className="w-3 h-3 text-indigo-400" />
                    <span>View All Open Access Portals</span>
                  </button>
                )}
              </div>

            </div>
          </motion.div>
        </div>

        {/* DATA CONFIDENTIALITY & LEGAL DISCLAIMER DECLARATION BLOCK */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2, delay: 0.2, ease: "easeOut" }}
          className="pt-1 text-center"
        >
          <div className="flex items-start justify-center space-x-2 max-w-5xl mx-auto bg-slate-950/60 p-3.5 rounded-xl border border-slate-800/90">
            <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <p className="text-[11px] text-slate-400 leading-relaxed font-sans text-center">
              <strong className="text-amber-300">DATA CONFIDENTIALITY & LEGAL DISCLAIMER:</strong> This epizootiological surveillance platform is operated by the Hirna Regional Veterinary Laboratory (HRVL) for official livestock disease reporting and diagnostic monitoring across Oromia Region. All surveillance records, sample logs, and outbreak alerts contained herein are confidential under national animal health guidelines. Unauthorized distribution, commercial exploitation, or unverified public dissemination is strictly prohibited.
            </p>
          </div>
        </motion.div>

      </div>
    </motion.footer>
  );
};

