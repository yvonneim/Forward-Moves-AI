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
  FlaskConical
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Job, SWOTAnalysis, ResumeMatch, InterviewPrep, CoverLetter, RevisedResume } from './types';
import { searchJobs, generateSWOT } from './services/jobService';
import { matchResumeToJob, reviseResume } from './services/resumeService';
import { generateInterviewPrep, generateCoverLetter } from './services/applicationService';
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
  Check
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
  <div className="glass-panel bg-white border-none shadow-2xl mb-12 overflow-hidden relative min-h-[500px] flex items-center rounded-[3rem]">
    <div className="absolute top-0 right-0 w-full h-full">
      <img 
        src="https://images.unsplash.com/photo-1552664730-d307ca884978?auto=format&fit=crop&q=80&w=2070" 
        alt="Happy Career Success" 
        className="w-full h-full object-cover opacity-20 scale-105"
        referrerPolicy="no-referrer"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_50%,rgba(59,130,246,0.1),transparent_50%)]" />
    </div>
    
    <div className="relative z-10 p-16 max-w-4xl">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center gap-3 mb-8">
          <span className="inline-block px-4 py-1.5 bg-fm-blue/10 text-fm-blue text-[10px] font-bold uppercase tracking-[0.4em] rounded-full border border-fm-blue/10 backdrop-blur-md">
            Your Bright Future
          </span>
          <div className="h-px w-12 bg-fm-blue/20" />
        </div>
        
        <h2 className="text-7xl font-serif font-bold text-slate-900 mb-8 leading-[1.1] tracking-tight">
          Step Into Your <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-fm-blue via-fm-violet to-fm-blue bg-[length:200%_auto] animate-gradient italic">
            Next Great Chapter.
          </span>
        </h2>
        
        <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl font-light">
          USA Job Scout is your bridge to a more fulfilling career. We connect your unique 
          talents to the most exciting opportunities in the AI-driven workforce. 
          Let's build your success story together.
        </p>
        
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <button 
            onClick={() => {
              const el = document.getElementById('resume-upload-section');
              el?.scrollIntoView({ behavior: 'smooth' });
            }}
            className="w-full sm:w-auto px-10 py-5 bg-slate-900 text-white rounded-2xl font-bold text-lg hover:scale-105 transition-all shadow-2xl shadow-slate-900/10 flex items-center justify-center gap-3"
          >
            Start Your Journey
            <ArrowRight size={20} />
          </button>
          <div className="flex items-center gap-3 px-6 py-3 bg-slate-100 rounded-2xl border border-slate-200">
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">500+ Scouts Active Now</p>
          </div>
        </div>
      </motion.div>
    </div>

    {/* Decorative Elements */}
    <div className="absolute bottom-0 right-0 p-12 hidden lg:block">
      <div className="flex flex-col items-end gap-2">
        <div className="w-32 h-1 bg-gradient-to-l from-fm-blue to-transparent rounded-full opacity-50" />
        <div className="w-48 h-1 bg-gradient-to-l from-fm-violet to-transparent rounded-full opacity-30" />
        <div className="w-24 h-1 bg-gradient-to-l from-fm-blue to-transparent rounded-full opacity-20" />
      </div>
    </div>
  </div>
);

