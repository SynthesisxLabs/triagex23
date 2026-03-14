import Link from "next/link";
import { Activity, ArrowRight, Shield, HeartPulse, Clock, Sparkles } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 selection:bg-blue-200 font-[family-name:var(--font-geist-sans)]">
      {/* Navbar */}
      <nav className="fixed w-full z-50 transition-all duration-300 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex items-center gap-2 group cursor-pointer">
              <div className="bg-blue-600 p-2 rounded-xl group-hover:scale-110 transition-transform duration-300">
                <Activity className="h-6 w-6 text-white" />
              </div>
              <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600 tracking-tight">
                TriageX
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#features" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Features</Link>
              <Link href="#solutions" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">Solutions</Link>
              <Link href="#about" className="text-slate-600 hover:text-blue-600 font-medium transition-colors">About Us</Link>
            </div>

            {/* Auth Buttons */}
            <div className="flex items-center gap-4">
              <Link 
                href="/login" 
                className="hidden md:inline-flex text-slate-600 hover:text-slate-900 font-semibold px-4 py-2 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-semibold rounded-full hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all duration-300 active:scale-95 group"
              >
                Get Started
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="pt-32 pb-16 sm:pt-40 sm:pb-24 lg:pb-32 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          
          {/* Background Decorative Elements */}
          <div className="absolute top-0 right-1/4 w-96 h-96 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
          <div className="absolute top-10 right-10 w-72 h-72 bg-indigo-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-1/4 w-96 h-96 bg-cyan-100 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

          <div className="relative text-center max-w-4xl mx-auto z-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 text-blue-700 font-medium text-sm mb-8 border border-blue-100 shadow-sm animate-fade-in-up">
              <Sparkles className="h-4 w-4" />
              <span>Next-Generation Healthcare Intelligence</span>
            </div>
            
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
              Smarter Care.<br className="hidden sm:block" />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
                Faster Response.
              </span>
            </h1>
            
            <p className="mt-6 text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed mb-10">
              The world's first AI-driven triage platform connecting patients, doctors, and emergency response in one seamless ecosystem.
            </p>
            
            <div className="flex flex-col sm:flex-row justify-center gap-4 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
              <Link 
                href="/login" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-semibold rounded-full hover:bg-slate-800 hover:shadow-xl hover:shadow-slate-200 transition-all duration-300 text-lg group"
              >
                Access Dashboard
                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#demo" 
                className="inline-flex items-center justify-center px-8 py-4 bg-white text-slate-700 font-semibold rounded-full border border-slate-200 hover:border-blue-200 hover:bg-blue-50 hover:text-blue-700 transition-all duration-300 text-lg shadow-sm"
              >
                Watch Demo
              </Link>
            </div>
          </div>
          
          {/* Feature Highlight Cards */}
          <div className="mt-24 grid grid-cols-1 gap-8 sm:grid-cols-3 max-w-5xl mx-auto relative z-10">
            {[
              { icon: <HeartPulse className="h-6 w-6 text-rose-500" />, title: "AI Triage", desc: "Instantly analyze symptoms and predict urgency with 98% accuracy." },
              { icon: <Clock className="h-6 w-6 text-blue-500" />, title: "Real-time Dispatch", desc: "Connect with the nearest ambulance in under 60 seconds." },
              { icon: <Shield className="h-6 w-6 text-emerald-500" />, title: "Secure Records", desc: "HIPAA-compliant, end-to-end encrypted medical history." }
            ].map((feature, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 hover:shadow-md hover:border-blue-100 transition-all duration-300 group">
                <div className="h-12 w-12 bg-slate-50 rounded-xl flex items-center justify-center mb-6 group-hover:bg-white group-hover:scale-110 group-hover:shadow-sm transition-all duration-300">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title}</h3>
                <p className="text-slate-600 leading-relaxed">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
