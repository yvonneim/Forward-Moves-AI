import React, { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  TrendingUp, 
  AlertCircle, 
  Lightbulb, 
  Shield,
  CheckCircle,
  ArrowRight,
  Loader2,
  X,
  Plus,
  Minus,
  ExternalLink,
  ChevronRight,
  LayoutDashboard,
  Table as TableIcon,
  BookOpen,
  Compass,
  Users,
  Award,
  Sparkles,
  Cpu,
  Globe,
  FlaskConical,
  UserCheck,
  Scale,
  Eye,
  Quote
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, SWOTAnalysis, ResumeMatch, InterviewPrep, CoverLetter, RevisedResume } from './types';
import { searchJobs, generateSWOT } from './services/jobService';
import { matchResumeToJob, reviseResume } from './services/resumeService';
import { generateInterviewPrep, generateCoverLetter, getInterviewFeedback } from './services/applicationService';
import Markdown from 'react-markdown';
import { 
  FileText,
  CheckCircle2,
  XCircle,
  Zap,
  ArrowLeft,
  MessageSquare,
  PenTool,
  Copy,
  Check,
  Send,
  Mail
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from 'recharts';

const LandingSection = () => (
  <div className="relative min-h-[450px] flex items-center justify-center rounded-[3rem] overflow-hidden mb-12 bg-white">
    <div className="absolute inset-0">
      <img 
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
        alt="Happy Career Success" 
        className="w-full h-full object-cover opacity-[0.08] scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.05),transparent_70%)]" />
    </div>
    
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="relative z-10 p-8 md:p-12 max-w-5xl text-center"
    >
      <div className="flex flex-col items-center gap-4 mb-8">
        <span className="inline-block px-5 py-1.5 bg-slate-50 text-slate-400 text-[9px] font-bold uppercase tracking-[0.5em] rounded-full border border-slate-100">
          Forward Moves USA
        </span>
      </div>
      
      <h2 className="text-5xl md:text-7xl font-bold text-slate-900 mb-8 leading-[0.9] tracking-tighter">
        Step Into Your <br />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-fm-blue to-fm-violet">
          AI-Driven Future.
        </span>
      </h2>
      
      <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto leading-relaxed font-light">
        Your bridge to a more fulfilling career. We connect your unique 
        talents to the most exciting opportunities in the AI-driven workforce.
      </p>
    </motion.div>
  </div>
);

const QuickStartGuide = ({ onStart, onSetTab, onSetView }: { onStart: () => void; onSetTab: (tab: 'start' | 'discover' | 'labs' | 'insights' | 'reskilling') => void; onSetView: (view: any) => void }) => (
  <div className="mb-20">
    <div className="flex flex-col items-center text-center mb-16">
      <div className="w-20 h-20 bg-fm-blue rounded-[2rem] flex items-center justify-center text-white shadow-2xl shadow-fm-blue/10 mb-8">
        <Compass size={32} />
      </div>
      <h2 className="text-5xl font-bold text-slate-900 tracking-tighter mb-4">Explore What's Inside</h2>
      <p className="text-slate-400 text-xl max-w-2xl font-light leading-relaxed">Your gateway to the AI-driven workforce. Select a path to begin your journey.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
      {[
        {
          title: "Reskilling Portal",
          desc: "Access curated learning modules and technical reskilling programs to master AI skills.",
          icon: <BookOpen className="text-slate-900" size={28} />,
          onClick: () => onSetTab('reskilling'),
          color: "bg-fm-violet/5"
        },
        {
          title: "Career Discovery",
          desc: "Find AI-related roles and mission-driven companies looking for your unique talents.",
          icon: <Search className="text-slate-900" size={28} />,
          onClick: () => onSetTab('discover'),
          color: "bg-fm-blue/5"
        },
        {
          title: "Resume Prep",
          desc: "Prepare your profile for the AI frontier. Get matched with roles that fit your skills.",
          icon: <FileText className="text-slate-900" size={28} />,
          onClick: onStart,
          color: "bg-fm-orange/5"
        }
      ].map((item, idx) => (
        <motion.div 
          key={idx}
          whileHover={{ y: -10 }}
          className={`group relative ${item.color} p-12 rounded-[3.5rem] border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-fm-blue/5 hover:bg-blue-50 hover:border-blue-100 transition-all duration-500 cursor-pointer text-center flex flex-col items-center`}
          onClick={item.onClick}
        >
          <div className="w-20 h-20 bg-white rounded-3xl flex items-center justify-center mb-8 group-hover:bg-fm-blue group-hover:text-white transition-all duration-500 shadow-sm">
            {item.icon}
          </div>
          <h3 className="text-2xl font-bold text-slate-900 mb-4">{item.title}</h3>
          <p className="text-slate-500 leading-relaxed">{item.desc}</p>
          
          <div className="mt-8 flex items-center gap-2 text-fm-violet font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
            Enter Portal <ArrowRight size={14} />
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);



const ResumeSetup = ({ onSet, currentResume }: { onSet: (text: string) => void; currentResume: string }) => {
  const [text, setText] = useState(currentResume);
  const [isEditing, setIsEditing] = useState(!currentResume);
  const [agreedToPrivacy, setAgreedToPrivacy] = useState(false);
  
  if (!isEditing && currentResume) {
    return (
      <div className="glass-panel p-8 bg-emerald-50 border-emerald-100 shadow-lg mb-16 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-6">
          <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center text-white shadow-lg">
            <CheckCircle size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-serif font-bold text-slate-900">Resume Active</h2>
            <p className="text-slate-500">Your baseline is set. You can now match against any job listing in the "Discover" tab.</p>
          </div>
        </div>
        <button 
          onClick={() => setIsEditing(true)}
          className="px-6 py-3 bg-white text-emerald-600 border border-emerald-200 rounded-xl font-bold text-sm hover:bg-emerald-100 transition-all flex items-center gap-2 shadow-sm"
        >
          <FileText size={18} />
          Update Resume
        </button>
      </div>
    );
  }

  return (
    <div id="resume-upload-section" className="glass-panel p-10 bg-gradient-to-br from-fm-blue/5 to-fm-violet/5 border-fm-blue/20 shadow-2xl mb-16 relative overflow-hidden scroll-mt-24">
      <div className="absolute top-0 right-0 p-4">
        <div className="w-24 h-24 bg-fm-blue/10 rounded-full blur-3xl" />
      </div>
      
      <div className="relative z-10">
        <div className="flex items-center gap-4 mb-8">
          <div className="w-14 h-14 bg-fm-blue rounded-2xl flex items-center justify-center text-white shadow-lg">
            <FileText size={28} />
          </div>
          <div>
            <h2 className="text-3xl font-serif font-bold text-slate-900">Step 1: Set Your Baseline</h2>
            <p className="text-slate-500">Upload your current resume text to unlock personalized matching and analysis.</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
              <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Shield className="text-fm-blue" size={20} />
                Privacy Checklist
              </h3>
              <p className="text-sm text-slate-500 mb-6">Before pasting, please ensure you have removed the following for maximum privacy:</p>
              
              <ul className="space-y-3">
                {[
                  "Full Name & Phone Number",
                  "Home Address & Zip Code",
                  "Personal Email Address",
                  "Links to private social media"
                ].map((item, i) => (
                  <li key={i} className="flex items-center gap-3 text-sm text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600">
                      <CheckCircle size={14} />
                    </div>
                    {item}
                  </li>
                ))}
              </ul>

              <div className="mt-8 pt-6 border-t border-slate-100">
                <label htmlFor="privacy-agreement" className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    id="privacy-agreement"
                    type="checkbox" 
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-fm-blue focus:ring-fm-blue transition-all"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-fm-blue transition-colors">
                    I have anonymized my resume text
                  </span>
                </label>
              </div>
            </div>

              <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <div className="space-y-2">
                <p className="text-xs text-amber-800 leading-relaxed">
                  <strong>Why anonymize?</strong> AI analysis works best when focusing on skills and experience. Removing PII keeps your data safe while providing the same high-quality results.
                </p>
                <p className="text-[10px] text-amber-700 italic leading-relaxed">
                  Note: AI-generated content (resumes, letters, tips) should be reviewed for accuracy. This tool is a prototype for community testing.
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Resume Text Content
              </label>
              <textarea
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Paste your experience, skills, and education here..."
                className="w-full h-80 p-6 rounded-2xl border-2 border-slate-200 focus:border-fm-blue focus:ring-0 transition-all resize-none font-sans text-slate-700 bg-white shadow-inner"
              />
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => {
                  onSet(text);
                  setIsEditing(false);
                }}
                disabled={!text.trim() || !agreedToPrivacy}
                className="flex-1 py-4 bg-fm-blue text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-xl shadow-fm-blue/20"
              >
                <CheckCircle size={24} />
                Save & Start Discovering
              </button>
              {currentResume && (
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-blue-50 hover:text-fm-blue transition-all"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const SkillGapAnalyzer = ({ resumeText, jobs }: { resumeText: string; jobs: Job[] }) => {
  const COMMON_AI_SKILLS = [
    'Python', 'Machine Learning', 'NLP', 'LLMs', 'Prompt Engineering',
    'PyTorch', 'TensorFlow', 'Data Science', 'AI Ethics', 'Generative AI',
    'Computer Vision', 'Deep Learning', 'SQL', 'AWS', 'Azure', 'Google Cloud'
  ];

  const skillStats = useMemo(() => {
    const stats: Record<string, { count: number; inResume: boolean }> = {};
    
    COMMON_AI_SKILLS.forEach(skill => {
      const regex = new RegExp(`\\b${skill}\\b`, 'gi');
      let count = 0;
      jobs.forEach(job => {
        if (regex.test(job.description) || regex.test(job.title)) {
          count++;
        }
      });
      
      const inResume = resumeText ? regex.test(resumeText) : false;
      
      if (count > 0) {
        stats[skill] = { count, inResume };
      }
    });

    return Object.entries(stats)
      .map(([name, data]) => ({ name, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 8);
  }, [jobs, resumeText]);

  if (jobs.length === 0) return null;

  return (
    <div className="glass-panel p-10 bg-white border-slate-200 shadow-xl mb-20">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3 mb-2">
            <Cpu className="text-fm-blue" size={28} />
            Personalized Skill Gap Analysis
          </h2>
          <p className="text-slate-500">How your profile aligns with current market demands.</p>
        </div>
        {!resumeText && (
          <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-center gap-3">
            <AlertCircle className="text-amber-600" size={18} />
            <p className="text-xs text-amber-800 font-medium">Upload your resume in the "Setup" tab for a personalized analysis.</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <h3 className="text-sm font-bold uppercase tracking-widest text-slate-400">Top Skills in Current Market</h3>
          <div className="space-y-4">
            {skillStats.map((skill, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between items-center text-sm">
                  <span className="font-bold text-slate-700">{skill.name}</span>
                  <span className="text-slate-400">{Math.round((skill.count / jobs.length) * 100)}% of jobs</span>
                </div>
                <div className="h-2 bg-slate-100 rounded-full overflow-hidden flex">
                  <div 
                    className={`h-full transition-all duration-1000 ${skill.inResume ? 'bg-emerald-500' : 'bg-fm-blue'}`}
                    style={{ width: `${(skill.count / jobs.length) * 100}%` }}
                  />
                </div>
                {resumeText && (
                  <div className="flex items-center gap-2">
                    {skill.inResume ? (
                      <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1 uppercase tracking-widest">
                        <CheckCircle size={10} /> Found in your resume
                      </span>
                    ) : (
                      <span className="text-[10px] font-bold text-fm-violet flex items-center gap-1 uppercase tracking-widest">
                        <AlertCircle size={10} /> Missing from your resume
                      </span>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-slate-50 rounded-3xl p-8 border border-slate-100 flex flex-col justify-center">
          <div className="text-center space-y-6">
            <div className="w-20 h-20 bg-fm-blue/10 rounded-full flex items-center justify-center mx-auto text-fm-blue mb-4">
              <TrendingUp size={40} />
            </div>
            <h3 className="text-2xl font-serif font-bold text-slate-900">Strategic Insight</h3>
            <p className="text-slate-600 leading-relaxed">
              {resumeText ? (
                <>
                  Based on your profile, you are strong in <strong>{skillStats.filter(s => s.inResume).length}</strong> of the top 8 market skills. 
                  Focusing on <strong>{skillStats.find(s => !s.inResume)?.name || 'advanced AI integration'}</strong> could increase your match rate by up to 25%.
                </>
              ) : (
                "The current market is heavily prioritizing LLM integration and Prompt Engineering. 80% of new roles this week mention these skills specifically."
              )}
            </p>
            
            {resumeText && skillStats.some(s => !s.inResume) && (
              <div className="mt-6 p-4 bg-fm-blue/5 rounded-2xl border border-fm-blue/10 text-left">
                <h4 className="text-[10px] font-bold uppercase tracking-widest text-fm-blue mb-2">Recommended Learning Path</h4>
                <ul className="space-y-2">
                  {skillStats.filter(s => !s.inResume).slice(0, 2).map((skill, i) => (
                    <li key={i} className="flex items-center gap-2 text-xs text-slate-600">
                      <div className="w-1.5 h-1.5 rounded-full bg-fm-blue" />
                      Master {skill.name} fundamentals
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <button 
              onClick={() => {
                const el = document.getElementById('resume-upload-section');
                if (el) el.scrollIntoView({ behavior: 'smooth' });
                else window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-fm-blue hover:bg-blue-50 hover:border-blue-200 transition-all shadow-sm"
            >
              {resumeText ? 'Update Resume' : 'Upload Resume to Compare'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MarketTrendTracker = ({ jobs }: { jobs: Job[] }) => {
  const locationStats = useMemo(() => {
    const stats: Record<string, number> = {};
    jobs.forEach(job => {
      const city = job.location.split(',')[0].trim();
      stats[city] = (stats[city] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [jobs]);

  if (jobs.length === 0) return null;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-20">
      <div className="lg:col-span-2 glass-panel p-8 bg-white border-slate-200 shadow-lg">
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
            <Globe className="text-fm-blue" size={24} />
            Geographic Hotspots
          </h2>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Top Hiring Cities</span>
        </div>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={locationStats} layout="vertical" margin={{ left: 40, right: 40 }}>
              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
              <XAxis type="number" hide />
              <YAxis 
                dataKey="name" 
                type="category" 
                axisLine={false} 
                tickLine={false}
                tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }}
              />
              <Tooltip 
                cursor={{ fill: '#f8fafc' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
              />
              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={24}>
                {locationStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#1e40af' : '#60a5fa'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-panel p-8 bg-fm-blue text-white border-none shadow-xl flex flex-col justify-between">
        <div>
          <h3 className="text-xl font-serif font-bold mb-4">Market Velocity</h3>
          <p className="text-blue-200 text-sm leading-relaxed mb-8">
            AI roles are closing 40% faster than traditional tech roles. The average "time-to-hire" for a Prompt Architect is currently 14 days.
          </p>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Growth Rate</span>
              <span className="text-lg font-bold text-emerald-400">+12% MoM</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/10">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-300">Remote Friendly</span>
              <span className="text-lg font-bold">65%</span>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-white/10">
          <p className="text-[10px] font-bold uppercase tracking-widest text-blue-400 mb-2">Top Industry</p>
          <p className="text-lg font-bold">FinTech & Healthcare</p>
        </div>
      </div>
    </div>
  );
};

const LabPhilosophy = () => (
  <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20 items-center">
    <div className="relative">
      <div className="aspect-video rounded-3xl overflow-hidden shadow-2xl border-8 border-white">
        <img 
          src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&q=80&w=2070" 
          alt="Learning AI" 
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
      </div>
      <div className="absolute -bottom-6 -right-6 glass-panel p-6 bg-fm-blue text-white max-w-xs shadow-xl rounded-2xl">
        <p className="text-sm font-medium italic">"Most scouts just do the work for you. We teach you the skills to lead."</p>
      </div>
    </div>
    
    <div className="space-y-8">
      <div>
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-6">The "Lab" Approach: <br /><span className="text-fm-blue italic">Skills for a Lifetime.</span></h2>
        <p className="text-lg text-slate-500 leading-relaxed">
          Our "Lab Tasks" are more than just prompts. They are designed to teach you 
          the fundamental logic of AI interaction. Instead of a black box that gives 
          you a result, we provide the tools and frameworks to help you understand 
          <em> why</em> certain strategies work.
        </p>
      </div>
      
      <div className="space-y-4">
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
            <Check size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Active Learning</h4>
            <p className="text-sm text-slate-500">You don't just get a resume; you learn how to prompt for one.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
            <Check size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Transferable Skills</h4>
            <p className="text-sm text-slate-500">The prompting logic you learn here applies to any AI tool in any industry.</p>
          </div>
        </div>
        <div className="flex gap-4 items-start">
          <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center flex-shrink-0 mt-1">
            <Check size={16} />
          </div>
          <div>
            <h4 className="font-bold text-slate-900">Empowered Transition</h4>
            <p className="text-sm text-slate-500">Move from "AI-curious" to "AI-fluent" through practical, hands-on tasks.</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const SuccessStories = () => (
  <div className="space-y-8 mb-16">
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-fm-violet/10 rounded-2xl flex items-center justify-center text-fm-violet">
          <Award size={24} />
        </div>
        <h2 className="text-3xl font-serif font-bold text-slate-900">AI Career Pitch Lab: <span className="italic text-fm-violet">Success Stories</span></h2>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Ideal Outputs from Gemini</span>
    </div>
    
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Step 1 */}
      <div className="glass-panel p-8 bg-white border-slate-200 shadow-md flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-fm-blue/10 rounded-xl flex items-center justify-center text-fm-blue font-bold">1</div>
          <h3 className="font-bold text-slate-900">The Structure</h3>
        </div>
        <div className="space-y-4 flex-1">
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-fm-violet mb-2">Evolution Narrative</h4>
            <p className="text-sm text-slate-600">Focuses on how a role has changed over 20 years and why AI is the natural "next tool".</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-fm-violet mb-2">Human + AI Partnership</h4>
            <p className="text-sm text-slate-600">Highlights tasks AI cannot do (empathy) vs. what it can do (data synthesis).</p>
          </div>
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-100">
            <h4 className="text-xs font-bold uppercase tracking-widest text-fm-violet mb-2">The Skills Bridge</h4>
            <p className="text-sm text-slate-600">Directly maps traditional skills to their AI counterparts (Prompt Engineering).</p>
          </div>
        </div>
      </div>

      {/* Step 2 */}
      <div className="glass-panel p-8 bg-white border-slate-200 shadow-md flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-fm-blue/10 rounded-xl flex items-center justify-center text-fm-blue font-bold">2</div>
          <h3 className="font-bold text-slate-900">The Hook</h3>
        </div>
        <div className="p-6 bg-indigo-50 rounded-2xl border border-indigo-100 italic text-indigo-900 leading-relaxed text-sm flex-1">
          "A surprising and powerful statistic for 2026 is that the demand for AI literacy in non-technical roles has surged by 70% year-over-year. Even more striking, 51% of all job postings requiring AI skills are now outside of IT and Computer Science. This means the 'AI Revolution' isn't just for coders—it's for everyone in the office."
        </div>
        <div className="mt-6 rounded-xl overflow-hidden h-32">
          <img 
            src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=2070" 
            alt="Data visualization" 
            className="w-full h-full object-cover opacity-60"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* Step 3 */}
      <div className="glass-panel p-8 bg-white border-slate-200 shadow-md flex flex-col">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-fm-blue/10 rounded-xl flex items-center justify-center text-fm-blue font-bold">3</div>
          <h3 className="font-bold text-slate-900">The Pitch</h3>
        </div>
        <div className="space-y-4 flex-1">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600 mb-2">Option 1: Inspiring</h4>
            <p className="text-sm text-emerald-900 line-clamp-3">"We’ve all heard the headlines about AI replacing jobs, but the data tells a much more exciting story..."</p>
          </div>
          <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-blue-600 mb-2">Option 2: Analytical</h4>
            <p className="text-sm text-blue-900 line-clamp-3">"As of 2026, the US labor market has reached a critical tipping point..."</p>
          </div>
          <div className="p-4 bg-amber-50 rounded-xl border border-amber-100">
            <h4 className="text-[10px] font-bold uppercase tracking-widest text-amber-600 mb-2">Option 3: Modern</h4>
            <p className="text-sm text-amber-900 line-clamp-3">"The 'AI Gap' is closing, and it’s closing in favor of the non-technical professional..."</p>
          </div>
        </div>
      </div>
    </div>
  </div>
);

const FutureOutlook = () => (
  <div className="space-y-12 mb-20">
    <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
      <div className="max-w-2xl">
        <span className="inline-block px-4 py-1.5 bg-fm-blue/10 text-fm-blue text-[10px] font-bold uppercase tracking-[0.3em] rounded-full mb-4">
          2026 Career Map
        </span>
        <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">Future-Proofing Your <span className="text-fm-violet italic">Next Decade.</span></h2>
        <p className="text-slate-500 text-lg">The landscape is shifting. Here are the roles, skills, and tools that will define the professional world in 2026 and beyond.</p>
      </div>
      <div className="flex items-center gap-2 text-fm-blue font-bold text-sm bg-fm-blue/5 px-4 py-2 rounded-xl border border-fm-blue/10">
        <Sparkles size={18} />
        Emerging Trends
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {/* Job Titles */}
      <div className="glass-panel p-8 bg-white border-slate-200 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Briefcase size={80} />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-fm-blue/10 rounded-2xl flex items-center justify-center text-fm-blue mb-6">
            <Briefcase size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">New Job Titles</h3>
          <ul className="space-y-4">
            {[
              { title: "AI Orchestrator", desc: "Managing multiple AI agents to complete complex workflows." },
              { title: "Prompt Architect", desc: "Designing advanced prompt systems for enterprise LLMs." },
              { title: "AI Ethics Officer", desc: "Ensuring AI deployments meet regulatory and ethical standards." },
              { title: "Human-AI Collab Manager", desc: "Optimizing team performance in hybrid environments." },
              { title: "Synthetic Data Designer", desc: "Creating high-quality datasets for model training." }
            ].map((item, i) => (
              <li key={i} className="group/item">
                <p className="font-bold text-slate-900 text-sm mb-1 group-hover/item:text-fm-blue transition-colors">{item.title}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Skillsets */}
      <div className="glass-panel p-8 bg-white border-slate-200 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Cpu size={80} />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-fm-violet/10 rounded-2xl flex items-center justify-center text-fm-violet mb-6">
            <Cpu size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">In-Demand Skillsets</h3>
          <ul className="space-y-4">
            {[
              { skill: "Multi-modal Prompting", desc: "Mastering text, image, video, and audio AI inputs." },
              { skill: "AI Governance", desc: "Understanding the legal and safety frameworks of AI." },
              { skill: "LLM Fine-tuning", desc: "Adapting base models to specific industry knowledge." },
              { skill: "Strategic AI Auditing", desc: "Evaluating AI outputs for bias and accuracy." },
              { skill: "Cross-Platform Integration", desc: "Connecting AI tools across different software stacks." }
            ].map((item, i) => (
              <li key={i} className="group/item">
                <p className="font-bold text-slate-900 text-sm mb-1 group-hover/item:text-fm-violet transition-colors">{item.skill}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Apps & Tools */}
      <div className="glass-panel p-8 bg-white border-slate-200 shadow-lg relative overflow-hidden group">
        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
          <Globe size={80} />
        </div>
        <div className="relative z-10">
          <div className="w-12 h-12 bg-fm-orange/10 rounded-2xl flex items-center justify-center text-fm-orange mb-6">
            <Globe size={24} />
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-6">Essential Apps & Tools</h3>
          <ul className="space-y-4">
            {[
              { tool: "LangChain / CrewAI", desc: "Frameworks for building multi-agent AI systems." },
              { tool: "Claude 4 / GPT-5", desc: "The next generation of reasoning-heavy LLMs." },
              { tool: "Perplexity Pro", desc: "The standard for AI-powered research and discovery." },
              { tool: "Midjourney v7+", desc: "Advanced generative visual design for marketing." },
              { tool: "Zapier Central", desc: "AI-first automation for business processes." }
            ].map((item, i) => (
              <li key={i} className="group/item">
                <p className="font-bold text-slate-900 text-sm mb-1 group-hover/item:text-fm-orange transition-colors">{item.tool}</p>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  </div>
);

const JobCard = ({ 
  job, 
  onMatch, 
  onCompare, 
  isSelected, 
  onSWOT,
  onRevise,
  onLetter,
  onPrep
}: { 
  job: Job; 
  onMatch: (job: Job) => void; 
  onCompare: (job: Job) => void; 
  isSelected: boolean;
  onSWOT: (job: Job) => void;
  onRevise: (job: Job) => void;
  onLetter: (job: Job) => void;
  onPrep: (job: Job) => void;
}) => (
  <div className="glass-panel p-8 hover:bg-blue-50 hover:shadow-xl hover:border-blue-100 transition-all border-slate-200 group relative overflow-hidden flex flex-col h-full bg-white shadow-sm">
    <div className="absolute top-0 right-0 w-32 h-32 bg-fm-blue/5 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
    
    <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="text-2xl font-serif font-bold text-slate-900 mb-2 group-hover:text-fm-blue transition-colors line-clamp-2">{job.title}</h3>
            <div className="flex flex-col gap-1">
              <span className="font-bold text-fm-violet text-lg">{job.company}</span>
              <div className="flex items-center gap-4 text-slate-400 text-xs font-medium">
                <span className="flex items-center gap-1"><MapPin size={14} /> {job.location}</span>
                <span className="flex items-center gap-1"><DollarSign size={14} /> {job.salary}</span>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-1">
            <button 
              onClick={() => onCompare(job)}
              aria-label={isSelected ? "Remove from comparison" : "Add to comparison"}
              className={`p-3 rounded-xl border transition-all flex-shrink-0 ${isSelected ? 'bg-fm-blue text-white border-fm-blue shadow-md' : 'bg-white text-slate-300 border-slate-100 hover:border-fm-blue hover:text-fm-blue'}`}
              title={isSelected ? "Remove from comparison" : "Add to comparison"}
            >
              <TableIcon size={20} />
            </button>
            <span className={`text-[8px] font-bold uppercase tracking-widest ${isSelected ? 'text-fm-blue' : 'text-slate-300'}`}>
              {isSelected ? 'Added' : 'Compare'}
            </span>
          </div>
        </div>

      <div className="flex flex-wrap gap-2 mb-8">
        {job.techStack.slice(0, 4).map((tag, i) => (
          <span key={i} className="px-3 py-1 bg-slate-50 text-slate-500 text-[10px] font-bold uppercase tracking-widest rounded-lg border border-slate-100">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-auto space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <button 
            onClick={() => onMatch(job)}
            aria-label={`Match resume to ${job.title}`}
            title="Compare your resume against the job description to see your compatibility score and keyword gaps."
            className="flex items-center justify-center gap-2 py-3 bg-fm-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
          >
            <Zap size={14} /> Match
          </button>
          <button 
            onClick={() => onRevise(job)}
            aria-label={`Revise resume for ${job.title}`}
            title="Automatically optimize your resume bullet points to better align with this specific role's requirements."
            className="flex items-center justify-center gap-2 py-3 bg-violet-50 text-fm-violet rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-violet-100 transition-all border border-violet-100"
          >
            <PenTool size={14} /> Revise
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => onLetter(job)}
            aria-label={`Draft cover letter for ${job.title}`}
            title="Generate a tailored cover letter that highlights your most relevant experiences for this position."
            className="flex items-center justify-center gap-2 py-3 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-teal-100 transition-all border border-teal-100"
          >
            Letter
          </button>
          <button 
            onClick={() => onPrep(job)}
            aria-label={`Get interview tips for ${job.title}`}
            title="Get AI-generated practice questions and strategic advice based on the job's core competencies."
            className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            Interview Tips
          </button>
          <button 
            onClick={() => onSWOT(job)}
            aria-label={`SWOT analysis for ${job.title}`}
            title="Analyze the Strengths, Weaknesses, Opportunities, and Threats of your profile relative to this job."
            className="flex items-center justify-center gap-2 py-3 bg-blue-50 text-fm-blue rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-100 transition-all border border-blue-100"
          >
            SWOT Analysis
          </button>
        </div>
      </div>
      
      <div className="mt-6 pt-6 border-t border-slate-100 flex justify-between items-center">
        <a 
          href={job.companyUrl} 
          target="_blank" 
          rel="noopener noreferrer" 
          className="text-[10px] font-bold uppercase tracking-widest text-fm-violet hover:underline flex items-center gap-2"
        >
          Career Site <ExternalLink size={12} />
        </a>
        <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">Posted {job.postedDate}</span>
      </div>
    </div>
  </div>
);

const MockInterview = ({ job, question, onBack }: { job: Job; question: string; onBack: () => void }) => {
  const [answer, setAnswer] = useState('');
  const [feedback, setFeedback] = useState<{ feedback: string; score: number; suggestions: string[] } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!answer.trim()) return;
    setLoading(true);
    try {
      const result = await getInterviewFeedback(question, answer, job);
      setFeedback(result);
    } catch (error) {
      console.error('Error getting feedback:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      <div className="p-8 bg-indigo-50 rounded-[2rem] border border-indigo-100 shadow-sm">
        <h4 className="text-xs font-bold text-indigo-400 uppercase tracking-[0.2em] mb-4">Question</h4>
        <p className="text-2xl font-bold text-indigo-900 leading-tight">{question}</p>
      </div>

      {!feedback ? (
        <div className="space-y-6">
          <div>
            <label 
              htmlFor="mock-interview-answer"
              className="block text-sm font-bold text-indigo-700 uppercase tracking-wider mb-2"
            >
              Your Answer
            </label>
            <textarea
              id="mock-interview-answer"
              value={answer}
              onChange={(e) => setAnswer(e.target.value)}
              placeholder="Type your answer here..."
              className="w-full h-48 p-4 rounded-2xl border-2 border-indigo-100 focus:border-indigo-500 focus:ring-0 transition-all resize-none font-sans text-indigo-700"
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleSubmit}
              disabled={loading || !answer.trim()}
              aria-live="polite"
              className="flex-1 py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-200"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={24} />
                  Analyzing Your Answer...
                </>
              ) : (
                <>
                  <Send size={24} />
                  Submit for Feedback
                </>
              )}
            </button>
            <button
              onClick={onBack}
              className="px-8 py-4 border-2 border-indigo-100 text-indigo-400 rounded-2xl font-bold hover:bg-indigo-50 transition-all"
            >
              Cancel
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          <div className="flex flex-col md:flex-row items-center gap-10 p-10 bg-indigo-50 rounded-[2.5rem] border border-indigo-100 shadow-inner">
            <div className="relative w-32 h-32 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent" className="text-indigo-200" />
                <circle
                  cx="64" cy="64" r="56" stroke="currentColor" strokeWidth="10" fill="transparent"
                  strokeDasharray={352}
                  strokeDashoffset={352 - (352 * feedback.score) / 100}
                  className={`${feedback.score >= 80 ? 'text-emerald-500' : feedback.score >= 60 ? 'text-amber-500' : 'text-rose-500'} transition-all duration-1000 ease-out`}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-indigo-900">{feedback.score}%</span>
              </div>
            </div>
            <div className="flex-1">
              <h3 className="text-xl font-bold text-indigo-900 mb-2">AI Feedback</h3>
              <p className="text-lg text-indigo-700 leading-relaxed italic">"{feedback.feedback}"</p>
            </div>
          </div>

          <div className="p-8 bg-white rounded-[2rem] border border-indigo-100 shadow-sm">
            <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-[0.2em] mb-6">Suggestions for Improvement</h4>
            <ul className="space-y-4">
              {feedback.suggestions.map((s, i) => (
                <li key={i} className="flex gap-4 text-indigo-700">
                  <div className="flex-shrink-0 w-6 h-6 bg-indigo-600 text-white rounded-full flex items-center justify-center text-xs font-bold">
                    {i + 1}
                  </div>
                  <p className="text-base leading-relaxed">{s}</p>
                </li>
              ))}
            </ul>
          </div>

          <button
            onClick={() => {
              setFeedback(null);
              setAnswer('');
            }}
            className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200"
          >
            Try Again
          </button>
          <button
            onClick={onBack}
            className="w-full py-4 border-2 border-indigo-100 text-indigo-400 rounded-2xl font-bold hover:bg-indigo-50 transition-all"
          >
            Back to Questions
          </button>
        </div>
      )}
    </div>
  );
};

const InterviewPrepView = ({ job, onBack }: { job: Job; onBack: () => void }) => {
  const [prep, setPrep] = useState<InterviewPrep | null>(null);
  const [loading, setLoading] = useState(true);
  const [practiceQuestion, setPracticeQuestion] = useState<string | null>(null);

  useEffect(() => {
    const fetchPrep = async () => {
      try {
        const data = await generateInterviewPrep(job);
        setPrep(data);
      } catch (error) {
        console.error('Error generating interview prep:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPrep();
  }, [job]);

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-fm-blue transition-all mb-10 text-[10px] font-bold uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={16} />
        Back Home
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
        <div className="p-8 bg-gradient-to-br from-indigo-600 to-violet-700 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <MessageSquare size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Interview Preparation</h2>
              <p className="text-indigo-100">
                Strategic guide for {job.title} at{' '}
                <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                  {job.company}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 space-y-4">
              <Loader2 className="animate-spin text-indigo-600" size={48} />
              <p className="text-blue-500 font-medium">Generating your interview strategy...</p>
            </div>
          ) : practiceQuestion ? (
            <MockInterview 
              job={job} 
              question={practiceQuestion} 
              onBack={() => setPracticeQuestion(null)} 
            />
          ) : prep ? (
            <div className="space-y-12">
              <section>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-bold text-indigo-900 flex items-center gap-2">
                    <TrendingUp className="text-indigo-600" size={24} />
                    Top Interview Questions
                  </h3>
                  <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">Click a question to practice</span>
                </div>
                <div className="space-y-8">
                  {prep.questions.map((q, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 shadow-sm group hover:border-indigo-300 transition-all cursor-pointer" onClick={() => setPracticeQuestion(q.question)}>
                      <div className="flex gap-6 mb-6">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-200 group-hover:scale-110 transition-transform">
                          {i + 1}
                        </div>
                        <div className="flex-1">
                          <h4 className="text-2xl font-bold text-indigo-900 leading-tight group-hover:text-indigo-600 transition-colors">{q.question}</h4>
                          <div className="mt-4 flex items-center gap-2 text-indigo-500 font-bold text-[10px] uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all">
                            Practice this question <ArrowRight size={14} />
                          </div>
                        </div>
                      </div>
                      <div className="space-y-6 ml-16">
                        <div>
                          <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">Why they ask</p>
                          <p className="text-blue-600 text-base italic leading-relaxed">{q.whyTheyAsk}</p>
                        </div>
                        <div>
                          <p className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em] mb-2">Suggested Answer</p>
                          <p className="text-blue-700 text-lg leading-relaxed font-serif">{q.suggestedAnswer}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <section className="p-8 rounded-[2rem] bg-violet-50 border border-violet-100 shadow-sm">
                  <h3 className="text-xl font-bold text-violet-800 mb-6 flex items-center gap-3">
                    <Shield size={24} />
                    Company Culture
                  </h3>
                  <p className="text-blue-700 text-base leading-relaxed">{prep.companyCulture}</p>
                </section>

                <section className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 shadow-sm">
                  <h3 className="text-xl font-bold text-emerald-800 mb-6 flex items-center gap-3">
                    <Zap size={24} />
                    Strategic Advice
                  </h3>
                  <ul className="space-y-4">
                    {prep.strategicAdvice.map((advice, i) => (
                      <li key={i} className="flex gap-3 text-blue-700 text-base leading-relaxed">
                        <span className="text-emerald-500 font-bold text-xl">•</span>
                        {advice}
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </motion.div>
  );
};

const CoverLetterDrafter = ({ job, onBack, initialResumeText }: { job: Job; onBack: () => void; initialResumeText: string }) => {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [coverLetter, setCoverLetter] = useState<CoverLetter | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const result = await generateCoverLetter(resumeText, job);
      setCoverLetter(result);
    } catch (error) {
      console.error('Error generating cover letter:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (coverLetter) {
      navigator.clipboard.writeText(coverLetter.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-fm-blue transition-all mb-10 text-[10px] font-bold uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={16} />
        Back Home
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
        <div className="p-8 bg-gradient-to-br from-emerald-600 to-teal-700 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <PenTool size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Cover Letter Drafter</h2>
              <p className="text-emerald-100">
                Personalized pitch for {job.title} at{' '}
                <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                  {job.company}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {!coverLetter ? (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">
                  Paste Your Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume here to personalize the cover letter..."
                  className="w-full h-64 p-4 rounded-2xl border-2 border-blue-100 focus:border-emerald-500 focus:ring-0 transition-all resize-none font-sans text-blue-700"
                />
              </div>
              <button
                onClick={handleGenerate}
                disabled={loading || !resumeText.trim()}
                className="w-full py-4 bg-emerald-600 text-white rounded-2xl font-bold text-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-emerald-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Drafting Your Letter...
                  </>
                ) : (
                  <>
                    <PenTool size={24} />
                    Generate Cover Letter
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-indigo-900">Your Drafted Cover Letter</h3>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all font-bold text-sm"
                >
                  {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>

              <div className="p-10 bg-blue-50 rounded-[2rem] border border-blue-100 font-serif text-indigo-900 text-xl leading-relaxed whitespace-pre-wrap shadow-inner">
                {coverLetter.content}
              </div>

              <div className="p-8 rounded-[2rem] bg-emerald-50 border border-emerald-100 shadow-sm">
                <h4 className="text-xs font-bold text-emerald-800 uppercase tracking-[0.2em] mb-6">Key Points Highlighted</h4>
                <div className="flex flex-wrap gap-3">
                  {coverLetter.keyPointsHighlighted.map((point, i) => (
                    <span key={i} className="px-4 py-2 bg-white text-emerald-700 rounded-xl text-sm font-bold border border-emerald-100 shadow-sm">
                      {point}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setCoverLetter(null)}
                className="w-full py-4 border-2 border-blue-200 text-blue-500 rounded-2xl font-bold hover:bg-blue-50 transition-all"
              >
                Start Over with New Details
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const ResumeMatcher = ({ job, onBack, initialResumeText }: { job: Job; onBack: () => void; initialResumeText: string }) => {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [match, setMatch] = useState<ResumeMatch | null>(null);
  const [loading, setLoading] = useState(false);

  const handleMatch = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const result = await matchResumeToJob(resumeText, job);
      setMatch(result);
    } catch (error) {
      console.error('Error matching resume:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <button 
        onClick={onBack}
        aria-label="Go back to home page"
        className="flex items-center gap-2 text-slate-400 hover:text-fm-blue transition-all mb-10 text-[10px] font-bold uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={16} />
        Back Home
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
        <div className="p-8 bg-gradient-to-br from-fm-blue to-blue-800 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <FileText size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">Resume Matcher</h2>
              <p className="text-blue-100">
                Analyzing fit for {job.title} at{' '}
                <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                  {job.company}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {!match ? (
            <div className="space-y-6">
              <div>
                <label 
                  htmlFor="resume-matcher-text"
                  className="block text-sm font-bold text-blue-700 uppercase tracking-wider mb-2"
                >
                  Paste Your Resume Text
                </label>
                <textarea
                  id="resume-matcher-text"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste the full text of your resume here..."
                  className="w-full h-64 p-4 rounded-2xl border-2 border-blue-100 focus:border-fm-blue focus:ring-0 transition-all resize-none font-sans text-blue-700"
                />
              </div>
              <button
                onClick={handleMatch}
                disabled={loading || !resumeText.trim()}
                aria-live="polite"
                className="w-full py-4 bg-fm-blue text-white rounded-2xl font-bold text-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-blue-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Analyzing Your Fit...
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    Calculate Match Score
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex flex-col md:flex-row items-center gap-10 p-10 bg-blue-50 rounded-[2.5rem] border border-blue-100 shadow-inner">
                <div className="relative w-48 h-48 flex items-center justify-center">
                  <svg className="w-full h-full transform -rotate-90">
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="currentColor"
                      strokeWidth="14"
                      fill="transparent"
                      className="text-blue-200"
                    />
                    <circle
                      cx="96"
                      cy="96"
                      r="84"
                      stroke="currentColor"
                      strokeWidth="14"
                      fill="transparent"
                      strokeDasharray={528}
                      strokeDashoffset={528 - (528 * match.score) / 100}
                      className={`${
                        match.score >= 80 ? 'text-emerald-500' : 
                        match.score >= 60 ? 'text-amber-500' : 'text-rose-500'
                      } transition-all duration-1000 ease-out drop-shadow-[0_0_8px_rgba(0,0,0,0.1)]`}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-5xl font-black text-indigo-900 tracking-tighter">{match.score}%</span>
                    <span className="text-xs font-bold text-blue-400 uppercase tracking-[0.2em]">Match</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-bold text-indigo-900 mb-4">Analysis Summary</h3>
                  <p className="text-xl text-blue-600 leading-relaxed italic font-serif">"{match.summary}"</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                <div className="space-y-6">
                  <h4 className="flex items-center gap-3 font-bold text-emerald-700 uppercase tracking-[0.2em] text-xs">
                    <CheckCircle2 size={24} />
                    Matching Skills
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {match.matchingSkills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-emerald-50 text-emerald-700 rounded-xl text-base font-bold border border-emerald-100 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="space-y-6">
                  <h4 className="flex items-center gap-3 font-bold text-rose-700 uppercase tracking-[0.2em] text-xs">
                    <XCircle size={24} />
                    Missing Skills
                  </h4>
                  <div className="flex flex-wrap gap-3">
                    {match.missingSkills.map((skill, i) => (
                      <span key={i} className="px-4 py-2 bg-rose-50 text-rose-700 rounded-xl text-base font-bold border border-rose-100 shadow-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-8 bg-fm-blue/5 rounded-3xl border border-fm-blue/10">
                <h4 className="flex items-center gap-2 font-bold text-fm-blue uppercase tracking-wider text-sm mb-6">
                  <Lightbulb size={20} />
                  Personalized Application Tips
                </h4>
                <ul className="space-y-4">
                  {match.tips.map((tip, i) => (
                    <li key={i} className="flex gap-4 text-blue-700">
                      <div className="flex-shrink-0 w-6 h-6 bg-fm-blue text-white rounded-full flex items-center justify-center text-xs font-bold">
                        {i + 1}
                      </div>
                      <p className="text-sm leading-relaxed">{tip}</p>
                    </li>
                  ))}
                </ul>
              </div>

              <button
                onClick={() => setMatch(null)}
                className="w-full py-4 border-2 border-blue-200 text-blue-500 rounded-2xl font-bold hover:bg-blue-50 transition-all"
              >
                Re-analyze with Updated Resume
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const PORTALS = [
  { id: 'Google', n: 'Google', u: 'https://www.coursera.org/google', d: 'Take the next step in your learning journey. Each course in this learning program is designed to fit your unique career goals. Enroll in another course to continue building functional, job-ready solutions you can use right away.', icon: '📘', bg: 'bg-blue-50/60', border: 'border-blue-100' },
  { id: 'NotebookLM', n: 'NotebookLM', u: 'https://notebooklm.google.com/', d: 'Use AI as your research partner to gain insights, generate summaries, and pressure test ideas.', icon: '📓', bg: 'bg-indigo-50/60', border: 'border-indigo-100' },
  { id: 'Anthropic', n: 'Anthropic', u: 'https://anthropic.skilljar.com/', d: 'Anthropic provides direct access to frontier-model research and AI development resources.', icon: '⚡', bg: 'bg-violet-50/60', border: 'border-violet-100' },
  { id: 'edX', n: 'edX', u: 'https://authn.edx.org/login?next=https%3A%2F%2Flearning.edx.org%2Fcourse%2Fcourse-v1%3AAI%2Bllmops3x%2B1T2024%2Fhome', d: 'edX is a global learning platform offering courses from world-class universities and industry leaders.', icon: '🧠', bg: 'bg-emerald-50/60', border: 'border-emerald-100' },
  { id: 'LHH', n: 'LHH', u: 'https://www.lhh.com/en-us', d: 'LHH brings together global excellence, local knowledge, and decades of experience to support companies and professionals across the talent lifecycle.', icon: '💼', bg: 'bg-blue-50/60', border: 'border-blue-100' },
  { id: 'LinkedIn', n: 'LinkedIn Learning', u: 'https://www.linkedin.com/learning-login/continue?account=67698794&forceAccount=false&authUUID=q95hhwNFS%2BWFOWMQt%2BnDKg%3D%3D&redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning%2F%3Fu%3D67698794', d: 'LinkedIn Learning offers professional skill development through a vast library of expert-led video content.', icon: '🔗', bg: 'bg-blue-50/60', border: 'border-blue-100' },
  { id: 'Microsoft', n: 'Microsoft', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/', d: 'Microsoft provides comprehensive training modules for mastering AI architecture and safe deployment at enterprise scale.', icon: '💡', bg: 'bg-sky-50/60', border: 'border-sky-100' },
  { id: 'Pega', n: 'Pega', u: 'https://academy.pega.com/', d: 'Pega offers enterprise-grade automation and workflow optimization training for digital transformation professionals.', icon: '🏛️', bg: 'bg-blue-50/60', border: 'border-blue-100' },
  { id: 'SAFe', n: 'SAFe', u: 'https://connect.scaledagile.com/login', d: 'The Scaled Agile Framework provides guidance for implementing lean-agile practices at enterprise scale.', icon: '🛡️', bg: 'bg-rose-50/60', border: 'border-rose-100' },
  { id: 'Udemy', n: 'Udemy', u: 'https://verizonreskilling.udemy.com/', d: 'Udemy is a broad marketplace of technical and strategic AI courses curated for professional growth.', icon: '🎓', bg: 'bg-orange-50/60', border: 'border-orange-100' },
  { id: 'Verizon', n: 'Verizon Reskilling', u: 'https://www.verizon.com/about/responsibility/human-prosperity/reskilling-program', d: 'Verizon offers technical reskilling programs focused on workforce readiness and digital prosperity.', icon: '📡', bg: 'bg-red-50/60', border: 'border-red-100' },
];

const LEARNING_MODULES = [
  // Anthropic
  { p: 'Anthropic', e: '⚡', n: 'Claude Code In Action', d: 'AI-assisted coding workflows and real-world application patterns.', u: 'https://anthropic.skilljar.com/claude-code-in-action' },
  { p: 'Anthropic', e: '🌱', n: 'Claude 101', d: 'Core interaction patterns with the Claude model family.', u: 'https://anthropic.skilljar.com/claude-101' },
  { p: 'Anthropic', e: '🧠', n: 'AI Fluency: Foundations', d: 'Core AI terminology, mental models, and key concepts.', u: 'https://anthropic.skilljar.com/ai-fluency-framework-foundations' },
  { p: 'Anthropic', e: '🎓', n: 'Teaching AI Fluency', d: 'Strategies for instructing others in AI concepts and practices.', u: 'https://anthropic.skilljar.com/teaching-ai-fluency' },
  { p: 'Anthropic', e: '📚', n: 'AI Fluency For Educators', d: 'AI methodology tailored to academic and educational settings.', u: 'https://anthropic.skilljar.com/ai-fluency-for-educators' },
  { p: 'Anthropic', e: '🎒', n: 'AI Fluency For Students', d: 'Leveraging AI tools effectively for learning and research.', u: 'https://anthropic.skilljar.com/ai-fluency-for-students' },
  { p: 'Anthropic', e: '🤝', n: 'AI Fluency For Nonprofits', d: 'Creating social impact through thoughtful AI integration.', u: 'https://anthropic.skilljar.com/ai-fluency-for-nonprofits' },
  { p: 'Anthropic', e: '🛠️', n: 'Claude API', d: 'Full API implementation guide for production deployments.', u: 'https://anthropic.skilljar.com/claude-with-the-anthropic-api' },
  { p: 'Anthropic', e: '🔗', n: 'Intro to Model Context Protocol', d: 'Standard protocol for structured data integration and exchange.', u: 'https://anthropic.skilljar.com/introduction-to-model-context-protocol' },
  { p: 'Anthropic', e: '🚀', n: 'MCP: Advanced Topics', d: 'Deep-dive into Model Context Protocol architecture and patterns.', u: 'https://anthropic.skilljar.com/model-context-protocol-advanced-topics' },
  { p: 'Anthropic', e: '☁️', n: 'Claude with Amazon Bedrock', d: 'Deploying Claude within Amazon cloud infrastructure at scale.', u: 'https://anthropic.skilljar.com/claude-in-amazon-bedrock' },
  { p: 'Anthropic', e: '🌐', n: 'Claude with Vertex AI', d: 'Integrating Claude into Google Cloud platform environments.', u: 'https://anthropic.skilljar.com/claude-with-google-vertex' },
  { p: 'Anthropic', e: '🤖', n: 'Intro to Agent Skills', d: 'Foundations for building autonomous AI agents and pipelines.', u: 'https://anthropic.skilljar.com/introduction-to-agent-skills' },
  // Microsoft
  { p: 'Microsoft', e: '💡', n: 'Episode 1: Intro to Gen AI', d: 'Introduction to Generative AI and Large Language Models.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/introduction-to-generative-ai-and-llms-generative-ai-for-beginners' },
  { p: 'Microsoft', e: '🔭', n: 'Episode 2: Exploring LLMs', d: 'Comparing and evaluating different LLM architectures.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/exploring-and-comparing-different-llms-generative-ai-for-beginners' },
  { p: 'Microsoft', e: '⚖️', n: 'Episode 3: Responsible AI', d: 'Frameworks for using Generative AI responsibly and safely.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/using-generative-ai-responsibly-generative-ai-for-beginners' },
  { p: 'Microsoft', e: '⌨️', n: 'Episode 4: Prompt Engineering', d: 'Fundamentals of prompt engineering and instruction design.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/understanding-prompt-engineering-fundamentals-generative-ai-for-beginners' },
  { p: 'Microsoft', e: '🚀', n: 'Episode 5: Advanced Prompts', d: 'Advanced prompting techniques for precise AI control.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/creating-advanced-prompts-generative-ai-for-beginners' },
  { p: 'Microsoft', e: '📝', n: 'Episode 6: Text Generation', d: 'Building text-generation applications with generative models.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/building-text-generation-applications-generative-ai-for-beginners' },
  { p: 'Microsoft', e: '💬', n: 'Episode 7: Chat Apps', d: 'Building LLM-powered chat applications from scratch.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/building-chat-applications-generative-ai-for-beginners' },
  // Pega
  { p: 'Pega', e: '🏛️', n: 'Pega Academy', d: 'Enterprise automation and workflow optimization training hub.', u: 'https://academy.pega.com/' },
  { p: 'Pega', e: '🤖', n: 'Pega Process AI Essentials', d: 'AI-powered process automation and decisioning fundamentals.', u: 'https://academy.pega.com/mission/pega-process-ai-essentials/v7' },
  // SAFe
  { p: 'SAFe', e: '🛡️', n: 'SAFe Login Portal', d: 'Access the Scaled Agile Framework training and certification platform.', u: 'https://connect.scaledagile.com/login' },
  { p: 'Verizon', e: '📡', n: 'Verizon Reskilling Program', d: 'Technical reskilling programs focused on workforce readiness and digital prosperity.', u: 'https://www.verizon.com/about/responsibility/human-prosperity/reskilling-program' },
  { p: 'Verizon', e: '🎓', n: 'Udemy — AI Leader Cert', d: 'Generative AI leadership strategy and certification, via Verizon Udemy access.', u: 'https://verizonreskilling.udemy.com/course/ai-leader-the-ultimate-generative-ai-leader-cert-training/' },
  { p: 'Verizon', e: '🌟', n: 'edX — Skill Forward', d: 'Exclusive career reskilling pathways curated for Verizon alumni.', u: 'https://enterprise.edx.org/verizon-skill-forward/search' },
  { p: 'LinkedIn', e: '🔗', n: 'LinkedIn Learning Portal', d: 'Access the full LinkedIn Learning library — courses, paths, and certificates.', u: 'https://www.linkedin.com/learning-login/continue?account=67698794&forceAccount=false&authUUID=q95hhwNFS%2BWFOWMQt%2BnDKg%3D%3D&redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning%2F%3Fu%3D67698794' },
  { p: 'LinkedIn', e: '🎯', n: 'AI & Machine Learning Paths', d: 'Curated LinkedIn Learning paths for AI fluency and machine learning skills.', u: 'https://www.linkedin.com/learning-login/continue?account=67698794&forceAccount=false&authUUID=q95hhwNFS%2BWFOWMQt%2BnDKg%3D%3D&redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning%2F%3Fu%3D67698794' },
  { p: 'LinkedIn', e: '💼', n: 'Career Development Courses', d: 'Professional growth, leadership, and career transition courses on LinkedIn.', u: 'https://www.linkedin.com/learning-login/continue?account=67698794&forceAccount=false&authUUID=q95hhwNFS%2BWFOWMQt%2BnDKg%3D%3D&redirect=https%3A%2F%2Fwww.linkedin.com%2Flearning%2F%3Fu%3D67698794' },
  { p: 'edX', e: '🧠', n: 'LLM Ops', d: 'Large Language Model operations, monitoring, and management.', u: 'https://learning.edx.org/course/course-v1:AI+llmops3x+1T2024/home' },
  { p: 'edX', e: '🌟', n: 'Skill Forward', d: 'Exclusive career reskilling pathways curated for alumni.', u: 'https://enterprise.edx.org/verizon-skill-forward/search' },
  // Udemy
  { p: 'Udemy', e: '🎓', n: 'AI Leader Cert', d: 'Generative AI leadership strategy and certification program.', u: 'https://verizonreskilling.udemy.com/course/ai-leader-the-ultimate-generative-ai-leader-cert-training/' },
  { p: 'Udemy', e: '🛡️', n: 'AI Auditing', d: 'Governance frameworks and accountability practices for AI systems.', u: 'https://verizonreskilling.udemy.com/course/ai-audit-certification-mastercalss/' },
  { p: 'Udemy', e: '🔐', n: 'AI Governance', d: 'Risk management and compliance for LLM deployments.', u: 'https://verizonreskilling.udemy.com/course/ai-governance-professional-aigp-2025/' },
  { p: 'Udemy', e: '📈', n: 'AI Mock Exam', d: 'Practice exams for AI certification preparation.', u: 'https://verizonreskilling.udemy.com/course/google-cloud-generative-ai-leader-3-mock-generative-ai-leader-exams/' },
  // LHH
  { p: 'LHH', e: '💼', n: 'Career Transition', d: 'Lee Hecht Harrison professional coaching and support services.', u: 'https://www.lhh.com/en-us' },
  { p: 'LHH', e: '📝', n: 'Presence Guide', d: 'Optimizing your digital profile for the modern hiring process.', u: 'https://www.lhh.com/en-us/individuals/' },
  // Google & NotebookLM
  { p: 'Google', e: '🧠', n: 'AI for Brainstorming and Planning', d: 'Use AI to brainstorm concepts, build detailed timelines, and organize a clear plan for any goal. (Recommended)', u: 'https://www.coursera.org/learn/google-ai-for-brainstorming-and-planning' },
  { p: 'NotebookLM', e: '📓', n: 'NotebookLM', d: 'Use AI as your research partner to gain insights, generate summaries, and pressure test ideas.', u: 'https://notebooklm.google.com/' },
  { p: 'NotebookLM', e: '🎙️', n: 'NotebookLM: Audio Overview', d: 'Listen to an AI-generated deep dive into career transition strategies.', u: 'https://notebooklm.google.com/notebook/b02cfeb6-d2bc-4ec8-94e3-5c8f9f5ec40b?artifactId=14120553-0dc1-4f84-b985-ac28f4a8e14a' },
  { p: 'Google', e: '✨', n: 'AI Fundamentals', d: 'Learn essential AI concepts and practice prompting effectively.', u: 'https://www.coursera.org/learn/google-ai-fundamentals' },
  { p: 'Google', e: '🔍', n: 'AI for Research and Insights', d: 'Use AI as your research partner, leveraging Deep Research and NotebookLM to gain insights, generate summaries, and pressure test ideas for informed decision-making.', u: 'https://www.coursera.org/learn/google-ai-for-writing-and-communicating' },
  { p: 'Google', e: '✍️', n: 'AI for Writing and Communicating', d: 'Turn rough notes into clear messages, easily adapt them for different stakeholders, and practice for presentations by anticipating questions and concerns.', u: 'https://www.coursera.org/learn/google-ai-for-writing-and-communicating' },
  { p: 'Google', e: '🎨', n: 'AI for Content Creation', d: 'Use AI as your creative partner to generate high-quality images, video, and presentations.', u: 'https://www.coursera.org/learn/google-ai-for-content-creation' },
  { p: 'Google', e: '📊', n: 'AI for Data Analysis', d: 'Transform unstructured data into clear insights, master skills to analyze data, and create compelling visualizations and formulas with Gemini in Google Sheets.', u: 'https://www.coursera.org/learn/google-ai-for-data-analysis' },
  { p: 'Google', e: '🛠️', n: 'AI for App Building', d: 'Master vibe coding and build your own custom app. Tackle the most tedious tasks, all without writing a single line of code.', u: 'https://www.coursera.org/learn/google-ai-for-app-building' },
];

const PATHS_DATA = [
  // Health
  { n: 'Aledade', c: 'Health', d: 'Technology for independent primary care.', u: 'https://www.aledade.com/careers', e: '🏥' },
  { n: 'Alma', c: 'Health', d: 'High-quality mental healthcare platform.', u: 'https://helloalma.com/careers/', e: '🏥' },
  { n: 'Brightline', c: 'Health', d: 'Behavioral health for children and families.', u: 'https://www.hellobrightline.com/careers', e: '🏥' },
  { n: 'Cityblock Health', c: 'Health', d: 'Healthcare for underserved communities.', u: 'https://www.cityblock.com/careers', e: '🏥' },
  { n: 'Color Health', c: 'Health', d: 'Infrastructure for public health at scale.', u: 'https://www.color.com/careers', e: '🏥' },
  { n: 'Formation Bio', c: 'Health', d: 'AI-driven drug development platform.', u: 'https://formationbio.com/careers', e: '🏥' },
  { n: 'Grow Therapy', c: 'Health', d: 'Platform for mental health practices.', u: 'https://growtherapy.com/careers', e: '🏥' },
  { n: 'Headway', c: 'Health', d: 'Mental healthcare access infrastructure.', u: 'https://headway.co/careers', e: '🏥' },
  { n: 'Hinge Health', c: 'Health', d: 'Digital clinic for joint and muscle pain.', u: 'https://www.hingehealth.com/careers/', e: '🏥' },
  { n: 'Hippocratic AI', c: 'Health', d: 'Safety-focused LLMs for healthcare.', u: 'https://www.hippocraticai.com/careers', e: '🏥' },
  { n: 'Honor', c: 'Health', d: 'Empowering home care agencies and workers.', u: 'https://www.joinhonor.com/careers', e: '🏥' },
  { n: 'Included Health', c: 'Health', d: 'Healthcare navigation and clinical care.', u: 'https://includedhealth.com/careers/', e: '🏥' },
  { n: 'Lyra Health', c: 'Health', d: 'Mental health benefit transformation.', u: 'https://www.lyrahealth.com/careers/', e: '🏥' },
  { n: 'Maven Clinic', c: 'Health', d: 'Virtual clinic for women and families.', u: 'https://www.mavenclinic.com/careers', e: '🏥' },
  { n: 'Omada Health', c: 'Health', d: 'Virtual care for chronic conditions.', u: 'https://www.omadahealth.com/careers', e: '🏥' },
  { n: 'Pair Team', c: 'Health', d: 'Connecting clinics to digital care networks.', u: 'https://www.pairteam.com/careers', e: '🏥' },
  { n: 'Papa', c: 'Health', d: 'Companionship for seniors and families.', u: 'https://www.papa.com/careers', e: '🏥' },
  { n: 'Pearl Health', c: 'Health', d: 'Primary care value-based technology.', u: 'https://pearlhealth.com/careers/', e: '🏥' },
  { n: 'Pomelo Care', c: 'Health', d: 'Virtual maternity and neonatal care.', u: 'https://www.pomelocare.com/careers', e: '🏥' },
  { n: 'Ro', c: 'Health', d: 'Direct-to-patient telehealth company.', u: 'https://ro.co/careers/', e: '🏥' },
  { n: 'Spring Health', c: 'Health', d: 'Mental health benefits for employers.', u: 'https://www.springhealth.com/careers/', e: '🏥' },
  { n: 'Sword Health', c: 'Health', d: 'AI-powered physical therapy.', u: 'https://swordhealth.com/careers', e: '🏥' },
  { n: 'Virta Health', c: 'Health', d: 'Type 2 diabetes reversal through care.', u: 'https://www.virtahealth.com/careers', e: '🏥' },
  { n: 'Waymark', c: 'Health', d: 'Community care for Medicaid members.', u: 'https://www.waymark.com/careers', e: '🏥' },
  // Climate
  { n: 'Arcadia Power', c: 'Climate', d: 'Clean energy utility platform.', u: 'https://www.arcadia.com/careers', e: '🌍' },
  { n: 'Charm Industrial', c: 'Climate', d: 'Carbon removal via bio-oil sequestration.', u: 'https://charmindustrial.com/careers', e: '🌍' },
  { n: 'Climeworks', c: 'Climate', d: 'Direct air capture of CO₂ at industrial scale.', u: 'https://www.climeworks.com/careers', e: '🌍' },
  { n: 'Commonwealth Fusion', c: 'Climate', d: 'Compact fusion energy for a clean grid.', u: 'https://cfs.energy/careers', e: '🌍' },
  { n: 'Crusoe Energy', c: 'Climate', d: 'Stranded energy solutions for compute and climate.', u: 'https://www.crusoeenergy.com/careers', e: '🌍' },
  { n: 'Ecovative', c: 'Climate', d: 'Mycelium-based materials replacing plastics.', u: 'https://www.ecovative.com/pages/careers', e: '🌍' },
  { n: 'Electra', c: 'Climate', d: 'Green iron production via electrochemistry.', u: 'https://electra.earth/careers', e: '🌍' },
  { n: 'Moment Energy', c: 'Climate', d: 'Second-life EV batteries for energy storage.', u: 'https://www.momentenergy.com/careers', e: '🌍' },
  { n: 'Natel Energy', c: 'Climate', d: 'Run-of-river hydropower restoring fish habitat.', u: 'https://www.natelenergy.com/careers', e: '🌍' },
  { n: 'Redwood Materials', c: 'Climate', d: 'Battery recycling and supply chain.', u: 'https://www.redwoodmaterials.com/careers/', e: '🌍' },
  { n: 'Rho Motion', c: 'Climate', d: 'EV and battery market intelligence.', u: 'https://rhomotion.com/careers', e: '🌍' },
  { n: 'Twelve', c: 'Climate', d: 'CO₂-to-product conversion technology.', u: 'https://www.twelve.co/careers', e: '🌍' },
  { n: 'Turntide Technologies', c: 'Climate', d: 'Smart motor systems cutting industrial energy use.', u: 'https://turntide.com/careers/', e: '🌍' },
  { n: 'Watershed', c: 'Climate', d: 'Enterprise carbon management platform.', u: 'https://watershed.com/careers', e: '🌍' },
  // Education
  { n: 'Age of Learning', c: 'Education', d: 'Digital curriculum for PreK–5 learners.', u: 'https://www.ageoflearning.com/careers/', e: '📚' },
  { n: 'Chegg', c: 'Education', d: 'Connected learning platform for students.', u: 'https://careers.chegg.com/', e: '📚' },
  { n: 'Coursera', c: 'Education', d: 'Online degrees and professional certificates.', u: 'https://careers.coursera.com/', e: '📚' },
  { n: 'Duolingo', c: 'Education', d: 'Science-based language learning platform.', u: 'https://careers.duolingo.com/', e: '📚' },
  { n: 'Grad Leaders', c: 'Education', d: 'Career services technology for universities.', u: 'https://www.gradleaders.com/careers', e: '📚' },
  { n: 'Khan Academy', c: 'Education', d: 'Free, world-class education for anyone, anywhere.', u: 'https://www.khanacademy.org/careers', e: '📚' },
  { n: 'Newsela', c: 'Education', d: 'Instructional content platform for K–12.', u: 'https://newsela.com/about/careers/', e: '📚' },
  { n: 'Paper', c: 'Education', d: '24/7 tutoring and academic support for schools.', u: 'https://www.paper.co/careers', e: '📚' },
  { n: 'Synthesis', c: 'Education', d: 'Problem-solving education for ambitious kids.', u: 'https://www.synthesis.com/careers', e: '📚' },
  { n: 'Zearn', c: 'Education', d: 'Non-profit math learning for grades K–8.', u: 'https://about.zearn.org/careers', e: '📚' },
  // Civic
  { n: 'Beneficiary Technologies', c: 'Civic', d: 'Benefits access technology for government.', u: 'https://www.beneficiary.tech/careers', e: '🏛️' },
  { n: 'Bloomberg Philanthropies', c: 'Civic', d: 'Philanthropy addressing climate, public health, arts.', u: 'https://www.bloomberg.org/careers/', e: '🏛️' },
  { n: 'Code for America', c: 'Civic', d: 'Technology in service of people and society.', u: 'https://www.codeforamerica.org/jobs', e: '🏛️' },
  { n: 'DemocracyWorks', c: 'Civic', d: 'Nonpartisan voter registration and election tech.', u: 'https://www.democracy.works/careers', e: '🏛️' },
  { n: 'mRelief', c: 'Civic', d: 'Simplifying benefits access for low-income families.', u: 'https://www.mrelief.com/about', e: '🏛️' },
  { n: 'Nava PBC', c: 'Civic', d: 'Rebuilding government services for people.', u: 'https://www.navapbc.com/careers', e: '🏛️' },
  { n: 'Palantir', c: 'Civic', d: 'Data platforms for government and enterprise.', u: 'https://www.palantir.com/careers/', e: '🏛️' },
  { n: 'Propel', c: 'Civic', d: 'Financial tools for low-income Americans.', u: 'https://www.joinpropel.com/careers', e: '🏛️' },
  { n: 'Topos', c: 'Civic', d: 'AI tools for civic and government organizations.', u: 'https://topos.ai/careers', e: '🏛️' },
  { n: 'U.S. Digital Service', c: 'Civic', d: 'Improving federal services through technology.', u: 'https://www.usds.gov/apply', e: '🏛️' },
  // FinTech
  { n: 'Brex', c: 'FinTech', d: 'Financial OS for modern, scaling companies.', u: 'https://www.brex.com/careers', e: '💳' },
  { n: 'Chime', c: 'FinTech', d: 'Fee-free banking for financial peace of mind.', u: 'https://www.chime.com/about/careers/', e: '💳' },
  { n: 'Checkout.com', c: 'FinTech', d: 'Global payment solutions for digital business.', u: 'https://www.checkout.com/careers', e: '💳' },
  { n: 'Climb Credit', c: 'FinTech', d: 'Income-share financing for career training.', u: 'https://climbcredit.com/careers', e: '💳' },
  { n: 'Klarna', c: 'FinTech', d: 'Buy-now-pay-later and smart shopping tools.', u: 'https://www.klarna.com/careers/', e: '💳' },
  { n: 'Marqeta', c: 'FinTech', d: 'Modern card issuing platform for innovators.', u: 'https://www.marqeta.com/company/careers', e: '💳' },
  { n: 'Plaid', c: 'FinTech', d: 'Data network powering the fintech ecosystem.', u: 'https://plaid.com/careers/', e: '💳' },
  { n: 'Ramp', c: 'FinTech', d: 'Corporate cards and expense management platform.', u: 'https://ramp.com/careers', e: '💳' },
  { n: 'Stash', c: 'FinTech', d: 'Investing and banking app for everyday Americans.', u: 'https://www.stash.com/careers', e: '💳' },
  { n: 'Stripe', c: 'FinTech', d: 'Global payment infrastructure for the internet.', u: 'https://stripe.com/jobs', e: '💳' },
];

const TERMS = [
  { t: 'Generative AI', d: 'AI capable of creating new text, code, images, or data by learning patterns from vast training corpora.' },
  { t: 'LLM', d: 'Large Language Model — the transformer-based cognitive engine powering modern conversational AI systems.' },
  { t: 'RAG', d: 'Retrieval-Augmented Generation. Grounds AI responses in verified, up-to-date external knowledge.' },
  { t: 'Prompting', d: 'The precise method of crafting instructions or context to guide AI toward the desired output or behavior.' },
  { t: 'Fine-tuning', d: 'Adapting a pretrained model on a domain-specific dataset to improve performance on targeted tasks.' },
  { t: 'Embedding', d: 'A dense vector representation of data (text, images) that captures semantic meaning in high-dimensional space.' },
  { t: 'Token', d: 'The fundamental unit of text an LLM processes — roughly ¾ of a word in English on average.' },
  { t: 'Agent', d: 'An autonomous AI system that perceives its environment, makes decisions, and takes goal-directed actions.' },
];

const CATEGORIES = [
  { id: 'All', icon: '✨', bg: 'bg-violet-50/60', border: 'border-violet-100', d: 'Explore all mission-driven career opportunities across every sector.' },
  { id: 'Health', icon: '🏥', bg: 'bg-rose-50/60', border: 'border-rose-100', d: 'Innovate in patient care and health technology for a healthier future.' },
  { id: 'Climate', icon: '🌍', bg: 'bg-emerald-50/60', border: 'border-emerald-100', d: 'Join the fight against climate change with clean energy and sustainability.' },
  { id: 'Education', icon: '📚', bg: 'bg-blue-50/60', border: 'border-blue-100', d: 'Empower the next generation through accessible and world-class learning.' },
  { id: 'Civic', icon: '🏛️', bg: 'bg-amber-50/60', border: 'border-amber-100', d: 'Leverage technology to serve people and build more effective societies.' },
  { id: 'FinTech', icon: '💳', bg: 'bg-indigo-50/60', border: 'border-indigo-100', d: 'Reimagine global payment infrastructure and financial services for all.' },
];

const ReskillingView = () => {
  const [activePortal, setActivePortal] = useState('Google');
  const [activeCategory, setActiveCategory] = useState('All');

  const filteredModules = useMemo(() => {
    let modules = LEARNING_MODULES;
    if (activePortal !== 'All') {
      modules = modules.filter(m => m.p === activePortal);
    }
    if (activeCategory !== 'All') {
      modules = modules.filter(m => (m as any).c === activeCategory);
    }
    return modules;
  }, [activePortal, activeCategory]);

  const filteredPaths = useMemo(() => {
    if (activeCategory === 'All') return PATHS_DATA;
    return PATHS_DATA.filter(p => p.c === activeCategory);
  }, [activeCategory]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-24 pb-20"
    >
      <section className="relative h-[50vh] flex items-center justify-center overflow-hidden rounded-[3rem] bg-white border border-slate-200 shadow-xl">
        <div className="absolute inset-0 opacity-10">
          <img 
            src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&q=80&w=2071" 
            alt="Collaboration" 
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
        </div>
        
        <div className="relative z-10 text-center px-6 max-w-4xl">
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <span className="inline-block px-6 py-2 bg-fm-violet/10 text-fm-violet text-xs font-bold uppercase tracking-[0.3em] rounded-full mb-8">
              Resource Collective
            </span>
            <h2 className="text-4xl md:text-6xl font-serif font-bold tracking-tighter leading-tight mb-8 text-slate-900">
              Fuel your <br />
              <span className="text-fm-violet italic">infinite growth.</span>
            </h2>
            <p className="text-lg text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              A curated space for continuous upskilling, AI mastery, and staying ahead of the curve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Skill Studio Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-fm-violet mb-4 block">Learning Portals</span>
          <h2 className="text-4xl font-serif font-bold text-indigo-900 mb-4">Skill Studio</h2>
          <p className="text-blue-600/70 max-w-xl">Select a portal to explore its curriculum and AI modules.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/4 space-y-2">
            <button
              onClick={() => setActivePortal('All')}
              className={`w-full text-left px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all ${activePortal === 'All' ? 'bg-fm-blue text-white shadow-lg' : 'bg-white text-blue-400 hover:bg-blue-50'}`}
            >
              ✨ All Modules
            </button>
            {PORTALS.map(p => (
              <button
                key={p.id}
                onClick={() => setActivePortal(p.id)}
                className={`w-full text-left px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all ${activePortal === p.id ? 'bg-fm-blue text-white shadow-lg' : 'bg-white text-blue-400 hover:bg-blue-50'}`}
              >
                {p.icon} {p.n}
              </button>
            ))}
          </div>

          <div className="lg:w-3/4 bg-white rounded-[2.5rem] p-10 shadow-xl border border-blue-100">
            <div className="space-y-8">
              {filteredModules.map((m, i) => (
                <a
                  key={i}
                  href={m.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-8 rounded-[2rem] hover:bg-blue-50 transition-all group border border-transparent hover:border-blue-100 shadow-sm hover:shadow-md"
                >
                  <div className="flex items-center gap-8">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-3xl shadow-md border border-blue-100 group-hover:scale-110 transition-transform">
                      {m.e}
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="text-xl font-bold text-indigo-900 group-hover:text-fm-violet transition-colors">{m.n}</h4>
                        {m.d.includes('(Recommended)') && (
                          <span className="px-3 py-1 bg-amber-100 text-amber-600 text-[10px] font-bold uppercase tracking-widest rounded-full border border-amber-200">
                            Recommended
                          </span>
                        )}
                      </div>
                      <p className="text-base text-blue-500 leading-relaxed">{m.d.replace(' (Recommended)', '')}</p>
                    </div>
                  </div>
                      <ExternalLink size={24} className="text-blue-200 group-hover:text-fm-violet transition-colors" />
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Careers Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-fm-violet mb-4 block">Mission-Driven Companies</span>
          <h2 className="text-4xl font-serif font-bold text-indigo-900 mb-4">National Careers</h2>
          <p className="text-blue-600/70 max-w-xl">Explore opportunities across mission-driven sectors nationwide.</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          <div className="lg:w-1/4 space-y-2">
            {CATEGORIES.map(c => (
              <button
                key={c.id}
                onClick={() => setActiveCategory(c.id)}
                className={`w-full text-left px-6 py-3 rounded-2xl font-bold uppercase tracking-widest text-[10px] transition-all ${activeCategory === c.id ? 'bg-fm-blue text-white shadow-lg' : 'bg-white text-blue-400 hover:bg-blue-50'}`}
              >
                {c.icon} {c.id}
              </button>
            ))}
          </div>

          <div className="lg:w-3/4 bg-white rounded-[2.5rem] p-10 shadow-xl border border-blue-100">
            <div className="mb-10 pb-10 border-b border-slate-50">
              <p className="text-slate-400 font-light italic">
                {CATEGORIES.find(c => c.id === activeCategory)?.d}
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPaths.map((p, i) => (
                <a
                  key={i}
                  href={p.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-8 rounded-[2rem] bg-blue-50 hover:bg-blue-50 hover:shadow-xl transition-all group border border-transparent hover:border-blue-100 shadow-sm"
                >
                  <div className="flex items-center gap-6 mb-6">
                    <div className="text-4xl group-hover:scale-110 transition-transform">{p.e}</div>
                    <h4 className="text-xl font-bold text-indigo-900 group-hover:text-fm-violet transition-colors">{p.n}</h4>
                  </div>
                  <p className="text-base text-blue-500 mb-8 leading-relaxed">{p.d}</p>
                  <span className="text-xs font-bold uppercase tracking-[0.2em] text-fm-violet flex items-center gap-2">
                    View Careers <ExternalLink size={14} />
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Glossary Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-[3rem] p-16 text-slate-900 border border-slate-200 overflow-hidden relative shadow-xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-fm-violet/5 blur-[120px] rounded-full -mr-48 -mt-48" />
          <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-20">
            <div>
              <span className="text-xs font-bold uppercase tracking-[0.3em] text-fm-violet mb-6 block">AI Vocabulary</span>
              <h2 className="text-5xl font-serif font-bold mb-8">Glossary</h2>
              <p className="text-xl text-slate-500 mb-12 leading-relaxed max-w-lg">
                Standard terminology for navigating technical and strategic discussions in the generative AI space.
              </p>
              <div className="flex gap-6">
                <a href="https://www.ibm.com/topics/artificial-intelligence/glossary" target="_blank" rel="noopener noreferrer" className="btn-primary !px-8 !py-4 !text-base">IBM Glossary</a>
                <a href="https://developers.google.com/machine-learning/glossary" target="_blank" rel="noopener noreferrer" className="btn-secondary !px-8 !py-4 !text-base">Google ML</a>
              </div>
            </div>
            <div className="grid grid-cols-1 gap-6">
              {TERMS.map((t, i) => (
                <div key={i} className="p-8 bg-slate-50 rounded-[2rem] border border-slate-100 hover:border-fm-violet/30 transition-all group shadow-sm">
                  <h4 className="font-serif text-2xl font-bold mb-3 text-fm-violet group-hover:text-fm-blue transition-colors">{t.t}</h4>
                  <p className="text-lg text-slate-500 leading-relaxed group-hover:text-slate-700 transition-colors">{t.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </motion.div>
  );
};

const LinkedInFlyer = ({ onBack }: { onBack: () => void }) => {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="max-w-6xl mx-auto p-6"
    >
      <button 
        onClick={onBack}
        className="flex items-center gap-2 text-slate-400 hover:text-fm-blue transition-all mb-10 text-[10px] font-bold uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={16} />
        Back Home
      </button>

      <div className="bg-white text-slate-900 rounded-[3rem] overflow-hidden shadow-2xl relative border border-slate-200">
        {/* Background Accents */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-fm-violet/5 blur-[120px] rounded-full -mr-64 -mt-64" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/5 blur-[100px] rounded-full -ml-32 -mb-32" />

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 min-h-[800px]">
          {/* Left Side: Editorial Content */}
          <div className="p-16 flex flex-col justify-center border-r border-slate-100">
            <motion.div
              initial={{ x: -30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="inline-block px-6 py-2 bg-fm-violet/10 text-fm-violet text-xs font-bold uppercase tracking-[0.3em] rounded-full mb-10">
                The Future of Career Discovery
              </span>
              <h1 className="text-8xl md:text-9xl font-serif font-bold tracking-tighter leading-[0.88] mb-10 text-slate-900">
                Forward <br />
                <span className="text-fm-violet italic">Moves.</span>
              </h1>
              <p className="text-3xl text-slate-500 font-medium max-w-lg leading-relaxed mb-16">
                Your AI-powered command center for navigating the national job market.
              </p>

              <div className="space-y-8">
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <Search className="text-fm-violet" size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl text-slate-900">Google Search Grounding</h4>
                    <p className="text-base text-slate-500">Real-time job discovery across the USA.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <Zap className="text-fm-violet" size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl text-slate-900">AI Resume Optimization</h4>
                    <p className="text-base text-slate-500">Tailor your profile for every role in seconds.</p>
                  </div>
                </div>
                <div className="flex items-center gap-6">
                  <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center border border-slate-100 shadow-sm">
                    <TrendingUp className="text-fm-violet" size={32} />
                  </div>
                  <div>
                    <h4 className="font-bold text-2xl text-slate-900">SWOT Analysis</h4>
                    <p className="text-base text-slate-500">Strategic insights into every company & role.</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Side: Visual Showcase */}
          <div className="p-16 bg-slate-50/50 flex flex-col justify-center items-center relative overflow-hidden">
            <motion.div 
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="relative z-10 w-full max-w-md"
            >
              {/* Mock UI Elements */}
              <div className="space-y-8">
                <div className="glass-panel bg-white border-slate-200 p-8 transform -rotate-2 hover:rotate-0 transition-transform cursor-default shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 bg-fm-violet text-white rounded-2xl flex items-center justify-center font-bold text-xl">87%</div>
                    <div className="font-bold text-lg text-slate-900">Resume Match Score</div>
                  </div>
                  <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-fm-violet w-[87%] shadow-[0_0_20px_rgba(139,92,246,0.3)]" />
                  </div>
                </div>

                <div className="glass-panel bg-white border-slate-200 p-8 transform rotate-3 hover:rotate-0 transition-transform cursor-default ml-12 shadow-xl">
                  <div className="flex items-center gap-4 mb-4">
                    <CheckCircle2 className="text-emerald-500" size={24} />
                    <div className="font-bold text-lg text-slate-900">AI Revision Complete</div>
                  </div>
                  <p className="text-sm text-slate-500 italic leading-relaxed">"Updated bullet points to emphasize LLM orchestration and Python mastery..."</p>
                </div>

                <div className="glass-panel bg-white border-slate-200 p-8 transform -rotate-1 hover:rotate-0 transition-transform cursor-default mr-8 shadow-xl">
                  <div className="flex items-center gap-4 mb-6">
                    <TrendingUp className="text-fm-blue" size={24} />
                    <div className="font-bold text-lg text-slate-900">SWOT: Tech Lead @ Verizon</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="px-3 py-1.5 bg-emerald-50 text-emerald-600 text-xs font-bold uppercase rounded-lg border border-emerald-100 text-center">Strength: AI Scale</div>
                    <div className="px-3 py-1.5 bg-rose-50 text-rose-600 text-xs font-bold uppercase rounded-lg border border-rose-100 text-center">Threat: Market Comp</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Floating Icons */}
            <div className="absolute top-20 right-20 text-fm-violet/10 animate-pulse"><Compass size={80} /></div>
            <div className="absolute bottom-20 left-20 text-slate-200/50"><Briefcase size={120} /></div>
          </div>
        </div>

        {/* Footer of Flyer */}
        <div className="p-16 bg-slate-50 border-t border-slate-100 flex flex-col md:flex-row justify-between items-center gap-12">
          <div className="flex items-center gap-6">
            <div className="bg-fm-violet p-4 rounded-2xl shadow-lg shadow-fm-violet/20">
              <Search className="text-white" size={32} />
            </div>
            <div>
              <h3 className="font-bold text-2xl text-slate-900">Forward Moves USA</h3>
              <p className="text-base text-slate-500">Built with Gemini 3.1 Flash & Google Search</p>
            </div>
          </div>
          <div className="flex gap-6">
            <div className="px-8 py-4 bg-white text-fm-blue border border-slate-200 rounded-2xl font-bold text-base shadow-sm">
              #AI #CareerGrowth #TechJobs
            </div>
            <div className="px-8 py-4 border border-slate-200 rounded-2xl font-bold text-base text-slate-400">
              USA 2026
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center">
        <p className="text-blue-500 font-medium mb-4">Screenshot this flyer to share on LinkedIn!</p>
        <div className="flex justify-center gap-4">
          <button className="btn-primary flex items-center gap-2">
            <Copy size={18} />
            Copy App Link
          </button>
          <button onClick={onBack} className="btn-secondary">
            Back to App
          </button>
        </div>
      </div>
    </motion.div>
  );
};

const ResumeReviser = ({ job, onBack, initialResumeText }: { job: Job; onBack: () => void; initialResumeText: string }) => {
  const [resumeText, setResumeText] = useState(initialResumeText);
  const [revised, setRevised] = useState<RevisedResume | null>(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleRevise = async () => {
    if (!resumeText.trim()) return;
    setLoading(true);
    try {
      const result = await reviseResume(resumeText, job);
      setRevised(result);
    } catch (error) {
      console.error('Error revising resume:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    if (revised) {
      navigator.clipboard.writeText(revised.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const text = event.target?.result as string;
        setResumeText(text);
      };
      reader.readAsText(file);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto p-6"
    >
      <button 
        onClick={onBack}
        aria-label="Go back to home page"
        className="flex items-center gap-2 text-slate-400 hover:text-fm-blue transition-all mb-10 text-[10px] font-bold uppercase tracking-[0.2em]"
      >
        <ArrowLeft size={16} />
        Back Home
      </button>

      <div className="bg-white rounded-3xl shadow-xl overflow-hidden border border-blue-100">
        <div className="p-8 bg-gradient-to-br from-fm-blue to-indigo-600 text-white">
          <div className="flex items-center gap-4 mb-4">
            <div className="p-3 bg-white/10 rounded-2xl backdrop-blur-md">
              <Zap size={32} />
            </div>
            <div>
              <h2 className="text-3xl font-bold">AI Resume Reviser</h2>
              <p className="text-blue-50">
                Optimizing for {job.title} at{' '}
                <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                  {job.company}
                </a>
              </p>
            </div>
          </div>
        </div>

        <div className="p-8">
          {!revised ? (
            <div className="space-y-6">
                      <div className="p-6 bg-blue-50 rounded-2xl border-2 border-dashed border-blue-200 hover:border-fm-violet transition-all">
                <div className="flex flex-col items-center justify-center text-center">
                  <FileText className="text-blue-300 mb-4" size={48} />
                  <h3 className="text-lg font-bold text-blue-700 mb-2">Upload Your Resume</h3>
                  <p className="text-sm text-blue-500 mb-4">Upload a .txt file or paste your resume text below.</p>
                  <input 
                    type="file" 
                    accept=".txt" 
                    onChange={handleFileUpload}
                    className="hidden" 
                    id="resume-upload-reviser" 
                  />
                  <label 
                    htmlFor="resume-upload-reviser"
                    className="px-6 py-2 bg-white border border-blue-200 rounded-xl font-bold text-sm text-blue-700 hover:bg-blue-50 cursor-pointer transition-all shadow-sm"
                  >
                    Select File
                  </label>
                </div>
              </div>

              <div>
                <label 
                  htmlFor="resume-reviser-text"
                  className="block text-sm font-bold text-blue-700 uppercase tracking-wider mb-2"
                >
                  Resume Content
                </label>
                <textarea
                  id="resume-reviser-text"
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume here..."
                  className="w-full h-64 p-4 rounded-2xl border-2 border-blue-100 focus:border-fm-violet focus:ring-0 transition-all resize-none font-sans text-blue-700"
                />
              </div>
              <button
                onClick={handleRevise}
                disabled={loading || !resumeText.trim()}
                aria-live="polite"
                className="w-full py-4 bg-fm-violet text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-3 shadow-lg shadow-indigo-200"
              >
                {loading ? (
                  <>
                    <Loader2 className="animate-spin" size={24} />
                    Revising Your Resume...
                  </>
                ) : (
                  <>
                    <Zap size={24} />
                    Revise Resume for this Role
                  </>
                )}
              </button>
            </div>
          ) : (
            <div className="space-y-10">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold text-indigo-900">Your Revised Resume</h3>
                <button 
                  onClick={copyToClipboard}
                  className="flex items-center gap-2 px-4 py-2 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-xl transition-all font-bold text-sm"
                >
                  {copied ? <Check size={18} className="text-emerald-600" /> : <Copy size={18} />}
                  {copied ? 'Copied!' : 'Copy to Clipboard'}
                </button>
              </div>

              <div className="p-10 bg-blue-50 rounded-[2rem] border border-blue-100 font-serif text-indigo-900 text-xl leading-relaxed whitespace-pre-wrap shadow-inner">
                <Markdown>{revised.content}</Markdown>
              </div>

              <div className="space-y-8">
                <h4 className="text-2xl font-bold text-indigo-900 flex items-center gap-3">
                  <CheckCircle2 className="text-emerald-500" size={32} />
                  Changes & Reasoning
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {revised.revisions.map((rev, i) => (
                    <div key={i} className="p-6 rounded-[2rem] bg-white border border-blue-100 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-xs font-bold text-fm-violet uppercase tracking-[0.2em] mb-2">{rev.section}</div>
                      <div className="text-lg font-bold text-indigo-900 mb-3">{rev.change}</div>
                      <p className="text-sm text-blue-500 italic leading-relaxed">{rev.reason}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-8 rounded-[2rem] bg-indigo-50 border border-indigo-100 shadow-sm">
                <h4 className="text-xs font-bold text-indigo-800 uppercase tracking-[0.2em] mb-6">Suggested Keywords to Include</h4>
                <div className="flex flex-wrap gap-3">
                  {revised.suggestedKeywords.map((keyword, i) => (
                    <span key={i} className="px-4 py-2 bg-white text-indigo-700 rounded-xl text-sm font-bold border border-indigo-100 shadow-sm">
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>

              <button
                onClick={() => setRevised(null)}
                className="w-full py-4 border-2 border-blue-200 text-blue-500 rounded-2xl font-bold hover:bg-blue-50 transition-all"
              >
                Start Over with New Details
              </button>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

const SWOTModal = ({ job, onClose }: { job: Job; onClose: () => void }) => {
  const [analysis, setAnalysis] = useState<SWOTAnalysis | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSWOT = async () => {
      const data = await generateSWOT(job);
      setAnalysis(data);
      setLoading(false);
    };
    fetchSWOT();
  }, [job]);

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-indigo-600/40 backdrop-blur-sm"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="p-6 border-b flex justify-between items-center bg-fm-blue text-white">
          <div>
            <h2 className="text-2xl font-bold">SWOT Analysis</h2>
            <p className="text-blue-100 text-sm">
              {job.title} @{' '}
              <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">
                {job.company}
              </a>
            </p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-8">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-64 space-y-4">
              <Loader2 className="animate-spin text-fm-blue" size={48} />
              <p className="text-blue-500 font-medium">
              Analyzing job market data for{' '}
              <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="text-fm-blue underline hover:text-blue-600 transition-colors">
                {job.company}
              </a>...
            </p>
            </div>
          ) : analysis ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="p-8 rounded-2xl bg-emerald-50 border border-emerald-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-emerald-700">
                  <TrendingUp size={24} />
                  <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Strengths</h3>
                </div>
                <ul className="space-y-4">
                  {analysis.strengths.map((s, i) => (
                    <li key={i} className="flex gap-3 text-blue-700 text-base leading-relaxed">
                      <span className="text-emerald-500 font-bold text-xl">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-rose-50 border border-rose-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-rose-700">
                  <AlertCircle size={24} />
                  <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Weaknesses</h3>
                </div>
                <ul className="space-y-4">
                  {analysis.weaknesses.map((s, i) => (
                    <li key={i} className="flex gap-3 text-blue-700 text-base leading-relaxed">
                      <span className="text-rose-500 font-bold text-xl">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-amber-50 border border-amber-100 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-amber-700">
                  <Lightbulb size={24} />
                  <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Opportunities</h3>
                </div>
                <ul className="space-y-4">
                  {analysis.opportunities.map((s, i) => (
                    <li key={i} className="flex gap-3 text-blue-700 text-base leading-relaxed">
                      <span className="text-amber-500 font-bold text-xl">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-8 rounded-2xl bg-blue-50 border border-blue-200 shadow-sm">
                <div className="flex items-center gap-3 mb-6 text-blue-700">
                  <Shield size={24} />
                  <h3 className="font-bold uppercase tracking-[0.2em] text-xs">Threats</h3>
                </div>
                <ul className="space-y-4">
                  {analysis.threats.map((s, i) => (
                    <li key={i} className="flex gap-3 text-blue-700 text-base leading-relaxed">
                      <span className="text-blue-500 font-bold text-xl">•</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : null}
        </div>
        
        <div className="p-6 border-t bg-blue-50 flex justify-end">
          <button onClick={onClose} className="px-8 py-3 bg-fm-blue text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-lg shadow-blue-200">Close Analysis</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ComparisonTable = ({ jobs, onRemove, onGoHome }: { jobs: Job[]; onRemove: (id: string) => void; onGoHome: () => void }) => {
  if (jobs.length === 0) {
    return (
      <div className="p-20 text-center glass-panel bg-white border-slate-200 shadow-lg rounded-[2.5rem]">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
          <TableIcon size={40} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">No jobs selected for comparison</h3>
        <p className="text-slate-400 mb-8 max-w-md mx-auto font-light">Add jobs from the home page by clicking the "Compare" icon on any job card to see them side-by-side.</p>
        <button 
          onClick={onGoHome}
          className="px-10 py-5 bg-fm-blue text-white rounded-full text-[10px] font-bold uppercase tracking-[0.2em] hover:bg-blue-700 transition-all shadow-2xl shadow-blue-900/10"
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto glass-panel rounded-3xl border-blue-100">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="bg-blue-50/50 border-b border-blue-100">
            <th className="p-6 font-bold text-blue-500 uppercase tracking-widest text-xs">Feature</th>
            {jobs.map(job => (
              <th key={job.id} className="p-6 font-bold text-indigo-900 min-w-[250px]">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="text-fm-blue font-bold text-lg mb-1">
                      <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="hover:underline flex items-center gap-2">
                        {job.company}
                        <ExternalLink size={14} />
                      </a>
                    </div>
                    <div className="text-sm text-blue-500 font-medium truncate max-w-[180px]">{job.title}</div>
                  </div>
                  <button 
                    onClick={() => onRemove(job.id)}
                    className="p-2 hover:bg-rose-100 text-rose-500 rounded-xl transition-all shadow-sm"
                  >
                    <Minus size={20} />
                  </button>
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          <tr className="border-b border-blue-50">
            <td className="p-6 font-bold text-blue-400 bg-blue-50/30 text-xs uppercase tracking-widest">Salary</td>
            {jobs.map(job => (
              <td key={job.id} className="p-6 text-base font-bold text-emerald-600 font-mono">{job.salary || 'N/A'}</td>
            ))}
          </tr>
          <tr className="border-b border-blue-50">
            <td className="p-6 font-bold text-blue-400 bg-blue-50/30 text-xs uppercase tracking-widest">Location</td>
            {jobs.map(job => (
              <td key={job.id} className="p-6 text-base text-blue-700 font-medium">{job.location}</td>
            ))}
          </tr>
          <tr className="border-b border-blue-50">
            <td className="p-6 font-bold text-blue-400 bg-blue-50/30 text-xs uppercase tracking-widest">Tech Stack</td>
            {jobs.map(job => (
              <td key={job.id} className="p-6">
                <div className="flex flex-wrap gap-2">
                  {job.techStack?.map((tech, i) => (
                    <span key={i} className="px-3 py-1 bg-blue-50 text-blue-600 text-xs rounded-lg font-bold border border-blue-100">
                      {tech}
                    </span>
                  ))}
                </div>
              </td>
            ))}
          </tr>
          <tr>
            <td className="p-6 font-bold text-blue-400 bg-blue-50/30 text-xs uppercase tracking-widest">Action</td>
            {jobs.map(job => (
              <td key={job.id} className="p-6">
                <a 
                  href={job.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-fm-blue hover:text-blue-800 font-bold text-base flex items-center gap-2 transition-colors"
                >
                  View Listing <ExternalLink size={18} />
                </a>
              </td>
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};

const TrustComplianceFramework = () => (
  <section className="py-24 px-8 bg-slate-50 border-y border-slate-200">
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row items-center gap-20">
        <div className="lg:w-1/2">
          <div className="inline-flex items-center gap-3 px-4 py-2 bg-emerald-100 text-emerald-700 rounded-full mb-8">
            <Shield size={16} />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Trust & Compliance</span>
          </div>
          <h2 className="text-5xl font-serif font-bold text-slate-900 mb-8 leading-tight">Built for <span className="text-fm-blue">Scale</span> and <span className="text-fm-violet">Trust</span></h2>
          <p className="text-xl text-slate-500 leading-relaxed mb-10">
            Forward Moves is committed to the highest standards of data privacy and ethical AI. Our platform is designed to be a trusted partner in your career transition.
          </p>
          
          <div className="space-y-6">
            {[
              { title: "Data Anonymization", desc: "We encourage users to remove PII before analysis. Our models focus on skills, not identities.", icon: <UserCheck className="text-fm-blue" /> },
              { title: "Ethical AI Principles", desc: "Our algorithms are regularly audited for bias to ensure fair and equitable job matching.", icon: <Scale className="text-fm-violet" /> },
              { title: "Transparent Processing", desc: "Clear disclaimers and explanations for every AI-generated insight and recommendation.", icon: <Eye className="text-indigo-600" /> }
            ].map((item, i) => (
              <div key={i} className="flex gap-6 p-6 bg-white rounded-3xl border border-slate-100 shadow-sm">
                <div className="flex-shrink-0 w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center">
                  {item.icon}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 mb-1">{item.title}</h3>
                  <p className="text-sm text-slate-500 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="lg:w-1/2 grid grid-cols-2 gap-8">
          <div className="space-y-8">
            <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl text-center">
              <div className="text-4xl font-serif font-bold text-fm-blue mb-2">100%</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Encrypted Data</div>
            </div>
            <div className="p-8 bg-fm-blue text-white rounded-[3rem] shadow-2xl shadow-fm-blue/20 text-center">
              <div className="text-4xl font-serif font-bold mb-2">SOC2</div>
              <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Compliance Ready</div>
            </div>
          </div>
          <div className="space-y-8 mt-12">
            <div className="p-8 bg-fm-violet text-white rounded-[3rem] shadow-2xl shadow-fm-violet/20 text-center">
              <div className="text-4xl font-serif font-bold mb-2">GDPR</div>
              <div className="text-[10px] font-bold opacity-70 uppercase tracking-widest">Privacy Standards</div>
            </div>
            <div className="p-8 bg-white rounded-[3rem] border border-slate-100 shadow-xl text-center">
              <div className="text-4xl font-serif font-bold text-fm-violet mb-2">24/7</div>
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Security Monitoring</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const PlatformSuccessStories = () => (
  <section className="py-24 px-8 bg-white overflow-hidden">
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-20">
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-fm-violet mb-4 block">Real Impact</span>
        <h2 className="text-5xl font-serif font-bold text-slate-900 mb-6">Success Stories</h2>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto leading-relaxed">
          See how Forward Moves is helping professionals transition into high-growth AI careers.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {[
          {
            name: "Sarah J.",
            role: "AI Product Manager",
            prev: "Traditional Marketing",
            story: "The Resume Matcher helped me realize I already had 80% of the skills needed for AI product roles. I just needed to translate my experience.",
            img: "https://picsum.photos/seed/sarah/200/200"
          },
          {
            name: "Marcus T.",
            role: "Solutions Architect",
            prev: "IT Support",
            story: "The Reskilling Portal gave me a clear path. Within 3 months, I mastered the foundations and landed a role at a top AI startup.",
            img: "https://picsum.photos/seed/marcus/200/200"
          }
        ].map((item, i) => (
          <div key={i} className="p-12 bg-slate-50 rounded-[3.5rem] border border-slate-100 relative group hover:bg-white hover:shadow-2xl transition-all duration-500">
            <Quote className="absolute top-10 right-10 text-slate-200 group-hover:text-fm-blue/20 transition-colors" size={64} />
            <div className="flex items-center gap-6 mb-8">
              <img src={item.img} alt={item.name} className="w-20 h-20 rounded-3xl object-cover shadow-lg" referrerPolicy="no-referrer" />
              <div>
                <h3 className="text-2xl font-bold text-slate-900">{item.name}</h3>
                <p className="text-fm-blue font-bold text-sm">{item.role}</p>
                <p className="text-slate-400 text-xs uppercase tracking-widest mt-1">Formerly: {item.prev}</p>
              </div>
            </div>
            <p className="text-xl text-slate-600 leading-relaxed italic">"{item.story}"</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

const FeedbackSection = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '', allowContact: false });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        setSubmitted(true);
        setTimeout(() => setSubmitted(false), 5000);
        setFormData({ name: '', email: '', message: '', allowContact: false });
      }
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  return (
    <section className="py-24 px-8 bg-slate-50 border-t border-slate-200">
      <div className="max-w-4xl mx-auto text-center">
        <div className="inline-block p-4 bg-fm-blue/10 rounded-3xl mb-8">
          <MessageSquare className="text-fm-blue" size={32} />
        </div>
        <h2 className="text-5xl font-serif font-bold text-slate-900 mb-6">We Value Your Feedback</h2>
        <p className="text-xl text-slate-600 mb-12 max-w-2xl mx-auto">
          Help us improve Forward Moves USA and get better results from your job search.
        </p>

        <div className="glass-panel bg-white p-10 shadow-xl rounded-[2rem] text-left">
          {submitted ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="py-12 text-center"
            >
              <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="text-emerald-500" size={40} />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Thank You!</h3>
              <p className="text-slate-500 italic">Your feedback has been sent privately.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="feedback-name" className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Name</label>
                  <input 
                    id="feedback-name"
                    type="text" 
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    placeholder="Your name"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-fm-blue/20 focus:border-fm-blue outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="feedback-email" className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Email</label>
                  <input 
                    id="feedback-email"
                    type="email" 
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    placeholder="your@email.com"
                    className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-fm-blue/20 focus:border-fm-blue outline-none transition-all"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="feedback-message" className="text-sm font-bold text-slate-400 uppercase tracking-widest ml-1">Message</label>
                <textarea 
                  id="feedback-message"
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({...formData, message: e.target.value})}
                  placeholder="What worked well? What didn't? Any suggestions?"
                  rows={4}
                  className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-fm-blue/20 focus:border-fm-blue outline-none transition-all resize-none"
                />
                <p className="text-xs text-slate-400 mt-2 ml-1 italic">
                  Did your match score improve or did you gain new insights? Tell us!
                </p>
              </div>
              
              <div className="flex items-center gap-3 px-2">
                <input 
                  type="checkbox" 
                  id="allowContact"
                  checked={formData.allowContact}
                  onChange={(e) => setFormData({...formData, allowContact: e.target.checked})}
                  className="w-5 h-5 rounded border-slate-300 text-fm-blue focus:ring-fm-blue/20 cursor-pointer"
                />
                <label htmlFor="allowContact" className="text-sm text-slate-600 cursor-pointer select-none">
                  I’m open to being contacted for follow-up or feedback
                </label>
              </div>

              <button 
                type="submit"
                className="w-full py-5 bg-fm-blue text-white rounded-2xl font-bold text-lg hover:bg-blue-700 active:scale-[0.98] transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-3"
              >
                Share Feedback
                <Send size={20} />
              </button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState<Job[]>([]);
  const [activeSWOT, setActiveSWOT] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'home' | 'comparison' | 'resume-matcher' | 'resume-reviser' | 'interview-prep' | 'cover-letter' | 'reskilling'>('home');
  const [matchingJob, setMatchingJob] = useState<Job | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [homeTab, setHomeTab] = useState<'start' | 'discover' | 'labs' | 'insights' | 'reskilling'>('start');

  const fetchJobs = async (query?: string) => {
    setLoading(true);
    const data = await searchJobs(query);
    setJobs(data);
    setLoading(false);
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      // Specifically search for Newark and Jersey City roles to fulfill user request
      const data = await searchJobs("AI and IT job openings in USA");
      setJobs(data);
      
      // Automatically add Prudential Newark and a Jersey City AI role to comparison
      const prudential = data.find(j => 
        j.company.toLowerCase().includes('prudential') && 
        j.location.toLowerCase().includes('newark')
      );
      const jerseyCity = data.find(j => 
        j.location.toLowerCase().includes('jersey city')
      );
      
      const initialComparison: Job[] = [];
      if (prudential) initialComparison.push(prudential);
      if (jerseyCity && jerseyCity.id !== prudential?.id) initialComparison.push(jerseyCity);
      
      if (initialComparison.length > 1) {
        setSelectedForComparison(initialComparison);
        setView('comparison');
      } else if (initialComparison.length > 0) {
        setSelectedForComparison(initialComparison);
      }
      
      setLoading(false);
    };
    init();
  }, []);

  const toggleComparison = (job: Job) => {
    if (selectedForComparison.find(j => j.id === job.id)) {
      setSelectedForComparison(prev => prev.filter(j => j.id !== job.id));
    } else {
      if (selectedForComparison.length >= 4) {
        alert("You can compare up to 4 jobs at a time.");
        return;
      }
      setSelectedForComparison(prev => [...prev, job]);
    }
  };

  const handleMatchJob = (job: Job) => {
    setMatchingJob(job);
    setView('resume-matcher');
  };

  const companyStats = React.useMemo(() => {
    const stats: Record<string, number> = {};
    jobs.forEach(job => {
      stats[job.company] = (stats[job.company] || 0) + 1;
    });
    return Object.entries(stats)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [jobs]);

  return (
    <div className="min-h-screen flex flex-col bg-white text-slate-900">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-100 py-2 px-8 text-center">
        <p className="text-xs text-amber-800 font-medium">
          <strong>Sample Disclaimer:</strong> "Forward Moves AI is currently in its community-testing phase. To protect your privacy, please remove personal contact information (phone, home address) from your resume before uploading. Data shared during this test phase may be used to improve the underlying AI model."
        </p>
      </div>

      {/* Header */}
      <header className="bg-white py-10 px-12 border-b border-slate-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-fm-blue rounded-2xl flex items-center justify-center text-white font-bold text-xl" aria-hidden="true">F.</div>
              <h1 className="text-xl font-bold tracking-tighter text-slate-900 hidden sm:block">Forward Moves</h1>
            </div>
            
            <nav className="hidden lg:flex items-center gap-10" aria-label="Main navigation">
              <button 
                onClick={() => { setView('home'); setHomeTab('start'); }} 
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group py-2 ${(view === 'home' || view === 'resume-matcher' || view === 'resume-reviser' || view === 'interview-prep' || view === 'cover-letter') && homeTab !== 'reskilling' ? 'text-fm-blue' : 'text-slate-400 hover:text-fm-blue'}`}
                aria-current={(view === 'home' || view === 'resume-matcher' || view === 'resume-reviser' || view === 'interview-prep' || view === 'cover-letter') && homeTab !== 'reskilling' ? 'page' : undefined}
              >
                Home
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-fm-blue transition-all duration-300 ${(view === 'home' || view === 'resume-matcher' || view === 'resume-reviser' || view === 'interview-prep' || view === 'cover-letter') && homeTab !== 'reskilling' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'}`} />
              </button>
              <button 
                onClick={() => setView('comparison')} 
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group py-2 ${view === 'comparison' ? 'text-fm-blue' : 'text-slate-400 hover:text-fm-blue'}`}
                aria-current={view === 'comparison' ? 'page' : undefined}
              >
                Comparison
                {selectedForComparison.length > 0 && (
                  <span className="absolute -top-1 -right-4 bg-fm-violet text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                    {selectedForComparison.length}
                  </span>
                )}
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-fm-blue transition-all duration-300 ${view === 'comparison' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'}`} />
              </button>
              <button 
                onClick={() => { setView('home'); setHomeTab('reskilling'); }} 
                className={`text-[10px] font-bold uppercase tracking-[0.2em] transition-all relative group py-2 ${view === 'home' && homeTab === 'reskilling' ? 'text-fm-blue' : 'text-slate-400 hover:text-fm-blue'}`}
                aria-current={view === 'home' && homeTab === 'reskilling' ? 'page' : undefined}
              >
                Reskilling
                <span className={`absolute bottom-0 left-0 w-full h-0.5 bg-fm-blue transition-all duration-300 ${view === 'home' && homeTab === 'reskilling' ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0 group-hover:opacity-50 group-hover:scale-x-100'}`} />
              </button>
            </nav>
          </div>

          <div className="flex items-center gap-8">
            {/* Login and Get Started removed per user request */}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        
        {view === 'resume-matcher' && matchingJob ? (
          <ResumeMatcher job={matchingJob} onBack={() => setView('home')} initialResumeText={resumeText} />
        ) : view === 'resume-reviser' && matchingJob ? (
          <ResumeReviser job={matchingJob} onBack={() => setView('home')} initialResumeText={resumeText} />
        ) : view === 'interview-prep' && matchingJob ? (
          <InterviewPrepView job={matchingJob} onBack={() => setView('home')} />
        ) : view === 'cover-letter' && matchingJob ? (
          <CoverLetterDrafter job={matchingJob} onBack={() => setView('home')} initialResumeText={resumeText} />
        ) : view === 'home' ? (
          <>
            <LandingSection />
            
            <QuickStartGuide 
              onStart={() => {
                setHomeTab('start');
                setTimeout(() => {
                  const el = document.getElementById('portal-content-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }} 
              onSetTab={(tab) => {
                setHomeTab(tab);
                setTimeout(() => {
                  const el = document.getElementById('portal-content-section');
                  el?.scrollIntoView({ behavior: 'smooth' });
                }, 100);
              }}
              onSetView={setView}
            />

            <div id="portal-content-section" className="scroll-mt-20">
              <AnimatePresence mode="wait">
              {homeTab === 'start' && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <ResumeSetup onSet={(text) => {
                    setResumeText(text);
                    setHomeTab('discover');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} currentResume={resumeText} />
                  <FeedbackSection />
                </motion.div>
              )}

              {homeTab === 'discover' && (
                <motion.div
                  key="discover"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-16"
                >
                  {/* Dashboard Stats */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 glass-panel p-8 bg-white border-slate-200 shadow-lg">
                      <div className="flex justify-between items-center mb-8">
                        <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-3">
                          <TrendingUp className="text-fm-blue" size={24} />
                          Market Insights
                        </h2>
                        <span className="text-xs font-mono text-slate-400 uppercase tracking-widest">Real-time Data</span>
                      </div>
                      <div className="h-[300px] w-full">
                        {loading ? (
                          <div className="h-full flex items-center justify-center">
                            <Loader2 className="animate-spin text-blue-300" size={32} />
                          </div>
                        ) : (
                          <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={companyStats} layout="vertical" margin={{ left: 40, right: 40 }}>
                              <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#f1f5f9" />
                              <XAxis type="number" hide />
                              <YAxis 
                                dataKey="name" 
                                type="category" 
                                axisLine={false} 
                                tickLine={false}
                                tick={{ fontSize: 12, fontWeight: 500, fill: '#64748b' }}
                              />
                              <Tooltip 
                                cursor={{ fill: '#f8fafc' }}
                                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                              />
                              <Bar dataKey="count" radius={[0, 6, 6, 0]} barSize={32}>
                                {companyStats.map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={index === 0 ? '#1e40af' : '#3b82f6'} />
                                ))}
                              </Bar>
                            </BarChart>
                          </ResponsiveContainer>
                        )}
                      </div>
                    </div>

                    <div className="glass-panel p-8 flex flex-col justify-between bg-fm-blue text-white border-none shadow-xl relative overflow-hidden">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16" />
                      <div className="relative z-10">
                        <div className="flex justify-between items-start mb-4">
                          <h2 className="text-3xl font-serif font-bold">Summary</h2>
                          <span className="flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-emerald-300 bg-white/10 px-3 py-1 rounded-full border border-white/10">
                            <CheckCircle2 size={12} /> Verified
                          </span>
                        </div>
                        <p className="text-blue-100 text-sm mb-8 leading-relaxed">New AI roles detected across the USA this week.</p>
                        
                        <div className="space-y-6">
                          <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Total Openings</span>
                            <span className="text-3xl font-serif font-bold">{jobs.length}</span>
                          </div>
                          <div className="flex items-center justify-between p-4 bg-white/10 rounded-2xl border border-white/10">
                            <span className="text-xs font-bold uppercase tracking-widest text-blue-200">Top Tech</span>
                            <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">Python, LLMs</span>
                          </div>
                        </div>
                      </div>
                      
                      <button 
                        onClick={() => setHomeTab('insights')}
                        className="mt-8 w-full py-4 bg-white text-fm-blue rounded-xl text-xs font-bold uppercase tracking-widest transition-all shadow-lg hover:bg-blue-50"
                      >
                        Deep Dive Analysis
                      </button>
                    </div>
                  </div>

                  {/* Job Listings Section */}
                  <div className="space-y-12">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h2 className="text-3xl font-serif font-bold text-slate-900 flex items-center gap-3 mb-2">
                          <Briefcase className="text-fm-blue" size={28} />
                          National Job Listings
                        </h2>
                        <p className="text-slate-500 text-base">New AI roles detected across the USA this week.</p>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
                        <div className="relative flex-1 sm:w-80">
                          <label htmlFor="job-search-input" className="sr-only">Search roles or companies</label>
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} aria-hidden="true" />
                          <input 
                            id="job-search-input"
                            type="text" 
                            placeholder="Search roles, companies..." 
                            className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white border border-slate-200 focus:ring-4 focus:ring-fm-blue/10 outline-none transition-all text-sm font-medium"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && fetchJobs(searchQuery)}
                          />
                        </div>
                        <button 
                          onClick={() => fetchJobs(searchQuery)}
                          disabled={loading}
                          aria-label="Search jobs"
                          className="btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-sm shadow-lg shadow-fm-deep/10"
                        >
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                          Search
                        </button>
                      </div>
                    </div>

                    {/* Tool Descriptions */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
                      {[
                        { label: 'Match', color: 'bg-fm-blue/10 text-fm-blue', desc: 'Compare your resume against the job description to see your compatibility score and keyword gaps.' },
                        { label: 'Revise', color: 'bg-fm-violet/10 text-fm-violet', desc: 'Automatically optimize your resume bullet points to better align with this specific role\'s requirements.' },
                        { label: 'Letter', color: 'bg-teal-50 text-teal-700', desc: 'Generate a tailored cover letter that highlights your most relevant experiences for this position.' },
                        { label: 'Interview Tips', color: 'bg-indigo-50 text-indigo-700', desc: 'Get AI-generated practice questions and strategic advice based on the job\'s core competencies.' },
                        { label: 'SWOT Analysis', color: 'bg-blue-50 text-fm-blue', desc: 'Analyze the Strengths, Weaknesses, Opportunities, and Threats of your profile relative to this job.' }
                      ].map((tool, i) => (
                        <div key={i} className="p-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
                          <div className={`inline-block px-2 py-1 rounded-lg text-[8px] font-bold uppercase tracking-widest mb-2 ${tool.color}`}>
                            {tool.label}
                          </div>
                          <p className="text-[10px] text-slate-500 leading-relaxed">{tool.desc}</p>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                      {loading ? (
                        Array.from({ length: 6 }).map((_, i) => (
                          <div key={i} className="h-[450px] glass-panel animate-pulse bg-slate-50 rounded-3xl border border-slate-100" />
                        ))
                      ) : jobs.length > 0 ? (
                        jobs.map((job) => (
                          <JobCard 
                            key={job.id} 
                            job={job} 
                            onMatch={handleMatchJob}
                            onRevise={(j) => { setMatchingJob(j); setView('resume-reviser'); }}
                            onLetter={(j) => { setMatchingJob(j); setView('cover-letter'); }}
                            onPrep={(j) => { setMatchingJob(j); setView('interview-prep'); }}
                            onSWOT={setActiveSWOT}
                            onCompare={toggleComparison}
                            isSelected={!!selectedForComparison.find(j => j.id === job.id)}
                          />
                        ))
                      ) : (
                        <div className="col-span-full py-32 text-center bg-white rounded-3xl border border-dashed border-slate-200">
                          <Search size={48} className="mx-auto text-slate-200 mb-6" />
                          <h3 className="text-xl font-serif font-bold text-slate-900 mb-2">No jobs found</h3>
                          <p className="text-slate-500">Try adjusting your search terms or check back later.</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Floating Comparison Bar */}
                  <AnimatePresence>
                    {selectedForComparison.length > 0 && (
                      <motion.div 
                        initial={{ y: 100, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: 100, opacity: 0 }}
                        className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 w-full max-w-2xl px-4"
                      >
                        <div className="bg-fm-blue/90 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-6">
                          <div className="flex items-center gap-4 overflow-hidden">
                            <div className="flex -space-x-3">
                              {selectedForComparison.map((job, i) => (
                                <div key={job.id} className="w-10 h-10 rounded-full bg-fm-blue border-2 border-slate-900 flex items-center justify-center text-[10px] font-bold text-white shadow-lg">
                                  {job.company.substring(0, 2).toUpperCase()}
                                </div>
                              ))}
                            </div>
                            <div className="hidden sm:block">
                              <p className="text-white font-bold text-sm">{selectedForComparison.length} Job{selectedForComparison.length > 1 ? 's' : ''} Selected</p>
                              <p className="text-slate-400 text-[10px] uppercase tracking-widest font-bold">Ready for comparison</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <button 
                              onClick={() => setSelectedForComparison([])}
                              className="px-4 py-2 text-slate-400 hover:text-white text-xs font-bold uppercase tracking-widest transition-colors"
                            >
                              Clear
                            </button>
                            <button 
                              onClick={() => setView('comparison')}
                              className="px-8 py-3 bg-fm-blue text-white rounded-2xl text-xs font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-lg shadow-fm-blue/20 flex items-center gap-2"
                            >
                              Compare Now <ArrowRight size={14} />
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {homeTab === 'insights' && (
                <motion.div
                  key="insights"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-20"
                >
                  <SkillGapAnalyzer resumeText={resumeText} jobs={jobs} />
                  <MarketTrendTracker jobs={jobs} />
                  <TrustComplianceFramework />
                  <PlatformSuccessStories />
                  <LabPhilosophy />
                  <FutureOutlook />
                </motion.div>
              )}

              {homeTab === 'reskilling' && (
                <motion.div
                  key="reskilling"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                >
                  <ReskillingView />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-slate-900 tracking-tighter">Job Comparison</h2>
              <button onClick={() => setView('home')} className="text-slate-400 hover:text-fm-blue text-[10px] font-bold uppercase tracking-[0.2em] flex items-center gap-2 transition-all">
                <ArrowLeft size={14} />
                Back Home
              </button>
            </div>
            <ComparisonTable 
              jobs={selectedForComparison} 
              onRemove={(id) => setSelectedForComparison(prev => prev.filter(j => j.id !== id))} 
              onGoHome={() => setView('home')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white py-32 px-12 border-t border-slate-50">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start gap-20">
          <div className="max-w-sm">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-8 h-8 bg-fm-blue rounded-xl flex items-center justify-center text-white font-bold text-sm">F.</div>
              <span className="text-slate-900 font-bold text-xl tracking-tighter">Forward Moves</span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed font-light">
              Empowering job seekers nationwide with AI-driven insights and curated career resources.
            </p>
          </div>
          
          <div className="grid grid-cols-2 gap-20">
            <div>
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-8">Technology</h4>
              <ul className="space-y-4">
                <li className="text-slate-400 text-xs font-light">Google Search</li>
                <li className="text-slate-400 text-xs font-light">Gemini 3.1 Flash</li>
              </ul>
            </div>
            <div>
              <h4 className="text-[10px] font-bold text-slate-900 uppercase tracking-[0.2em] mb-8">Legal</h4>
              <ul className="space-y-4">
                <li className="text-slate-400 text-xs font-light">Privacy Policy</li>
                <li className="text-slate-400 text-xs font-light">Terms of Service</li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="max-w-7xl mx-auto mt-32 pt-12 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-300">
            &copy; 2026 Forward Moves USA.
          </div>
          <div className="flex gap-8">
            <TrendingUp size={16} className="text-slate-200" />
            <Shield size={16} className="text-slate-200" />
          </div>
        </div>
      </footer>

      {/* Modals */}
      <AnimatePresence>
        {activeSWOT && (
          <SWOTModal job={activeSWOT} onClose={() => setActiveSWOT(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
