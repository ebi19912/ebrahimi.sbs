import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { FadeInUp } from './components/FadeInUp';
import { ChatWidget } from './components/ChatWidget';
import { 
  FiMail, 
  FiGithub, 
  FiLinkedin, 
  FiTwitter, 
  FiDownload, 
  FiMapPin, 
  FiExternalLink, 
  FiCheckCircle, 
  FiArrowRight, 
  FiCode, 
  FiCpu, 
  FiLayers, 
  FiSend,
  FiAward,
  FiBook,
  FiTerminal,
  FiBriefcase
} from 'react-icons/fi';
import { 
  BiBrain, 
  BiCodeBlock, 
  BiBriefcase, 
  BiBookOpen, 
  BiAward, 
  BiChevronRight,
  BiCheck,
  BiGlobe
} from 'react-icons/bi';
import { FaTelegramPlane, FaWhatsapp, FaYoutube } from 'react-icons/fa';

// Initial fallback dataset based on real database
const initialData = {
  profile: {
    full_name: "Rouhalah Ebrahimi",
    about_me: "I'm Rouhalah Ebrahimi, a versatile software engineer and AI specialist with expertise in Python, machine learning, and full-stack development. I build intelligent systems—from LLM-powered platforms and computer vision models to cloud-native applications—focusing on real-world impact across healthcare, education, and enterprise.",
    address: "ISTANBUL, Turkey",
    mobile: "+989134544469",
    email: "ebrahimirohollah@gmail.com",
    github: "https://github.com/ebi19912",
    linkedin: "https://www.linkedin.com/in/rouhalahebrahimi/",
    telegram: "https://t.me/r_e1991",
    profile_pic: "Gemini_Generated_Image_5wxh425wxh425wxh.png",
    show_email: true,
    show_github: true,
    show_telegram: true,
    show_whatsapp: true
  },
  skills: [
    { name: "Python & AI Development (TensorFlow, PyTorch)", level: 95 },
    { name: "LLMs & RAG Architectures (LangChain, ChromaDB)", level: 90 },
    { name: "Computer Vision & Medical Imaging (OpenCV)", level: 90 },
    { name: "Full-stack Development (FastAPI, Flask, React)", level: 88 },
    { name: "Data Science & Visualization (Power BI, Pandas)", level: 85 },
    { name: "Linux System Administration & Cloud", level: 85 },
    { name: "C# / .Net Core Development", level: 80 },
    { name: "Network Engineering & Security", level: 80 },
    { name: "Database Management (MySQL, SQLite, Vector DB)", level: 85 }
  ],
  completed: [
    {
      id: 1,
      title: "Cafe Suite: AI-Driven Smart Cafe Management",
      short_description: "A comprehensive SaaS management platform for cafes featuring automated ordering, intelligent CRM, and real-time sales forecasting powered by AI.",
      github_link: "https://github.com/ebi19912",
      live_link: "",
      tags: ["AI SaaS", "Full-Stack", "Machine Learning"]
    },
    {
      id: 2,
      title: "HybridCXR: Advanced Multi-Class Lung Disease Detection",
      short_description: "Master's thesis project achieving a top 20/20 grade. A hybrid deep learning architecture (VGG16, ResNet, MobileNet) trained on the NIH dataset for multi-label chest X-ray disease classification.",
      github_link: "https://github.com/ebi19912",
      live_link: "",
      tags: ["Computer Vision", "Deep Learning", "Healthcare AI"]
    },
    {
      id: 4,
      title: "AutoEncoder Feature Extractor (MosMedData)",
      short_description: "Deep learning autoencoder for medical image feature extraction, dimensionality reduction, and unsupervised anomaly detection.",
      github_link: "https://github.com/ebi19912/AutoEncoder_FeatureExt_mosmeddata",
      live_link: "",
      tags: ["Autoencoders", "PyTorch", "Medical Data"]
    },
    {
      id: 5,
      title: "AddProduct AI for WordPress / WooCommerce",
      short_description: "Automated AI plugin that generates SEO-optimized product titles, descriptions, and metadata for e-commerce platforms automatically.",
      github_link: "https://github.com/ebi19912/AddProduct_AI_Wordpress",
      live_link: "",
      tags: ["LLM Integration", "Automation", "WordPress"]
    }
  ],
  ongoing: [
    {
      id: 3,
      title: "Test98.ir: AI-Driven Educational & Assessment Platform",
      short_description: "A scalable web-based system for interactive recruitment testing with AI-driven personalized feedback for students and hiring organizations.",
      live_link: "https://test98.ir",
      tags: ["EdTech", "AI Assessment", "FastAPI"]
    }
  ],
  exp: [
    {
      id: 2,
      category: "work",
      title: "Data Scientist & IT Specialist",
      organization: "Yazd University of Medical Sciences",
      duration: "2018 - Present",
      description: "Developing AI-driven systems for healthcare & research processes. Specializing in LLMs, RAG systems, and medical imaging data analysis."
    }
  ],
  edu: [
    {
      id: 1,
      category: "education",
      title: "Master of Science in Artificial Intelligence & Robotics",
      organization: "University of Meybod (Public University)",
      duration: "2023 - 2025",
      description: "Top-ranked student in the AI department (GPA 17.85/20). Thesis: Lung disease detection using Hybrid Transfer Learning."
    }
  ],
  honors: [
    {
      id: 3,
      title: "Top-Ranked AI Student & Outstanding Instructor",
      organization: "University of Meybod & TVTO",
      duration: "2024 - 2025",
      description: "Ranked 1st in Master's AI program. Awarded Outstanding Instructor of the year."
    }
  ],
  papers: [
    {
      id: 4,
      title: "Presenting a Hybrid Deep Learning Model for Multi-Label Classification of Chest Diseases",
      organization: "Published Research in Computer Vision",
      duration: "2025",
      description: "Improving detection accuracy for rare lung abnormalities through fine-tuning and weight optimization in deep neural networks."
    }
  ],
  demos: []
};

