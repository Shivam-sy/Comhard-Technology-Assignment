import React, { useRef } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import OrbitalHub from '../components/home/OrbitalHub';
import InteractiveDeskPreview from '../components/home/InteractiveDeskPreview';
import {
  ArrowRight,
  Play,
  Star,
  CheckCircle2,
  Shield,
  Clock,
  MessageSquare,
  Users,
  Layers,
  Zap,
  Lock,
  ChevronRight,
  Activity,
  LifeBuoy,
} from 'lucide-react';

export function HomePage() {
  const demoRef = useRef(null);

  const scrollToDemo = () => {
    demoRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-white text-slate-900 selection:bg-indigo-100 selection:text-indigo-900 flex flex-col">
      {/* Navigation Header - Matches Exact Reference Screenshot */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-sm border-b border-slate-100/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 h-18 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-black text-white flex items-center justify-center font-bold text-base shadow-xs">
              F
            </div>
            <span className="font-bold text-xl tracking-tight text-black">
              Desk Flow
            </span>
          </Link>

          {/* Center Nav Links: Features, How it works, Pricing */}
          <nav className="hidden md:flex items-center gap-10 text-sm font-medium text-slate-600">
            <a href="#features" className="hover:text-black transition-colors">Features</a>
            <a href="#how-it-works" className="hover:text-black transition-colors">How it works</a>
            <a href="#pricing" className="hover:text-black transition-colors">Pricing</a>
          </nav>

          {/* Right Nav Actions: Log in, Get Started */}
          <div className="flex items-center gap-6">
            <Link
              to="/portal/dashboard"
              className="text-sm font-medium text-slate-700 hover:text-black transition-colors"
            >
              Log in
            </Link>

            <Link
              to="/staff/dashboard"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-full bg-black hover:bg-neutral-800 text-white text-sm font-semibold transition-all shadow-xs"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-grid-pattern pt-10 pb-20 md:py-24 border-b border-slate-100">
        {/* Subtle radial ambient gradient behind hero (soft neutral, zero neon!) */}
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[520px] h-[520px] bg-indigo-50/40 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-7 text-left">
              {/* Engine V2.0 Pill Badge */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4 }}
                className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-2xs text-[11px] font-semibold text-slate-800 uppercase tracking-wider"
              >
                <span className="w-2 h-2 rounded-full bg-indigo-600 animate-pulse" />
                <span>DESK FLOW ENGINE V2.0</span>
              </motion.div>

              {/* Main Headline */}
              <motion.h1
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight text-black leading-[1.06]"
              >
                Your business<br />
                runs on<br />
                intelligence.
              </motion.h1>

              {/* Subtitle */}
              <motion.p
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed font-normal"
              >
                Capture tickets and inquiries across WhatsApp, web, and email. Qualify instantly, follow-up autonomously, and resolve issues—<strong>zero human touch required</strong>.
              </motion.p>

              {/* Action Buttons matching reference */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="flex flex-wrap items-center gap-4 pt-2"
              >
                <Link
                  to="/staff/dashboard"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-black hover:bg-neutral-800 text-white font-semibold text-sm transition-all shadow-md hover:shadow-lg active:scale-98"
                >
                  <span>Deploy Agent</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <button
                  onClick={scrollToDemo}
                  className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full bg-white hover:bg-slate-50 text-slate-800 font-semibold text-sm border border-slate-200/90 shadow-2xs hover:border-slate-300 transition-all cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-slate-800 text-slate-800" />
                  <span>Watch Demo</span>
                </button>
              </motion.div>

              {/* Trust & Social Proof Bar */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="pt-4 flex items-center gap-4 text-xs text-slate-500"
              >
                {/* Overlapping customer avatars */}
                <div className="flex -space-x-2">
                  <img
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=60&auto=format&fit=crop&q=80"
                    alt="Support User"
                  />
                  <img
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=60&auto=format&fit=crop&q=80"
                    alt="Support User"
                  />
                  <img
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=60&auto=format&fit=crop&q=80"
                    alt="Support User"
                  />
                  <img
                    className="w-7 h-7 rounded-full border-2 border-white object-cover"
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=60&auto=format&fit=crop&q=80"
                    alt="Support User"
                  />
                </div>

                {/* Stars and rating */}
                <div className="flex items-center gap-1.5">
                  <div className="flex text-amber-400">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                    ))}
                  </div>
                  <span className="font-semibold text-slate-800">4.9/5</span>
                  <span>from 1,200+ customer support teams</span>
                </div>
              </motion.div>
            </div>

            {/* Right Orbital Graphic (From Reference Screenshot) */}
            <div className="lg:col-span-5 flex items-center justify-center">
              <OrbitalHub />
            </div>
          </div>
        </div>
      </section>

      {/* Clean White Stats Strip */}
      <section className="border-b border-slate-100 bg-white py-10">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-y md:divide-y-0 md:divide-x divide-slate-100">
            <div className="pt-4 md:pt-0">
              <p className="text-3xl font-extrabold text-slate-950 tracking-tight">24h SLA</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Deterministic Overdue Engine</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl font-extrabold text-slate-950 tracking-tight">100%</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Internal Note Privacy Isolation</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl font-extrabold text-slate-950 tracking-tight">PostgreSQL</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Relational Consistency via Prisma</p>
            </div>
            <div className="pt-4 md:pt-0">
              <p className="text-3xl font-extrabold text-slate-950 tracking-tight">Two-Column</p>
              <p className="text-xs text-slate-500 font-medium mt-1">Freshdesk-Inspired Workspace</p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 text-center space-y-12">
          <div className="max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Core Capabilities
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
              Designed for speed. Built for support excellence.
            </h2>
            <p className="text-sm text-slate-500">
              Purpose-built ticket management inspired by Freshdesk's industry-standard support operations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 text-left">
            {/* Feature 1 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-900 flex items-center justify-center font-bold">
                <Layers className="w-5 h-5 text-indigo-600" />
              </div>
              <h3 className="font-bold text-base text-slate-950">Two-Column Workspace</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Chronological conversation stream on the left, and instant property controls (Status, Priority, Assignee, SLA) on the right.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-900 flex items-center justify-center font-bold">
                <Lock className="w-5 h-5 text-amber-600" />
              </div>
              <h3 className="font-bold text-base text-slate-950">Private Internal Notes</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dedicated warm amber workspace for confidential team collaboration. Internal notes are strictly excluded from customer API responses.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-900 flex items-center justify-center font-bold">
                <Clock className="w-5 h-5 text-rose-600" />
              </div>
              <h3 className="font-bold text-base text-slate-950">24-Hour SLA Monitor</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Evaluates <code className="text-rose-700 bg-rose-50 px-1 py-0.5 rounded font-mono text-[11px]">status !== RESOLVED &amp;&amp; createdAt &lt; 24h</code>. Resolved tickets never trigger overdue alerts.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white p-6 rounded-2xl border border-slate-200/90 shadow-sm hover:shadow-md transition-shadow space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-900 flex items-center justify-center font-bold">
                <Activity className="w-5 h-5 text-emerald-600" />
              </div>
              <h3 className="font-bold text-base text-slate-950">Prisma Audit History</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Every ticket assignment, status transition, and priority change is recorded atomically in PostgreSQL transaction logs.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Live Playground Section */}
      <section ref={demoRef} className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-6 sm:px-10 lg:px-12 text-center space-y-8">
          <div className="max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Live Interactive Workspace
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-950 tracking-tight">
              Test Desk Flow in Real Time
            </h2>
            <p className="text-sm text-slate-500">
              Toggle between the Support Staff Workspace and Customer Self-Service Portal below. Test sending public replies and confidential internal notes.
            </p>
          </div>

          <InteractiveDeskPreview />
        </div>
      </section>

      {/* How it Works / 4-Step Support Lifecycle */}
      <section id="how-it-works" className="py-20 bg-slate-50/50 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Support Workflow
            </span>
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight">
              From inquiry to resolution
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-left">
            <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">STAGE 01</span>
              <h4 className="font-bold text-base text-slate-900">Ticket Submission</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                Customer submits an issue via the self-service portal. The ticket is validated with Zod and saved to PostgreSQL with OPEN status.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">STAGE 02</span>
              <h4 className="font-bold text-base text-slate-900">Admin Assignment</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The support manager reviews the unassigned queue on the Helpdesk Overview and assigns an authorized support agent.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">STAGE 03</span>
              <h4 className="font-bold text-base text-slate-900">Triage & Notes</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The agent updates status to IN_PROGRESS, investigates logs, posts private internal notes, and sends public updates.
              </p>
            </div>

            <div className="p-6 bg-white rounded-xl border border-slate-200/80 shadow-2xs space-y-2">
              <span className="text-xs font-mono font-bold text-slate-400">STAGE 04</span>
              <h4 className="font-bold text-base text-slate-900">Resolution & Audit</h4>
              <p className="text-xs text-slate-500 leading-relaxed">
                The agent marks the ticket RESOLVED. The customer reviews the resolution, and all activity is preserved in ActivityLog.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing / SLA Section */}
      <section id="pricing" className="py-20 bg-white border-b border-slate-100">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 text-center space-y-12">
          <div className="max-w-xl mx-auto space-y-2">
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-widest">
              Clear Tiers
            </span>
            <h2 className="text-3xl font-bold text-slate-950 tracking-tight">
              Predictable support for fast teams
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Zero hidden limits. Full PostgreSQL database ownership and instant deployment.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {/* Tier 1 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Starter</span>
              <div className="text-3xl font-extrabold text-black">$0 <span className="text-xs text-slate-400 font-normal">/ forever</span></div>
              <p className="text-xs text-slate-500">For small teams building out their initial support portal.</p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Unlimited customer tickets</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Up to 3 support agents</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Public replies</li>
              </ul>
              <Link to="/portal/dashboard" className="block text-center w-full py-2 rounded-lg border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50">
                Get Started
              </Link>
            </div>

            {/* Tier 2 - Recommended */}
            <div className="p-6 rounded-2xl border-2 border-slate-950 bg-white space-y-4 shadow-lg relative">
              <span className="absolute -top-3 right-6 bg-slate-950 text-white text-[10px] uppercase font-bold tracking-widest px-2.5 py-0.5 rounded-full">
                Most Popular
              </span>
              <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Pro Helpdesk</span>
              <div className="text-3xl font-extrabold text-black">$49 <span className="text-xs text-slate-400 font-normal">/ seat / mo</span></div>
              <p className="text-xs text-slate-500">Complete Freshdesk workflow with confidential notes and 24h SLA.</p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Everything in Starter</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Private internal notes</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 24-hour overdue SLA rules</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Full Prisma audit logging</li>
              </ul>
              <Link to="/staff/dashboard" className="block text-center w-full py-2 rounded-lg bg-black text-white font-semibold text-xs hover:bg-neutral-800 shadow-sm">
                Deploy Agent Desk
              </Link>
            </div>

            {/* Tier 3 */}
            <div className="p-6 rounded-2xl border border-slate-200 bg-white space-y-4">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Enterprise</span>
              <div className="text-3xl font-extrabold text-black">$199 <span className="text-xs text-slate-400 font-normal">/ custom</span></div>
              <p className="text-xs text-slate-500">Dedicated PostgreSQL cluster with custom role definitions.</p>
              <ul className="text-xs text-slate-600 space-y-2 pt-2 border-t border-slate-100">
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Custom role permissions</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> Dedicated database partition</li>
                <li className="flex items-center gap-2"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" /> 99.99% uptime guarantee</li>
              </ul>
              <Link to="/staff/dashboard" className="block text-center w-full py-2 rounded-lg border border-slate-300 font-semibold text-xs text-slate-700 hover:bg-slate-50">
                Contact Sales
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* High-Impact Clean CTA */}
      <section className="py-16 bg-white">
        <div className="max-w-5xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="bg-black text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="max-w-xl mx-auto space-y-3">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">
                Experience customer support that flows.
              </h2>
              <p className="text-sm text-slate-400">
                Explore the full-stack PostgreSQL application right now. Access the Staff Workspace to manage tickets or test the Customer Portal.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link
                to="/staff/dashboard"
                className="px-6 py-3 rounded-full bg-white text-black font-bold text-sm hover:bg-slate-100 transition shadow-sm"
              >
                Launch Staff Desk
              </Link>
              <Link
                to="/portal/dashboard"
                className="px-6 py-3 rounded-full bg-neutral-900 hover:bg-neutral-800 text-white font-bold text-sm border border-neutral-800 transition"
              >
                Open Customer Portal
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Minimal Monochrome Footer */}
      <footer className="mt-auto border-t border-slate-200 bg-white py-8 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-black text-sm">
            <div className="w-6 h-6 rounded-md bg-black text-white flex items-center justify-center text-xs">
              F
            </div>
            <span>Desk Flow</span>
          </div>

          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-emerald-600 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              PostgreSQL &amp; Prisma Active
            </span>
            <span>Zero AI Slope Design</span>
            <span>&copy; {new Date().getFullYear()} Desk Flow System</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;