const QuickStartGuide = ({ onStart, onSetTab }: { onStart: () => void; onSetTab: (tab: 'start' | 'discover' | 'labs' | 'insights') => void }) => (
  <div className="mb-20">
    <div className="flex items-center gap-4 mb-10">
      <div className="w-14 h-14 bg-fm-blue rounded-2xl flex items-center justify-center text-white shadow-xl shadow-fm-blue/20">
        <Compass size={28} />
      </div>
      <div>
        <h2 className="text-4xl font-serif font-bold text-slate-900">Your Roadmap to Success</h2>
        <p className="text-slate-500 text-lg">Follow these steps to navigate your AI career transition with confidence.</p>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
      {[
        {
          step: "Step 1",
          title: "Start Here: Prepare",
          desc: "Prepare your resume text. **Privacy Tip:** Remove personal info like phone numbers or exact addresses before uploading.",
          icon: <FileText className="text-blue-600" size={24} />,
          bg: "bg-blue-50",
          border: "border-blue-100",
          action: "Go to Step 1",
          onClick: onStart
        },
        {
          step: "Step 2",
          title: "Search & Discover",
          desc: "Use the search bar below to find AI-related roles. **Pro Tip:** Click the grid icon on any job to add it to your comparison list.",
          icon: <Search className="text-fm-violet" size={24} />,
          bg: "bg-violet-50",
          border: "border-violet-100",
          action: "Go to Search",
          onClick: () => onSetTab('discover')
        },
        {
          step: "Step 3",
          title: "Analyze & Match",
          desc: "Click 'Match' or 'SWOT' on any job in the Discover tab to see your compatibility and get a detailed SWOT analysis.",
          icon: <Zap className="text-fm-blue" size={24} />,
          bg: "bg-blue-50",
          border: "border-blue-100",
          action: "Go to Analyze",
          onClick: () => onSetTab('discover')
        },
        {
          step: "Step 4",
          title: "Interactive AI Labs",
          desc: "Head to the 'Labs' tab to access specialized tools like the Resume Reviser, Interview Prep, and SWOT Analysis.",
          icon: <FlaskConical className="text-fm-blue" size={24} />,
          bg: "bg-blue-50",
          border: "border-blue-100",
          action: "Go to Labs",
          onClick: () => onSetTab('labs')
        }
      ].map((item, i) => (
        <div key={i} className={`glass-panel p-8 ${item.bg} ${item.border} relative group hover:shadow-xl transition-all h-full flex flex-col`}>
          <div className="flex justify-between items-start mb-6">
            <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-sm group-hover:scale-110 transition-transform">
              {item.icon}
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.step}</span>
          </div>
          <h3 className="text-xl font-bold text-slate-900 mb-4">{item.title}</h3>
          <div className="text-sm text-slate-600 leading-relaxed flex-1">
            <Markdown>{item.desc}</Markdown>
          </div>
          <button 
            onClick={item.onClick}
            className="mt-6 flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-fm-blue hover:text-blue-700 transition-colors"
          >
            {item.action} <ArrowRight size={12} />
          </button>
        </div>
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
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input 
                    type="checkbox" 
                    checked={agreedToPrivacy}
                    onChange={(e) => setAgreedToPrivacy(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-fm-blue focus:ring-fm-blue transition-all"
                  />
                  <span className="text-sm font-medium text-slate-600 group-hover:text-slate-900 transition-colors">
                    I have anonymized my resume text
                  </span>
                </label>
              </div>
            </div>

            <div className="bg-amber-50 border border-amber-100 p-4 rounded-xl flex items-start gap-3">
              <AlertCircle className="text-amber-600 shrink-0 mt-0.5" size={18} />
              <p className="text-xs text-amber-800 leading-relaxed">
                <strong>Why anonymize?</strong> AI analysis works best when focusing on skills and experience. Removing PII keeps your data safe while providing the same high-quality results.
              </p>
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
                  className="px-8 py-4 bg-slate-100 text-slate-600 rounded-2xl font-bold text-lg hover:bg-slate-200 transition-all"
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
              className="px-8 py-3 bg-white border border-slate-200 rounded-xl text-xs font-bold uppercase tracking-widest text-fm-blue hover:bg-slate-50 transition-all shadow-sm"
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

      <div className="glass-panel p-8 bg-fm-deep text-white border-none shadow-xl flex flex-col justify-between">
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
  <div className="glass-panel p-8 hover:shadow-xl transition-all border-slate-200 group relative overflow-hidden flex flex-col h-full bg-white shadow-sm">
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
            className="flex items-center justify-center gap-2 py-3 bg-fm-blue text-white rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-700 transition-all shadow-sm"
          >
            <Zap size={14} /> Match
          </button>
          <button 
            onClick={() => onRevise(job)}
            className="flex items-center justify-center gap-2 py-3 bg-violet-50 text-fm-violet rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-violet-100 transition-all border border-violet-100"
          >
            <PenTool size={14} /> Revise
          </button>
        </div>
        <div className="grid grid-cols-3 gap-3">
          <button 
            onClick={() => onLetter(job)}
            className="flex items-center justify-center gap-2 py-3 bg-teal-50 text-teal-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-teal-100 transition-all border border-teal-100"
          >
            Letter
          </button>
          <button 
            onClick={() => onPrep(job)}
            className="flex items-center justify-center gap-2 py-3 bg-indigo-50 text-indigo-700 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-indigo-100 transition-all border border-indigo-100"
          >
            Interview Tips
          </button>
          <button 
            onClick={() => onSWOT(job)}
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

const InterviewPrepView = ({ job, onBack }: { job: Job; onBack: () => void }) => {
  const [prep, setPrep] = useState<InterviewPrep | null>(null);
  const [loading, setLoading] = useState(true);

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
        className="flex items-center gap-2 text-blue-500 hover:text-fm-blue mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
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
          ) : prep ? (
            <div className="space-y-12">
              <section>
                <h3 className="text-xl font-bold text-indigo-900 mb-6 flex items-center gap-2">
                  <TrendingUp className="text-indigo-600" size={24} />
                  Top Interview Questions
                </h3>
                <div className="space-y-8">
                  {prep.questions.map((q, i) => (
                    <div key={i} className="p-8 rounded-[2rem] bg-blue-50 border border-blue-100 shadow-sm">
                      <div className="flex gap-6 mb-6">
                        <div className="flex-shrink-0 w-10 h-10 bg-indigo-600 text-white rounded-2xl flex items-center justify-center font-bold text-lg shadow-lg shadow-indigo-200">
                          {i + 1}
                        </div>
                        <h4 className="text-2xl font-bold text-indigo-900 leading-tight">{q.question}</h4>
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
        className="flex items-center gap-2 text-blue-500 hover:text-fm-blue mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
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
        className="flex items-center gap-2 text-blue-500 hover:text-fm-blue mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
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
                <label className="block text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">
                  Paste Your Resume Text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste the full text of your resume here..."
                  className="w-full h-64 p-4 rounded-2xl border-2 border-blue-100 focus:border-fm-blue focus:ring-0 transition-all resize-none font-sans text-blue-700"
                />
              </div>
              <button
                onClick={handleMatch}
                disabled={loading || !resumeText.trim()}
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
  { p: 'Anthropic', e: '⚡', n: 'Claude Code In Action', d: 'AI-assisted coding workflows and real-world application patterns.', u: 'https://anthropic.skilljar.com/claude-code-in-action' },
  { p: 'Anthropic', e: '🌱', n: 'Claude 101', d: 'Core interaction patterns with the Claude model family.', u: 'https://anthropic.skilljar.com/claude-101' },
  { p: 'Anthropic', e: '🧠', n: 'AI Fluency: Foundations', d: 'Core AI terminology, mental models, and key concepts.', u: 'https://anthropic.skilljar.com/ai-fluency-framework-foundations' },
  { p: 'Microsoft', e: '💡', n: 'Episode 1: Intro to Gen AI', d: 'Introduction to Generative AI and Large Language Models.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/introduction-to-generative-ai-and-llms-generative-ai-for-beginners' },
  { p: 'Microsoft', e: '⌨️', n: 'Episode 4: Prompt Engineering', d: 'Fundamentals of prompt engineering and instruction design.', u: 'https://learn.microsoft.com/en-us/shows/generative-ai-for-beginners/understanding-prompt-engineering-fundamentals-generative-ai-for-beginners' },
  { p: 'Verizon', e: '📡', n: 'Verizon Reskilling Program', d: 'Technical reskilling programs focused on workforce readiness and digital prosperity.', u: 'https://www.verizon.com/about/responsibility/human-prosperity/reskilling-program' },
  { p: 'Udemy', e: '🎓', n: 'AI Leader Cert', d: 'Generative AI leadership strategy and certification program.', u: 'https://verizonreskilling.udemy.com/course/ai-leader-the-ultimate-generative-ai-leader-cert-training/' },
];

const PATHS_DATA = [
  { n: 'Aledade', c: 'Health', d: 'Technology for independent primary care.', u: 'https://www.aledade.com/careers', e: '🏥' },
  { n: 'Arcadia Power', c: 'Climate', d: 'Clean energy utility platform.', u: 'https://www.arcadia.com/careers', e: '🌍' },
  { n: 'Khan Academy', c: 'Education', d: 'Free, world-class education for anyone, anywhere.', u: 'https://www.khanacademy.org/careers', e: '📚' },
  { n: 'Code for America', c: 'Civic', d: 'Technology in service of people and society.', u: 'https://www.codeforamerica.org/jobs', e: '🏛️' },
  { n: 'Stripe', c: 'FinTech', d: 'Global payment infrastructure for the internet.', u: 'https://stripe.com/jobs', e: '💳' },
];

const TERMS = [
  { t: 'Generative AI', d: 'AI capable of creating new text, code, images, or data by learning patterns from vast training corpora.' },
  { t: 'LLM', d: 'Large Language Model — the transformer-based cognitive engine powering modern conversational AI systems.' },
  { t: 'RAG', d: 'Retrieval-Augmented Generation. Grounds AI responses in verified, up-to-date external knowledge.' },
  { t: 'Prompting', d: 'The precise method of crafting instructions or context to guide AI toward the desired output or behavior.' },
];

const CATEGORIES = [
  { id: 'All', icon: '✨', bg: 'bg-violet-50/60', border: 'border-violet-100' },
  { id: 'Health', icon: '🏥', bg: 'bg-rose-50/60', border: 'border-rose-100' },
  { id: 'Climate', icon: '🌍', bg: 'bg-emerald-50/60', border: 'border-emerald-100' },
  { id: 'Education', icon: '📚', bg: 'bg-blue-50/60', border: 'border-blue-100' },
  { id: 'Civic', icon: '🏛️', bg: 'bg-amber-50/60', border: 'border-amber-100' },
  { id: 'FinTech', icon: '💳', bg: 'bg-indigo-50/60', border: 'border-indigo-100' },
];

const ResourceHubView = () => {
  const [activePortal, setActivePortal] = useState('All');
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
            <h2 className="text-6xl md:text-8xl font-serif font-bold tracking-tighter leading-[0.85] mb-10 text-slate-900">
              Fuel your <br />
              <span className="text-fm-violet italic">infinite growth.</span>
            </h2>
            <p className="text-xl text-slate-500 font-medium max-w-2xl mx-auto leading-relaxed">
              A curated space for continuous upskilling, AI mastery, and staying ahead of the curve.
            </p>
          </motion.div>
        </div>
      </section>

      {/* AI Career Pitch Lab Section */}
      <section className="max-w-7xl mx-auto px-6">
        <div className="mb-12">
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-fm-violet mb-4 block">Interactive Workshop</span>
          <h2 className="text-4xl font-serif font-bold text-slate-900 mb-4">🚀 AI Career Pitch Lab</h2>
          <p className="text-slate-500 max-w-xl">Master the art of the AI-powered professional pitch in 3 steps.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              step: "Step 1: Brainstorm Your Structure",
              desc: "I'm preparing a presentation on the transition to an AI-driven career. My primary goal is to demonstrate how experienced professionals can leverage their existing skills. Help me brainstorm 3 compelling ways to structure my presentation for recruiters.",
              icon: <Zap className="text-fm-blue" size={24} />
            },
            {
              step: "Step 2: Find Your \"Hook\" Statistic",
              desc: "I like the Skills Transformation structure. Now I need a powerful hook. What's a surprising 2026 statistic about the demand for AI literacy in non-technical roles?",
              icon: <TrendingUp className="text-fm-blue" size={24} />
            },
            {
              step: "Step 3: Draft Your Opening",
              desc: "I like the statistic about the 70% surge in AI demand. Draft an opening paragraph for my presentation. Generate 3 options ranging from inspiring to analytical.",
              icon: <PenTool className="text-fm-blue" size={24} />
            }
          ].map((item, i) => (
            <div key={i} className="glass-panel p-8 flex flex-col h-full bg-white border-slate-200">
              <div className="w-12 h-12 bg-fm-blue/10 rounded-2xl flex items-center justify-center mb-6">
                {item.icon}
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-4">{item.step}</h3>
              <p className="text-slate-500 text-sm leading-relaxed mb-8 flex-1 italic">
                "{item.desc}"
              </p>
              <button 
                onClick={() => {
                  navigator.clipboard.writeText(item.desc);
                }}
                className="copy-btn w-fit"
              >
                <Copy size={14} />
                Copy Prompt
              </button>
            </div>
          ))}
        </div>

        {/* Success Stories / Examples */}
        <div className="bg-slate-50 rounded-[3rem] p-12 border border-slate-200">
          <div className="flex items-center gap-4 mb-12">
            <div className="p-3 bg-fm-violet/10 rounded-2xl">
              <Award className="text-fm-violet" size={32} />
            </div>
            <div>
              <h3 className="text-3xl font-serif font-bold text-slate-900">Example Success Stories</h3>
              <p className="text-slate-500">See how these prompts transform a blank page into a finished pitch.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            <div className="space-y-8">
              <div className="flex items-center gap-3 text-fm-blue font-bold uppercase tracking-widest text-[10px]">
                <div className="w-6 h-[1px] bg-fm-blue" />
                Step 1: Brainstorming
              </div>
              <div className="glass-panel p-8 bg-white border-slate-200 shadow-sm">
                <h4 className="text-xl font-bold text-slate-900 mb-6">The "Skills Bridge" Structure</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  Directly maps traditional skills (Project Management, Data Analysis) to their AI counterparts (Prompt Engineering, LLM Orchestration), showing how the professional remains the "Pilot."
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-xs text-slate-400">
                  "This structure is most empowering for mid-career professionals."
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 text-fm-blue font-bold uppercase tracking-widest text-[10px]">
                <div className="w-6 h-[1px] bg-fm-blue" />
                Step 2: The Hook
              </div>
              <div className="glass-panel p-8 bg-white border-slate-200 shadow-sm">
                <h4 className="text-xl font-bold text-slate-900 mb-6">The "70% Surge" Statistic</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  "By 2026, 70% of non-technical roles will require AI literacy as a baseline requirement, a 400% increase from 2023."
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-xs text-slate-400">
                  "A powerful way to grab attention immediately."
                </div>
              </div>
            </div>

            <div className="space-y-8">
              <div className="flex items-center gap-3 text-fm-blue font-bold uppercase tracking-widest text-[10px]">
                <div className="w-6 h-[1px] bg-fm-blue" />
                Step 3: The Opening
              </div>
              <div className="glass-panel p-8 bg-white border-slate-200 shadow-sm">
                <h4 className="text-xl font-bold text-slate-900 mb-6">The Inspiring Opening</h4>
                <p className="text-slate-500 text-sm leading-relaxed mb-6">
                  "We stand at a crossroads where experience meets evolution. AI isn't replacing the professional; it's amplifying the wisdom we've built over decades."
                </p>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 italic text-xs text-slate-400">
                  "Sets a positive, forward-looking tone for the pitch."
                </div>
              </div>
            </div>
          </div>
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
                      <h4 className="text-xl font-bold text-indigo-900 mb-2 group-hover:text-fm-violet transition-colors">{m.n}</h4>
                      <p className="text-base text-blue-500 leading-relaxed">{m.d}</p>
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {filteredPaths.map((p, i) => (
                <a
                  key={i}
                  href={p.u}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-8 rounded-[2rem] bg-blue-50 hover:bg-white hover:shadow-xl transition-all group border border-transparent hover:border-blue-100 shadow-sm"
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
        className="flex items-center gap-2 text-blue-500 hover:text-fm-blue mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
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
                The Future of Career Scouting
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
              <h3 className="font-bold text-2xl text-slate-900">Forward Moves USA Scout</h3>
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
        className="flex items-center gap-2 text-blue-500 hover:text-fm-blue mb-8 transition-colors font-medium"
      >
        <ArrowLeft size={20} />
        Back to Dashboard
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
                    id="resume-upload" 
                  />
                  <label 
                    htmlFor="resume-upload"
                    className="px-6 py-2 bg-white border border-blue-200 rounded-xl font-bold text-sm text-blue-700 hover:bg-blue-50 cursor-pointer transition-all shadow-sm"
                  >
                    Select File
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-blue-700 uppercase tracking-wider mb-2">
                  Resume Content
                </label>
                <textarea
                  value={resumeText}
                  onChange={(e) => setResumeText(e.target.value)}
                  placeholder="Paste your resume here..."
                  className="w-full h-64 p-4 rounded-2xl border-2 border-blue-100 focus:border-fm-violet focus:ring-0 transition-all resize-none font-sans text-blue-700"
                />
              </div>
              <button
                onClick={handleRevise}
                disabled={loading || !resumeText.trim()}
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
              <a href={job.companyUrl} target="_blank" rel="noopener noreferrer" className="text-fm-blue underline hover:text-blue-800 transition-colors">
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
          <button onClick={onClose} className="btn-primary">Close Analysis</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ComparisonTable = ({ jobs, onRemove, onGoToDashboard }: { jobs: Job[]; onRemove: (id: string) => void; onGoToDashboard: () => void }) => {
  if (jobs.length === 0) {
    return (
      <div className="p-20 text-center glass-panel bg-white border-slate-200 shadow-lg rounded-[2.5rem]">
        <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
          <TableIcon size={40} />
        </div>
        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">No jobs selected for comparison</h3>
        <p className="text-slate-500 mb-8 max-w-md mx-auto">Add jobs from the dashboard by clicking the "Compare" icon on any job card to see them side-by-side.</p>
        <button 
          onClick={onGoToDashboard}
          className="btn-primary px-8 py-4 rounded-2xl text-sm shadow-xl shadow-fm-blue/10"
        >
          Go to Dashboard
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

export default function App() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedForComparison, setSelectedForComparison] = useState<Job[]>([]);
  const [activeSWOT, setActiveSWOT] = useState<Job | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [view, setView] = useState<'dashboard' | 'comparison' | 'resume-matcher' | 'resume-reviser' | 'interview-prep' | 'cover-letter' | 'resource-hub' | 'showcase'>('dashboard');
  const [matchingJob, setMatchingJob] = useState<Job | null>(null);
  const [resumeText, setResumeText] = useState('');
  const [dashboardTab, setDashboardTab] = useState<'start' | 'discover' | 'labs' | 'insights'>('start');

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
    <div className="min-h-screen flex flex-col">
      {/* Disclaimer Banner */}
      <div className="bg-amber-50 border-b border-amber-100 py-2 px-8 text-center">
        <p className="text-xs text-amber-800 font-medium">
          <strong>Sample Disclaimer:</strong> "Forward Moves AI is currently in its community-testing phase. To protect your privacy, please remove personal contact information (phone, home address) from your resume before uploading. Data shared during this test phase may be used to improve the underlying AI model."
        </p>
      </div>

      {/* Header */}
      <header className="bg-white text-slate-900 py-6 px-8 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-4">
            <div className="bg-fm-blue/10 p-3 rounded-2xl">
              <Search className="text-fm-blue" size={32} />
            </div>
            <div>
              <h1 className="text-3xl font-serif font-bold tracking-tight text-slate-900">Forward Moves USA Scout</h1>
              <p className="text-slate-500 text-sm font-medium">Empowering career transitions across the nation</p>
            </div>
          </div>

          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button 
              onClick={() => setView('dashboard')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${view === 'dashboard' ? 'bg-white text-fm-blue shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <LayoutDashboard size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Dashboard</span>
            </button>
            <button 
              onClick={() => setView('comparison')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all relative ${view === 'comparison' ? 'bg-white text-fm-blue shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <TableIcon size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Comparison</span>
              {selectedForComparison.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-fm-violet text-white text-[10px] font-bold w-6 h-6 flex items-center justify-center rounded-full border-2 border-white">
                  {selectedForComparison.length}
                </span>
              )}
            </button>
            <button 
              onClick={() => setView('resource-hub')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${view === 'resource-hub' ? 'bg-white text-fm-blue shadow-sm' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Compass size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Resource Hub</span>
            </button>
            <button 
              onClick={() => setView('showcase')}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all ${view === 'showcase' ? 'bg-fm-violet text-white shadow-lg' : 'text-slate-500 hover:text-slate-900'}`}
            >
              <Award size={20} />
              <span className="text-xs font-bold uppercase tracking-widest">Showcase</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-8 space-y-8">
        
        {view === 'resume-matcher' && matchingJob ? (
          <ResumeMatcher job={matchingJob} onBack={() => setView('dashboard')} initialResumeText={resumeText} />
        ) : view === 'resume-reviser' && matchingJob ? (
          <ResumeReviser job={matchingJob} onBack={() => setView('dashboard')} initialResumeText={resumeText} />
        ) : view === 'interview-prep' && matchingJob ? (
          <InterviewPrepView job={matchingJob} onBack={() => setView('dashboard')} />
        ) : view === 'cover-letter' && matchingJob ? (
          <CoverLetterDrafter job={matchingJob} onBack={() => setView('dashboard')} initialResumeText={resumeText} />
        ) : view === 'resource-hub' ? (
          <ResourceHubView />
        ) : view === 'showcase' ? (
          <LinkedInFlyer onBack={() => setView('dashboard')} />
        ) : view === 'dashboard' ? (
          <>
            {/* Dashboard Process Navigation */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-slate-50 p-2 rounded-[2.5rem] border border-slate-200">
              <div className="flex w-full md:w-auto p-1 bg-white rounded-2xl shadow-sm border border-slate-100">
                <button 
                  onClick={() => setDashboardTab('start')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${dashboardTab === 'start' ? 'bg-fm-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <FileText size={18} />
                  1. Setup
                </button>
                <button 
                  onClick={() => setDashboardTab('discover')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${dashboardTab === 'discover' ? 'bg-fm-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <Search size={18} />
                  2. Discover
                </button>
                <button 
                  onClick={() => setDashboardTab('labs')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${dashboardTab === 'labs' ? 'bg-fm-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <FlaskConical size={18} />
                  3. Labs
                </button>
                <button 
                  onClick={() => setDashboardTab('insights')}
                  className={`flex-1 md:flex-none flex items-center justify-center gap-3 px-8 py-3 rounded-xl transition-all font-bold text-xs uppercase tracking-widest ${dashboardTab === 'insights' ? 'bg-fm-blue text-white shadow-lg' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  <TrendingUp size={18} />
                  4. Insights
                </button>
              </div>
              
              <div className="hidden lg:flex items-center gap-4 px-6 py-2 bg-white rounded-full border border-slate-100 shadow-sm">
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className={`w-2.5 h-2.5 rounded-full border border-white transition-all duration-500 ${
                      (i === 1 && dashboardTab === 'start') || 
                      (i === 2 && dashboardTab === 'discover') || 
                      (i === 3 && dashboardTab === 'labs') ||
                      (i === 4 && dashboardTab === 'insights') ? 'bg-fm-blue scale-125 shadow-[0_0_10px_rgba(59,130,246,0.5)]' : 'bg-slate-200'
                    }`} />
                  ))}
                </div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest min-w-[100px] text-center">
                  {dashboardTab === 'start' ? 'Preparation' : dashboardTab === 'discover' ? 'Market Search' : dashboardTab === 'labs' ? 'AI Labs' : 'Strategic Insights'}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {dashboardTab === 'start' && (
                <motion.div
                  key="start"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-12"
                >
                  <LandingSection />
                  <QuickStartGuide 
                    onStart={() => {
                      const el = document.getElementById('resume-upload-section');
                      el?.scrollIntoView({ behavior: 'smooth' });
                    }} 
                    onSetTab={setDashboardTab}
                  />
                  <ResumeSetup onSet={(text) => {
                    setResumeText(text);
                    setDashboardTab('discover');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }} currentResume={resumeText} />
                </motion.div>
              )}

              {dashboardTab === 'discover' && (
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
                        onClick={() => setDashboardTab('insights')}
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
                          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                          <input 
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
                          className="btn-primary flex items-center justify-center gap-2 px-8 py-3 rounded-2xl text-sm shadow-lg shadow-fm-deep/10"
                        >
                          {loading ? <Loader2 className="animate-spin" size={18} /> : <Search size={18} />}
                          Search
                        </button>
                      </div>
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
                        <div className="bg-slate-900/90 backdrop-blur-xl border border-white/20 p-4 rounded-3xl shadow-2xl flex items-center justify-between gap-6">
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

              {dashboardTab === 'labs' && (
                <motion.div
                  key="labs"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-20"
                >
                  <div className="text-center max-w-3xl mx-auto">
                    <h2 className="text-5xl font-serif font-bold text-slate-900 mb-6">The AI Career <span className="text-fm-blue italic">Labs</span></h2>
                    <p className="text-xl text-slate-500 leading-relaxed">
                      Our "Labs" are interactive, AI-powered environments where you don't just get results—you master the skills of the future. Each lab is designed to teach you the logic of AI interaction.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {[
                      {
                        title: "Resume Matcher Lab",
                        desc: "Analyze your resume against any job description to see your compatibility score and identify keyword gaps.",
                        icon: <Zap className="text-fm-blue" />,
                        action: matchingJob ? "Continue with Current Job" : "Select a Job to Match",
                        onClick: () => {
                          if (matchingJob) setView('resume-matcher');
                          else setDashboardTab('discover');
                        }
                      },
                      {
                        title: "Resume Reviser Lab",
                        desc: "Transform your traditional resume into an AI-optimized masterpiece that highlights your future-ready skills.",
                        icon: <PenTool className="text-fm-violet" />,
                        action: matchingJob ? "Revise for Current Job" : "Select a Job to Revise",
                        onClick: () => {
                          if (matchingJob) setView('resume-reviser');
                          else setDashboardTab('discover');
                        }
                      },
                      {
                        title: "Cover Letter Lab",
                        desc: "Craft high-impact, personalized cover letters that tell your story of evolution and AI readiness.",
                        icon: <FileText className="text-teal-600" />,
                        action: matchingJob ? "Draft for Current Job" : "Select a Job to Draft",
                        onClick: () => {
                          if (matchingJob) setView('cover-letter');
                          else setDashboardTab('discover');
                        }
                      },
                      {
                        title: "Interview Prep Lab",
                        desc: "Generate strategic interview guides, including likely questions and high-impact answers tailored to the role.",
                        icon: <MessageSquare className="text-indigo-600" />,
                        action: matchingJob ? "Prep for Current Job" : "Select a Job to Prep",
                        onClick: () => {
                          if (matchingJob) setView('interview-prep');
                          else setDashboardTab('discover');
                        }
                      },
                      {
                        title: "SWOT Analysis Lab",
                        desc: "Get a deep strategic breakdown of your fit for any role, including strengths to leverage and threats to mitigate.",
                        icon: <Shield className="text-fm-blue" />,
                        action: matchingJob ? "Analyze Current Job" : "Select a Job to Analyze",
                        onClick: () => {
                          if (matchingJob) setActiveSWOT(matchingJob);
                          else setDashboardTab('discover');
                        }
                      },
                      {
                        title: "Pitch Lab",
                        desc: "Master your professional narrative. Learn how to pitch your career transition as a strategic advantage.",
                        icon: <Award className="text-fm-orange" />,
                        action: "View Showcase",
                        onClick: () => setView('showcase')
                      }
                    ].map((lab, i) => (
                      <div key={i} className="glass-panel p-8 bg-white border-slate-200 shadow-lg hover:shadow-2xl transition-all flex flex-col h-full">
                        <div className="w-14 h-14 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 shadow-inner">
                          {React.cloneElement(lab.icon as React.ReactElement<any>, { size: 28 })}
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-slate-900 mb-4">{lab.title}</h3>
                        <p className="text-slate-500 mb-8 flex-1 leading-relaxed">{lab.desc}</p>
                        <button 
                          onClick={lab.onClick}
                          className="w-full py-4 bg-slate-900 text-white rounded-xl text-xs font-bold uppercase tracking-widest hover:bg-fm-blue transition-all shadow-lg"
                        >
                          {lab.action}
                        </button>
                      </div>
                    ))}
                  </div>

                  <LabPhilosophy />
                </motion.div>
              )}
              {dashboardTab === 'insights' && (
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
                  <LabPhilosophy />
                  <SuccessStories />
                  <FutureOutlook />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-indigo-900">Job Comparison</h2>
              <button onClick={() => setView('dashboard')} className="text-fm-blue hover:underline text-sm font-medium flex items-center gap-1">
                Back to Dashboard <ArrowRight size={14} />
              </button>
            </div>
            <ComparisonTable 
              jobs={selectedForComparison} 
              onRemove={(id) => setSelectedForComparison(prev => prev.filter(j => j.id !== id))} 
              onGoToDashboard={() => setView('dashboard')}
            />
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white text-slate-500 py-20 px-8 border-t border-slate-200">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-16">
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="bg-fm-blue/10 p-3 rounded-2xl">
                <Search className="text-fm-blue" size={24} />
              </div>
              <span className="text-slate-900 font-serif font-bold text-2xl">Forward Moves USA Scout</span>
            </div>
            <p className="text-slate-500 text-base leading-relaxed mb-10">
              Empowering job seekers nationwide with AI-driven insights and curated career resources.
            </p>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm">Featured Companies</h4>
            <ul className="text-base space-y-3">
              <li className="hover:text-fm-blue transition-colors cursor-pointer">Audible (Newark)</li>
              <li className="hover:text-fm-blue transition-colors cursor-pointer">Merck (Rahway)</li>
              <li className="hover:text-fm-blue transition-colors cursor-pointer">Johnson & Johnson (New Brunswick)</li>
              <li className="hover:text-fm-blue transition-colors cursor-pointer">Prudential (Newark)</li>
            </ul>
          </div>
          <div>
            <h4 className="text-slate-900 font-bold mb-6 uppercase tracking-wider text-sm">Powered By</h4>
            <p className="text-base mb-6 text-slate-500">Google Search Grounding & Gemini 3.1 Flash</p>
            <div className="flex gap-6">
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200">
                <TrendingUp size={20} className="text-slate-400" />
              </div>
              <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center hover:bg-slate-100 transition-colors cursor-pointer border border-slate-200">
                <Shield size={20} className="text-slate-400" />
              </div>
            </div>
          </div>
        </div>
        <div className="max-w-7xl mx-auto mt-20 pt-10 border-t border-slate-100 text-center text-xs font-bold uppercase tracking-[0.3em] text-slate-400">
          &copy; 2026 Forward Moves USA Scout. All rights reserved. Data sourced via Google Search.
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