const ProjectCard = ({ proj, delay }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasExtraContent = proj.full_content || proj.video_link || proj.media_file;
  
  // Parse tags if it's a comma-separated string from the backend
  let displayTags = [];
  if (Array.isArray(proj.tags)) {
    displayTags = proj.tags;
  } else if (typeof proj.tags === 'string' && proj.tags.trim() !== '') {
    displayTags = proj.tags.split(',').map(t => t.trim()).filter(t => t);
  }

  return (
    <FadeInUp delay={delay} className="min-w-0">
      <div className="h-full w-full min-w-0 max-w-full bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-8 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
        <div className="min-w-0">
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold text-lg sm:text-xl group-hover:bg-purple-600 group-hover:text-white transition-colors duration-300 flex-shrink-0">
              <BiCodeBlock />
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {proj.status === 'ongoing' ? (
                <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                  In Progress
                </span>
              ) : (
                <span className="text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:px-3 sm:py-1 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                  Completed
                </span>
              )}
            </div>
          </div>

          <h3 className="text-base sm:text-xl font-bold text-slate-900 group-hover:text-purple-600 transition-colors [overflow-wrap:anywhere] break-words">
            {proj.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 mt-2.5 sm:mt-3 leading-relaxed [overflow-wrap:anywhere] break-words">
            {proj.short_description}
          </p>

          {displayTags && displayTags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 sm:gap-2 mt-4 sm:mt-5">
              {displayTags.map((tag, tIdx) => (
                <span key={tIdx} className="text-[11px] sm:text-xs px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-lg bg-slate-100 text-slate-600 font-medium">
                  {tag}
                </span>
              ))}
            </div>
          )}
          
          {hasExtraContent && (
            <div className="mt-4 border-t border-slate-100 pt-3">
              <button 
                onClick={() => setIsExpanded(!isExpanded)}
                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold transition-colors w-full"
              >
                {isExpanded ? 'Show Less' : 'Read More / Watch Demo'}
                <BiChevronRight className={`text-base transition-transform duration-300 ${isExpanded ? '-rotate-90' : 'rotate-90'}`} />
              </button>
              
              <AnimatePresence>
                {isExpanded && (
                  <motion.div 
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="overflow-hidden"
                  >
                    <div className="pt-4 pb-2">
                      {proj.media_file ? (
                        <div className="mb-4 w-full aspect-video rounded-xl overflow-hidden shadow-sm bg-slate-50 border border-slate-100 flex items-center justify-center">
                          {proj.media_file.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={`/static/uploads/${proj.media_file}`} controls className="w-full h-full object-cover"></video>
                          ) : (
                            <img src={`/static/uploads/${proj.media_file}`} alt={proj.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ) : proj.video_link ? (
                        <div className="mb-4 w-full aspect-video rounded-xl overflow-hidden shadow-sm bg-slate-50 border border-slate-100">
                          <iframe 
                            src={proj.video_link.includes('watch?v=') ? proj.video_link.replace('watch?v=', 'embed/').split('&')[0] : (proj.video_link.includes('youtu.be/') ? proj.video_link.replace('youtu.be/', 'youtube.com/embed/').split('?')[0] : proj.video_link)} 
                            className="w-full h-full" 
                            frameBorder="0" 
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                            allowFullScreen
                          ></iframe>
                        </div>
                      ) : null}
                      
                      {proj.full_content && (
                        <div className="text-xs sm:text-sm text-slate-600 prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: proj.full_content }} />
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
        </div>

        <div className="pt-4 sm:pt-6 mt-5 sm:mt-6 border-t border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5 sm:gap-3">
            {proj.github_link && (
              <a href={proj.github_link} target="_blank" rel="noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-slate-100 hover:bg-slate-900 hover:text-white text-slate-700 flex items-center justify-center transition-colors" title="GitHub Repository">
                <FiGithub className="text-sm sm:text-base" />
              </a>
            )}
            {proj.live_link && (
              <a href={proj.live_link} target="_blank" rel="noreferrer" className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-purple-100 hover:bg-purple-600 hover:text-white text-purple-700 flex items-center justify-center transition-colors" title="Live Demo">
                <FiExternalLink className="text-sm sm:text-base" />
              </a>
            )}
          </div>
          {proj.live_link ? (
            <a href={proj.live_link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 text-xs font-bold text-purple-600 hover:text-purple-800">
              <span>Visit Platform</span><FiArrowRight />
            </a>
          ) : (
            <span className="text-[11px] sm:text-xs font-semibold text-slate-400">Production Ready</span>
          )}
        </div>
      </div>
    </FadeInUp>
  );
};

export default function App() {
  const [data, setData] = useState(initialData);

  useEffect(() => {
    // Fetch live data from backend
    axios.get('/api/portfolio')
      .then(res => {
        if (res.data && res.data.profile && res.data.profile.full_name) {
          setData(prev => ({
            ...prev,
            ...res.data,
            profile: { ...prev.profile, ...res.data.profile }
          }));
        }
      })
      .catch(err => {
        console.log("Using initial portfolio data (Backend connection optional)");
      });
  }, []);

  const { profile, skills, exp, edu, completed, ongoing, demos, honors, papers } = data;

  const topFeatures = [
    {
      icon: <BiBrain className="text-3xl text-purple-600" />,
      title: "LLM & RAG Architectures",
      desc: "Designing autonomous AI assistants, vector search pipelines, and enterprise LLM solutions with LangChain and ChromaDB.",
      badge: "Generative AI",
      color: "bg-purple-50 border-purple-100 hover:border-purple-300"
    },
    {
      icon: <FiCpu className="text-3xl text-blue-600" />,
      title: "Computer Vision & Deep Learning",
      desc: "Medical imaging, transfer learning, multi-class classification, and custom neural architectures for high accuracy diagnosis.",
      badge: "Deep Learning",
      color: "bg-blue-50 border-blue-100 hover:border-blue-300"
    },
    {
      icon: <FiLayers className="text-3xl text-emerald-600" />,
      title: "Full-Stack Web & Scalable APIs",
      desc: "High performance web platforms, REST APIs with FastAPI & Flask, interactive React frontends, and automated cloud workflows.",
      badge: "Full-Stack",
      color: "bg-emerald-50 border-emerald-100 hover:border-emerald-300"
    }
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-800 font-sans selection:bg-purple-500 selection:text-white overflow-x-hidden w-full max-w-full">
      {/* NAVBAR */}
      <header className="fixed top-0 left-0 right-0 z-40 bg-white/85 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <a href="#" className="flex items-center gap-2.5 sm:gap-3 group min-w-0">
            <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white font-bold text-base sm:text-lg shadow-md group-hover:scale-105 transition-transform flex-shrink-0">
              {profile.full_name ? profile.full_name[0] : 'R'}
            </div>
            <div className="flex flex-col min-w-0">
              <span className="font-bold text-sm sm:text-lg tracking-tight text-slate-900 group-hover:text-purple-600 transition-colors truncate">
                {profile.full_name}
              </span>
              <span className="text-[10px] sm:text-xs text-purple-600 font-medium truncate">AI & Software Engineer</span>
            </div>
          </a>

          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-slate-600">
            <a href="#about" className="hover:text-purple-600 transition-colors">About</a>
            <a href="#features" className="hover:text-purple-600 transition-colors">Specialties</a>
            <a href="#projects" className="hover:text-purple-600 transition-colors">Projects</a>
            {demos && demos.length > 0 && (
              <a href="#demos" className="hover:text-purple-600 transition-colors">Demos</a>
            )}
            <a href="#skills" className="hover:text-purple-600 transition-colors">Skills</a>
            <a href="#experience" className="hover:text-purple-600 transition-colors">Experience</a>
            <a href="#contact" className="hover:text-purple-600 transition-colors">Contact</a>
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
            <a
              href="/download_resume"
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-slate-900 hover:bg-purple-600 text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-md transition-all duration-200"
            >
              <FiDownload className="text-sm sm:text-base" />
              <span>Resume</span>
            </a>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 sm:pt-32 pb-16 sm:pb-24 space-y-20 sm:space-y-32 overflow-hidden w-full">
        {/* HERO SECTION */}
        <section id="about" className="relative pt-4 sm:pt-6">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-16">
            <div className="w-full lg:w-3/5 space-y-6 sm:space-y-8">
              <FadeInUp>
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 sm:px-4 sm:py-2 rounded-full bg-purple-100/80 border border-purple-200/60 text-purple-800 text-[11px] sm:text-xs font-semibold tracking-wide">
                  <span className="w-2 h-2 rounded-full bg-purple-600 animate-pulse"></span>
                  AVAILABLE FOR AI & FULL-STACK PROJECTS
                </div>
              </FadeInUp>

              <FadeInUp delay={0.1}>
                <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.2] sm:leading-[1.15] break-words">
                  Hi, I'm <span className="bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 bg-clip-text text-transparent">{profile.full_name}</span>
                </h1>
                <p className="text-sm sm:text-lg lg:text-xl text-slate-600 mt-3 sm:mt-4 leading-relaxed font-normal break-words">
                  Artificial Intelligence Specialist & Senior Software Engineer. Bridging modern machine learning research with robust, scalable software products.
                </p>
              </FadeInUp>

              <FadeInUp delay={0.2}>
                <div className="flex flex-wrap items-center gap-3 sm:gap-4 pt-1 sm:pt-2 w-full">
                  {profile.email && profile.show_email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center justify-center gap-2 px-5 sm:px-7 py-3 sm:py-3.5 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white text-xs sm:text-sm font-medium shadow-md shadow-purple-500/20 hover:shadow-purple-500/35 hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <FiMail className="text-base" />
                      <span>Get In Touch</span>
                    </a>
                  )}

                  {profile.telegram && (
                    <a
                      href={profile.telegram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-sky-500 hover:bg-sky-600 text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <FaTelegramPlane className="text-base" />
                      <span>Telegram</span>
                    </a>
                  )}

                  {profile.github && (
                    <a
                      href={profile.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-white border border-slate-200 hover:border-slate-300 text-slate-800 text-xs sm:text-sm font-medium shadow-xs hover:shadow hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <FiGithub className="text-base" />
                      <span>GitHub</span>
                    </a>
                  )}

                  {profile.twitter && (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <FiTwitter className="text-base" />
                      <span>Twitter</span>
                    </a>
                  )}

                  {profile.youtube && (
                    <a
                      href={profile.youtube}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 sm:px-6 py-3 sm:py-3.5 rounded-full bg-red-600 hover:bg-red-700 text-white text-xs sm:text-sm font-medium shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                    >
                      <FaYoutube className="text-base" />
                      <span>YouTube</span>
                    </a>
                  )}
                </div>
              </FadeInUp>

              {/* STATS ROW */}
              <FadeInUp delay={0.3}>
                <div className="grid grid-cols-3 gap-2 sm:gap-6 pt-4 sm:pt-6 border-t border-slate-200/80">
                  <div className="bg-slate-50/80 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl text-center sm:text-left">
                    <div className="text-xl sm:text-3xl font-extrabold text-slate-900">20/20</div>
                    <div className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 sm:mt-1 leading-tight">Thesis Grade</div>
                  </div>
                  <div className="bg-slate-50/80 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl text-center sm:text-left">
                    <div className="text-xl sm:text-3xl font-extrabold text-purple-600">6+</div>
                    <div className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 sm:mt-1 leading-tight">Years Exp</div>
                  </div>
                  <div className="bg-slate-50/80 sm:bg-transparent p-2.5 sm:p-0 rounded-2xl text-center sm:text-left">
                    <div className="text-xl sm:text-3xl font-extrabold text-indigo-600">10+</div>
                    <div className="text-[10px] sm:text-xs font-medium text-slate-500 mt-0.5 sm:mt-1 leading-tight">AI & Web Apps</div>
                  </div>
                </div>
              </FadeInUp>
            </div>

            {/* HERO RIGHT CARD */}
            <div className="w-full lg:w-2/5 flex justify-center relative max-w-full overflow-hidden sm:overflow-visible">
              <FadeInUp delay={0.2} className="relative w-full max-w-sm sm:max-w-md">
                <div className="relative bg-white rounded-3xl p-5 sm:p-6 shadow-xl border border-slate-100 flex flex-col items-center text-center">
                  <div className="relative w-32 h-32 sm:w-44 sm:h-44 mb-4 sm:mb-6">
                    <div className="w-full h-full rounded-2xl overflow-hidden bg-gradient-to-tr from-purple-100 to-indigo-100 border-4 border-white shadow-md flex items-center justify-center text-4xl sm:text-5xl font-bold text-purple-600">
                      {profile.profile_pic ? (
                        <img 
                          src={`/static/uploads/${profile.profile_pic}`} 
                          alt={profile.full_name} 
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <span>{profile.full_name ? profile.full_name[0] : 'R'}</span>
                      )}
                    </div>
                    <div className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 sm:p-2 rounded-xl shadow-lg border-2 border-white">
                      <BiCheck className="text-base sm:text-lg" />
                    </div>
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-slate-900">{profile.full_name}</h3>
                  <p className="text-xs sm:text-sm text-purple-600 font-medium mt-1">M.Sc. Artificial Intelligence</p>
                  
                  {profile.address && (
                    <div className="flex items-center gap-1.5 text-[11px] sm:text-xs text-slate-500 mt-2">
                      <FiMapPin className="text-purple-500 flex-shrink-0" />
                      <span>{profile.address}</span>
                    </div>
                  )}

                  {/* Micro Cards */}
                  <div className="w-full mt-5 sm:mt-6 space-y-2.5 sm:space-y-3">
                    <div className="p-3 sm:p-3.5 rounded-2xl bg-purple-50/80 border border-purple-100 flex items-center gap-3 text-left">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <BiBrain className="text-base sm:text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">HybridCXR Diagnostic Model</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">Medical AI Classification</div>
                      </div>
                    </div>

                    <div className="p-3 sm:p-3.5 rounded-2xl bg-indigo-50/80 border border-indigo-100 flex items-center gap-3 text-left">
                      <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center flex-shrink-0 shadow-xs">
                        <FiCode className="text-base sm:text-lg" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-bold text-slate-900 truncate">RAG & Chatbot Systems</div>
                        <div className="text-[10px] sm:text-[11px] text-slate-500 truncate">Fast Vector Retrieval</div>
                      </div>
                    </div>
                  </div>
                </div>
              </FadeInUp>
            </div>
          </div>
        </section>

        {/* SPECIALTIES / FEATURES (3 CIRCLE STYLE) */}
        <section id="features" className="relative">
          <FadeInUp>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="text-xs font-bold tracking-widest text-purple-600 uppercase bg-purple-100/80 px-3 py-1.5 rounded-full">
                Key Competencies
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 sm:mt-4 tracking-tight">
                Architecting Intelligence & Web Systems
              </h2>
              <p className="text-slate-600 mt-2 sm:mt-3 text-xs sm:text-sm lg:text-base leading-relaxed">
                Specialized in deep neural network design, custom retrieval-augmented generation, and full-stack software architecture.
              </p>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            {topFeatures.map((feat, idx) => (
              <FadeInUp key={idx} delay={idx * 0.15}>
                <div className={`h-full p-6 sm:p-8 rounded-3xl border transition-all duration-300 shadow-xs hover:shadow-xl hover:-translate-y-1 flex flex-col justify-between ${feat.color}`}>
                  <div>
                    <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white shadow-xs flex items-center justify-center mb-5 sm:mb-6">
                      {feat.icon}
                    </div>
                    <span className="text-xs font-bold uppercase tracking-wider text-purple-600">{feat.badge}</span>
                    <h3 className="text-lg sm:text-xl font-bold text-slate-900 mt-1.5 mb-2 sm:mb-3">{feat.title}</h3>
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{feat.desc}</p>
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section id="projects" className="relative">
          <FadeInUp>
            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
              <div>
                <span className="text-xs font-bold tracking-widest text-indigo-600 uppercase bg-indigo-100/80 px-3 py-1.5 rounded-full">
                  Portfolio Showcase
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 sm:mt-4 tracking-tight">
                  Featured Projects & Platforms
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-medium text-slate-500">Showing all completed & ongoing work</span>
              </div>
            </div>
          </FadeInUp>

          {/* PROJECT CARDS GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 min-w-0">
            {completed.concat(ongoing).map((proj, idx) => (
              <ProjectCard key={idx} proj={proj} delay={idx * 0.1} />
            ))}
          </div>
        </section>

        {/* WEBSITE DEMOS SECTION */}
        {demos && demos.length > 0 && (
          <section id="demos" className="relative">
            <FadeInUp>
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 sm:mb-12 gap-4">
                <div>
                  <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-100/80 px-3 py-1.5 rounded-full">
                    Interactive Demos
                  </span>
                  <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 sm:mt-4 tracking-tight">
                    Live Website Designs & Templates
                  </h2>
                  <p className="text-slate-600 mt-2 text-xs sm:text-sm">
                    Explore live interactive demos of custom web templates and designs. Fully responsive & customizable.
                  </p>
                </div>
              </div>
            </FadeInUp>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {demos.map((demo, idx) => (
                <FadeInUp key={idx} delay={idx * 0.1}>
                  <div className="h-full bg-white rounded-3xl border border-slate-200/80 p-5 sm:p-6 shadow-xs hover:shadow-xl hover:border-purple-200 transition-all duration-300 flex flex-col justify-between group overflow-hidden">
                    <div>
                      {demo.media_file ? (
                        <div className="w-full aspect-video rounded-xl overflow-hidden mb-4 shadow-sm">
                          {demo.media_file.match(/\.(mp4|webm|ogg)$/i) ? (
                            <video src={`/static/uploads/${demo.media_file}`} autoPlay loop muted playsInline className="w-full h-full object-cover"></video>
                          ) : (
                            <img src={`/static/uploads/${demo.media_file}`} alt={demo.title} className="w-full h-full object-cover" />
                          )}
                        </div>
                      ) : (
                        <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg sm:text-xl mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300">
                          <BiBookOpen />
                        </div>
                      )}
                      <h3 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-purple-600 transition-colors break-words">
                        {demo.title}
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-600 mt-2 line-clamp-3 leading-relaxed break-words">
                        {demo.description}
                      </p>
                    </div>

                    <div className="mt-5 sm:mt-6 pt-4 border-t border-slate-100">
                      <a
                        href={`/demo/${demo.slug}/`}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center justify-center gap-2 w-full py-2.5 rounded-xl bg-purple-50 hover:bg-purple-600 text-purple-700 hover:text-white text-xs font-bold transition-all duration-200"
                      >
                        <span>View Live Demo</span>
                        <FiExternalLink />
                      </a>
                    </div>
                  </div>
                </FadeInUp>
              ))}
            </div>
          </section>
        )}

        {/* SKILLS MATRIX */}
        <section id="skills" className="relative">
          <FadeInUp>
            <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
              <span className="text-xs font-bold tracking-widest text-emerald-600 uppercase bg-emerald-100/80 px-3 py-1.5 rounded-full">
                Technical Stack
              </span>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 mt-3 sm:mt-4 tracking-tight">
                Skills & Proficiencies
              </h2>
            </div>
          </FadeInUp>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {skills.map((s, idx) => (
              <FadeInUp key={idx} delay={idx * 0.04}>
                <div className="bg-white p-4 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:border-purple-200 transition-all overflow-hidden">
                  <div className="flex justify-between items-center mb-2.5 sm:mb-3 gap-2">
                    <span className="font-bold text-xs sm:text-sm text-slate-900 truncate">{s.name}</span>
                    <span className="text-[11px] sm:text-xs font-extrabold text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md flex-shrink-0">{s.level}%</span>
                  </div>
                  <div className="w-full bg-slate-100 rounded-full h-1.5 sm:h-2 overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      whileInView={{ width: `${s.level}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1, ease: "easeOut", delay: idx * 0.04 }}
                      className="bg-gradient-to-r from-purple-600 to-indigo-600 h-full rounded-full"
                    />
                  </div>
                </div>
              </FadeInUp>
            ))}
          </div>
        </section>

        {/* EXPERIENCE & EDUCATION TIMELINE */}
        <section id="experience" className="relative">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12">
            {/* WORK EXPERIENCE */}
            <FadeInUp>
              <div>
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                    <BiBriefcase />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Work Experience</h3>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {exp.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative pl-6 sm:pl-8 border-l-4 border-l-purple-600 overflow-hidden">
                      <div className="text-[11px] sm:text-xs font-bold text-purple-600 uppercase tracking-wide">{item.duration}</div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1 break-words">{item.title}</h4>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700 mb-2.5 sm:mb-3">{item.organization}</div>
                      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: item.description }} />
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUp>

            {/* EDUCATION & HONORS */}
            <FadeInUp delay={0.15}>
              <div>
                <div className="flex items-center gap-3 mb-6 sm:mb-8">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center text-lg sm:text-xl flex-shrink-0">
                    <BiBookOpen />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-slate-900">Education & Honors</h3>
                </div>

                <div className="space-y-4 sm:space-y-6">
                  {edu.map((item, idx) => (
                    <div key={idx} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative pl-6 sm:pl-8 border-l-4 border-l-indigo-600 overflow-hidden">
                      <div className="text-[11px] sm:text-xs font-bold text-indigo-600 uppercase tracking-wide">{item.duration}</div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1 break-words">{item.title}</h4>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700 mb-2">{item.organization}</div>
                      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: item.description }} />
                    </div>
                  ))}

                  {honors.map((item, idx) => (
                    <div key={`honor-${idx}`} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative pl-6 sm:pl-8 border-l-4 border-l-amber-500 overflow-hidden">
                      <div className="text-[11px] sm:text-xs font-bold text-amber-600 uppercase tracking-wide">{item.duration}</div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1 break-words">{item.title}</h4>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700 mb-2">{item.organization}</div>
                      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: item.description }} />
                    </div>
                  ))}

                  {papers.map((item, idx) => (
                    <div key={`paper-${idx}`} className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/80 shadow-xs relative pl-6 sm:pl-8 border-l-4 border-l-teal-500 overflow-hidden">
                      <div className="text-[11px] sm:text-xs font-bold text-teal-600 uppercase tracking-wide">{item.duration}</div>
                      <h4 className="text-base sm:text-lg font-bold text-slate-900 mt-1 break-words">{item.title}</h4>
                      <div className="text-xs sm:text-sm font-semibold text-slate-700 mb-2">{item.organization}</div>
                      <div className="text-xs sm:text-sm text-slate-600 leading-relaxed break-words" dangerouslySetInnerHTML={{ __html: item.description }} />
                    </div>
                  ))}
                </div>
              </div>
            </FadeInUp>
          </div>
        </section>

        {/* CONTACT BANNER */}
        <section id="contact" className="relative">
          <FadeInUp>
            <div className="rounded-3xl bg-gradient-to-r from-purple-900 via-indigo-900 to-slate-900 text-white p-6 sm:p-10 lg:p-16 relative overflow-hidden shadow-xl">
              <div className="max-w-2xl space-y-4 sm:space-y-6 relative z-10">
                <span className="text-xs font-bold tracking-widest text-purple-300 uppercase bg-white/10 px-3 py-1.5 rounded-full backdrop-blur-sm">
                  Let's Collaborate
                </span>
                <h2 className="text-2xl sm:text-3xl lg:text-5xl font-extrabold tracking-tight break-words leading-tight">
                  Have an AI project or need high-impact engineering?
                </h2>
                <p className="text-slate-300 text-xs sm:text-base leading-relaxed break-words">
                  Feel free to contact me via email, Telegram or WhatsApp. I am always open to discussing cutting-edge AI systems, research, or custom software development.
                </p>

                <div className="flex flex-wrap gap-3 sm:gap-4 pt-2 sm:pt-4">
                  {profile.email && (
                    <a
                      href={`mailto:${profile.email}`}
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white text-slate-900 font-bold text-xs sm:text-sm shadow hover:bg-purple-50 transition break-all"
                    >
                      <FiMail className="flex-shrink-0" />
                      <span>{profile.email}</span>
                    </a>
                  )}
                  {profile.telegram && (
                    <a
                      href={profile.telegram}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-sky-500 text-white font-bold text-xs sm:text-sm shadow hover:bg-sky-600 transition"
                    >
                      <FaTelegramPlane className="flex-shrink-0" />
                      <span>Message on Telegram</span>
                    </a>
                  )}
                  {profile.twitter && (
                    <a
                      href={profile.twitter}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full bg-blue-500 text-white font-bold text-xs sm:text-sm shadow hover:bg-blue-600 transition"
                    >
                      <FiTwitter className="flex-shrink-0" />
                      <span>Twitter</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          </FadeInUp>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-200 bg-white pt-8 pb-24 sm:py-12 text-slate-500 text-xs sm:text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-4 sm:gap-6 text-center md:text-left">
          <div>
            <div className="font-bold text-slate-900 text-sm sm:text-base">{profile.full_name}</div>
            <div className="text-[11px] sm:text-xs text-slate-400 mt-0.5 sm:mt-1">© {new Date().getFullYear()} All Rights Reserved.</div>
          </div>
          <div className="flex items-center gap-5 sm:gap-6 text-slate-600">
            {profile.github && <a href={profile.github} target="_blank" rel="noreferrer" className="hover:text-purple-600"><FiGithub className="text-base sm:text-lg" /></a>}
            {profile.linkedin && <a href={profile.linkedin} target="_blank" rel="noreferrer" className="hover:text-purple-600"><FiLinkedin className="text-base sm:text-lg" /></a>}
            {profile.telegram && <a href={profile.telegram} target="_blank" rel="noreferrer" className="hover:text-purple-600"><FaTelegramPlane className="text-base sm:text-lg" /></a>}
            {profile.twitter && <a href={profile.twitter} target="_blank" rel="noreferrer" className="hover:text-blue-500"><FiTwitter className="text-base sm:text-lg" /></a>}
            {profile.youtube && <a href={profile.youtube} target="_blank" rel="noreferrer" className="hover:text-red-600"><FaYoutube className="text-base sm:text-lg" /></a>}
            {profile.email && <a href={`mailto:${profile.email}`} className="hover:text-purple-600"><FiMail className="text-base sm:text-lg" /></a>}
          </div>
        </div>
      </footer>

      {/* FLOATING AI ASSISTANT */}
      <ChatWidget />
    </div>
  );
}
