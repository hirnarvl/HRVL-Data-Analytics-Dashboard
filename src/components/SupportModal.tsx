import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  Mail, 
  Phone, 
  Copy, 
  Check, 
  Send, 
  ExternalLink, 
  HelpCircle, 
  ShieldCheck, 
  Building2,
  Sparkles
} from 'lucide-react';
import { soundEngine } from '../utils/sound';
import { useAuth } from '../contexts/AuthContext';

interface SupportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SupportModal: React.FC<SupportModalProps> = ({ isOpen, onClose }) => {
  const { user } = useAuth();
  
  const defaultUserName = user?.displayName || user?.email?.split('@')[0] || '[User Name]';
  const [userName, setUserName] = useState(defaultUserName);
  const [timeframe, setTimeframe] = useState('2-4 hours');
  const [copiedSubject, setCopiedSubject] = useState(false);
  const [copiedBody, setCopiedBody] = useState(false);
  const [copiedAll, setCopiedAll] = useState(false);

  const contactEmail = 'henz@hirnarvl.onmicrosoft.com';
  const contactPhone = '+251-93331-0270';

  const subjectText = 'Support Request Received - HRVL Data Analytic Dashboard';

  const bodyText = `Hi ${userName},

Thank you for reaching out to the HRVL Data Analytic Dashboard support team! We have received your request and are here to help.

To help us resolve your issue as quickly as possible, please reply to this email with a few more details if you haven't already:
• A brief description of the issue you are experiencing or the question you have.
• The steps you took before encountering the issue (e.g., trying to import a CSV, viewing the Outbreak Map).
• Any relevant screenshots or error messages.

Our team will review your request and get back to you within ${timeframe}.

Thank you for using the HRVL Data Analytic Dashboard to power your geospatial disease surveillance and epidemiological data analysis.

Best regards,
The HRVL Data Analytics Team
${contactEmail} | ${contactPhone}`;

  const handleCopySubject = () => {
    soundEngine.playSuccess();
    navigator.clipboard.writeText(subjectText);
    setCopiedSubject(true);
    setTimeout(() => setCopiedSubject(false), 2000);
  };

  const handleCopyBody = () => {
    soundEngine.playSuccess();
    navigator.clipboard.writeText(bodyText);
    setCopiedBody(true);
    setTimeout(() => setCopiedBody(false), 2000);
  };

  const handleCopyAll = () => {
    soundEngine.playSuccess();
    const fullMessage = `Subject: ${subjectText}\n\n${bodyText}`;
    navigator.clipboard.writeText(fullMessage);
    setCopiedAll(true);
    setTimeout(() => setCopiedAll(false), 2000);
  };

  const mailtoUrl = `mailto:${contactEmail}?subject=${encodeURIComponent(subjectText)}&body=${encodeURIComponent(bodyText)}`;

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2, ease: [0.25, 1, 0.5, 1] }}
          className="relative w-full max-w-2xl my-8 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden text-slate-900 dark:text-slate-100"
        >
          {/* Modal Header */}
          <div className="bg-gradient-to-r from-slate-950 via-slate-900 to-indigo-950 px-6 py-4 border-b border-amber-500/30 flex items-center justify-between text-white">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-400/40 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
                <HelpCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-amber-400 tracking-tight flex items-center gap-2">
                  <span>Support Email Template</span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-mono border border-emerald-500/30 uppercase">
                    Official HRVL
                  </span>
                </h3>
                <p className="text-xs text-slate-300">
                  HRVL Data Analytic Dashboard Customer & Technical Support
                </p>
              </div>
            </div>

            <button
              onClick={() => {
                soundEngine.playClick();
                onClose();
              }}
              className="p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Content */}
          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
            
            {/* Direct Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Support Email</p>
                  <a 
                    href={`mailto:${contactEmail}`} 
                    className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 truncate block"
                  >
                    {contactEmail}
                  </a>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/80 flex items-center space-x-3">
                <div className="w-9 h-9 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <Phone className="w-4 h-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[10px] uppercase font-bold text-slate-400">Direct Phone Line</p>
                  <a 
                    href={`tel:${contactPhone.replace(/-/g, '')}`} 
                    className="text-xs font-mono font-bold text-slate-900 dark:text-slate-100 hover:text-emerald-600 dark:hover:text-emerald-400 truncate block"
                  >
                    {contactPhone}
                  </a>
                </div>
              </div>
            </div>

            {/* Template Variables Customizer */}
            <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800/50 p-4 rounded-xl space-y-3">
              <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 dark:text-amber-300">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>Customize Template Fields</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Recipient Name [User Name]
                  </label>
                  <input
                    type="text"
                    value={userName}
                    onChange={(e) => setUserName(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., Dr. Abebe / Field Epidemiologist"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Target Timeframe
                  </label>
                  <input
                    type="text"
                    value={timeframe}
                    onChange={(e) => setTimeframe(e.target.value)}
                    className="w-full text-xs px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500"
                    placeholder="e.g., 2-4 hours"
                  />
                </div>
              </div>
            </div>

            {/* Email Subject Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Subject Line
                </label>
                <button
                  onClick={handleCopySubject}
                  className="inline-flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-semibold"
                >
                  {copiedSubject ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedSubject ? 'Copied!' : 'Copy Subject'}</span>
                </button>
              </div>
              <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 font-mono text-xs text-slate-800 dark:text-slate-200 font-bold select-all">
                {subjectText}
              </div>
            </div>

            {/* Email Body Section */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Email Body Template
                </label>
                <button
                  onClick={handleCopyBody}
                  className="inline-flex items-center space-x-1 text-xs text-amber-600 dark:text-amber-400 hover:underline cursor-pointer font-semibold"
                >
                  {copiedBody ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedBody ? 'Copied!' : 'Copy Body'}</span>
                </button>
              </div>
              <textarea
                readOnly
                rows={12}
                value={bodyText}
                className="w-full p-3 bg-slate-50 dark:bg-slate-800/80 rounded-xl border border-slate-200 dark:border-slate-700 font-mono text-xs leading-relaxed text-slate-800 dark:text-slate-200 focus:outline-none select-all"
              />
            </div>

          </div>

          {/* Modal Footer Actions */}
          <div className="px-6 py-4 bg-slate-50 dark:bg-slate-900/90 border-t border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center space-x-2">
              <a
                href="https://t.me/ADNIS_Focal02EndUSERS2HRVL"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center space-x-1.5 px-3 py-2 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-xs cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Open Telegram Channel</span>
                <ExternalLink className="w-3 h-3 opacity-70" />
              </a>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={handleCopyAll}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 text-xs font-bold rounded-xl transition-colors cursor-pointer"
              >
                {copiedAll ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                <span>{copiedAll ? 'Entire Template Copied!' : 'Copy Full Template'}</span>
              </button>

              <a
                href={mailtoUrl}
                onClick={() => soundEngine.playSuccess()}
                className="inline-flex items-center space-x-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-md transition-colors cursor-pointer"
              >
                <Mail className="w-4 h-4" />
                <span>Open Mail Client</span>
              </a>
            </div>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
