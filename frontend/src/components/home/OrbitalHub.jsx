import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Shield, Sparkles, Clock, MessageSquare, CheckCircle, ArrowUpRight, Zap } from 'lucide-react';

const ORBITAL_NODES = [
  {
    id: 1,
    label: 'Smart Triage',
    desc: 'Auto-prioritizes incoming support tickets',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=120&auto=format&fit=crop&q=80',
    angle: -90, // top
    status: 'ACTIVE',
    badge: 'Urgent',
  },
  {
    id: 2,
    label: 'Agent Routing',
    desc: 'Assigns tickets to authorized support agents',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=120&auto=format&fit=crop&q=80',
    angle: -38, // top-right
    status: 'ASSIGNED',
    badge: 'Jane Agent',
  },
  {
    id: 3,
    label: 'Customer Portal',
    desc: 'Self-service ticket tracking & replies',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=120&auto=format&fit=crop&q=80',
    angle: 18, // right
    status: 'OPEN',
    badge: 'Alice Cooper',
  },
  {
    id: 4,
    label: '24h SLA Engine',
    desc: 'Enforces deterministic overdue breach rules',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=120&auto=format&fit=crop&q=80',
    angle: 75, // bottom-right
    status: 'MONITORING',
    badge: '< 24h SLA',
  },
  {
    id: 5,
    label: 'Internal Notes',
    desc: 'Confidential staff collaboration space',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=120&auto=format&fit=crop&q=80',
    angle: 135, // bottom-left
    status: 'CONFIDENTIAL',
    badge: 'Staff Only',
  },
  {
    id: 6,
    label: 'Rapid Resolve',
    desc: 'Resolved with transactional Prisma audit trail',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=120&auto=format&fit=crop&q=80',
    angle: 200, // left
    status: 'RESOLVED',
    badge: '100% Audit',
  },
];

export function OrbitalHub() {
  const [activeNode, setActiveNode] = useState(null);

  // Radius for circular distribution
  const RADIUS = 160;

  return (
    <div className="relative w-full max-w-[500px] h-[480px] flex items-center justify-center select-none">
      {/* Background concentric orbital guide rings */}
      <div className="absolute w-[360px] h-[360px] rounded-full border border-slate-200/80 pointer-events-none" />
      <div className="absolute w-[260px] h-[260px] rounded-full border border-dashed border-slate-200 pointer-events-none" />
      <div className="absolute w-[160px] h-[160px] rounded-full border border-slate-100 pointer-events-none" />

      {/* SVG Connecting radiating lines from center to each node */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 500 480">
        <defs>
          <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#4f46e5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#94a3b8" stopOpacity="0.15" />
          </linearGradient>
          <linearGradient id="activeLineGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#6366f1" stopOpacity="0.7" />
          </linearGradient>
        </defs>

        {ORBITAL_NODES.map((node) => {
          const rad = (node.angle * Math.PI) / 180;
          const cx = 250;
          const cy = 240;
          const x = cx + RADIUS * Math.cos(rad);
          const y = cy + RADIUS * Math.sin(rad);
          const isHovered = activeNode?.id === node.id;

          return (
            <g key={node.id}>
              {/* Connector line */}
              <line
                x1={cx}
                y1={cy}
                x2={x}
                y2={y}
                stroke={isHovered ? 'url(#activeLineGrad)' : 'url(#lineGrad)'}
                strokeWidth={isHovered ? '2' : '1.2'}
                strokeDasharray={isHovered ? 'none' : '3 3'}
                className="transition-all duration-300"
              />
              {/* Junction dot at node */}
              <circle
                cx={x}
                cy={y}
                r={isHovered ? '4' : '2.5'}
                fill={isHovered ? '#4f46e5' : '#cbd5e1'}
                className="transition-all duration-300"
              />
            </g>
          );
        })}
      </svg>

      {/* Center Dynamic Core Hub (The Glowing Blue Sphere from reference) */}
      <motion.div
        animate={{
          scale: [1, 1.03, 1],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        className="relative z-10 w-28 h-28 rounded-full flex items-center justify-center cursor-pointer shadow-xl shadow-indigo-500/15"
      >
        {/* Deep blue/indigo gradient sphere */}
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-blue-700 via-indigo-600 to-blue-500 p-0.5 shadow-inner">
          <div className="w-full h-full rounded-full bg-gradient-to-b from-indigo-500/80 to-blue-700 flex items-center justify-center relative overflow-hidden">
            {/* Inner concentric ring pattern */}
            <div className="absolute w-20 h-20 rounded-full border border-white/20" />
            <div className="absolute w-12 h-12 rounded-full border border-white/30" />
            <div className="w-4 h-4 rounded-full bg-white shadow-sm shadow-white flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-600 animate-ping" />
            </div>
          </div>
        </div>

        {/* Ambient subtle glow ring */}
        <div className="absolute -inset-2 rounded-full border border-indigo-400/20 animate-pulse pointer-events-none" />
      </motion.div>

      {/* Floating Pill Badge below Center Core (Matches Reference Screenshot) */}
      <div className="absolute top-[284px] left-1/2 -translate-x-1/2 z-20 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-slate-200/90 shadow-sm text-xs font-semibold text-slate-800 whitespace-nowrap">
        <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Intelligent Connection</span>
      </div>

      {/* Orbiting Avatar Nodes */}
      {ORBITAL_NODES.map((node, i) => {
        const rad = (node.angle * Math.PI) / 180;
        const x = RADIUS * Math.cos(rad);
        const y = RADIUS * Math.sin(rad);
        const isHovered = activeNode?.id === node.id;

        return (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i, duration: 0.5 }}
            style={{
              transform: `translate(${x}px, ${y}px)`,
            }}
            onMouseEnter={() => setActiveNode(node)}
            onMouseLeave={() => setActiveNode(null)}
            className="absolute z-20 flex flex-col items-center cursor-pointer group"
          >
            {/* Avatar Pill / Circle */}
            <div
              className={`relative w-12 h-12 rounded-full p-0.5 transition-all duration-300 shadow-sm ${
                isHovered
                  ? 'scale-115 ring-4 ring-indigo-500/20 shadow-md shadow-indigo-500/10'
                  : 'hover:scale-105'
              } bg-white border border-slate-200`}
            >
              <img
                src={node.avatar}
                alt={node.label}
                className="w-full h-full rounded-full object-cover"
              />
              {/* Online status indicator dot */}
              <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white" />
            </div>

            {/* Label below node */}
            <span className="mt-1 text-[11px] font-semibold text-slate-700 bg-white/90 backdrop-blur-xs px-2 py-0.5 rounded-full border border-slate-200 shadow-2xs whitespace-nowrap transition-colors group-hover:text-indigo-600 group-hover:border-indigo-200">
              {node.label}
            </span>

            {/* Interactive Floating Detail Tooltip on Hover */}
            {isHovered && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="absolute -top-14 bg-slate-950 text-white text-[11px] py-1.5 px-3 rounded-lg shadow-xl border border-slate-800 whitespace-nowrap z-30 pointer-events-none flex items-center gap-1.5"
              >
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 animate-pulse" />
                <span className="font-semibold text-indigo-200">{node.badge}:</span>
                <span className="text-slate-300">{node.desc}</span>
              </motion.div>
            )}
          </motion.div>
        );
      })}
    </div>
  );
}

export default OrbitalHub;
