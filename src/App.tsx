import React from 'react';
import { motion } from 'motion/react';
import { SnakeGame } from './components/SnakeGame';
import { MusicPlayer } from './components/MusicPlayer';
import { GlitchedText } from './components/GlitchedText';
import { Terminal, Database, Activity, Cpu } from 'lucide-react';

export default function App() {
  const [currentScore, setCurrentScore] = React.useState(0);

  return (
    <div className="min-h-screen bg-dark-bg relative selection:bg-neon-pink selection:text-white overflow-hidden">
      <div className="scanline" />
      
      <div className="bento-grid">
        {/* Header - spans all columns */}
        <header className="card header neon-cyan-glow flex items-center justify-between px-8 bg-black/60">
          <div className="flex items-center gap-2">
            <span className="font-extrabold tracking-[0.2em] text-2xl uppercase">Neon</span>
            <span className="text-neon-cyan font-light tracking-[0.2em] text-2xl uppercase">Synth</span>
          </div>
          <div className="hidden md:flex gap-8 text-[10px] font-mono uppercase tracking-widest opacity-60">
            <div className="flex items-center gap-2 border-r border-white/10 pr-8">
              <Activity className="w-3 h-3 text-neon-lime" />
              <span>Status: Optimal</span>
            </div>
            <div className="flex items-center gap-2 border-r border-white/10 pr-8">
              <Database className="w-3 h-3 text-neon-cyan" />
              <span>Link: Secure</span>
            </div>
            <div className="flex items-center gap-2">
              <Cpu className="w-3 h-3 text-neon-pink" />
              <span>CPU: 42%</span>
            </div>
          </div>
        </header>

        {/* Sidebar Left */}
        <aside className="sidebar-left flex flex-col gap-4">
          <div className="card flex-1 p-6 overflow-hidden flex flex-col">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] opacity-40 mb-6 flex items-center gap-2">
              <Music2 className="w-3 h-3" />
              Neural Stream
            </h3>
            <div className="flex-1 overflow-y-auto space-y-4 pr-2 custom-scrollbar">
              {['Neon Pulse', 'Cyber Drip', 'Digital Ghost'].map((track, i) => (
                <div key={i} className={`p-3 rounded-lg border border-white/5 transition-all cursor-pointer ${i === 0 ? 'bg-neon-cyan/10 border-neon-cyan/20 text-neon-cyan' : 'hover:bg-white/5'}`}>
                  <div className="text-xs font-bold">{track}</div>
                  <div className="text-[10px] opacity-50 font-mono">TRACK_ID_{i.toString().padStart(2, '0')}</div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="card h-[120px] neon-pink-glow p-5 flex flex-col justify-center">
            <div className="text-[9px] uppercase tracking-widest opacity-40 mb-3 font-mono">Visualizer Node</div>
            <div className="flex items-end gap-1 h-12">
              {[0.4, 0.8, 0.5, 0.9, 0.6, 0.85, 0.3].map((h, i) => (
                <motion.div
                  key={i}
                  className="flex-1 bg-neon-pink rounded-t-sm"
                  animate={{ height: [`${h * 20}%`, `${h * 100}%`, `${h * 40}%`] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.1 }}
                />
              ))}
            </div>
          </div>
        </aside>

        {/* Main Game Container */}
        <main className="card neon-lime-glow flex flex-col items-center justify-center bg-black/40 relative">
          <div className="absolute top-4 right-4 flex items-center gap-2 opacity-30 text-[10px] font-mono">
            <div className="w-2 h-2 rounded-full bg-neon-lime animate-pulse" />
            LIVE_SESSION_ACTIVE
          </div>
          <SnakeGame onScoreUpdate={setCurrentScore} />
        </main>

        {/* Sidebar Right */}
        <aside className="sidebar-right flex flex-col gap-4">
          <div className="card neon-lime-glow p-6 text-center">
            <div className="text-[9px] uppercase tracking-[0.3em] opacity-40 mb-2 font-mono">System Score</div>
            <div className="text-5xl font-mono font-bold text-neon-lime tracking-tighter drop-shadow-[0_0_8px_rgba(57,255,20,0.5)]">
              {currentScore.toString().padStart(6, '0')}
            </div>
          </div>
          
          <div className="card flex-1 p-6">
            <h3 className="text-[11px] font-mono uppercase tracking-[0.3em] opacity-40 mb-6">Archive_History</h3>
            <div className="space-y-4 font-mono text-[11px]">
              {[
                { name: 'CYB_R', score: '12,400' },
                { name: 'NEXUS', score: '10,200' },
                { name: 'VOID', score: '08,950' },
                { name: 'GHOST', score: '07,100' }
              ].map((entry, i) => (
                <div key={i} className="flex justify-between items-center opacity-70 group hover:opacity-100 transition-opacity">
                  <span className="group-hover:text-neon-cyan">0{i+1}. {entry.name}</span>
                  <span className="opacity-40">---</span>
                  <span>{entry.score}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>

        {/* Footer Player Controls */}
        <footer className="card md:col-start-2 p-6 flex flex-col justify-center bg-black/60">
          <MusicPlayer />
        </footer>
      </div>

      {/* Decorative corners */}
      <div className="fixed top-2 left-2 w-16 h-16 border-t border-l border-white/5 pointer-events-none" />
      <div className="fixed bottom-2 right-2 w-16 h-16 border-b border-r border-white/5 pointer-events-none" />
    </div>
  );
}

function StatusItem({ label, value, icon }: { label: string; value: string; icon: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2 text-[10px] font-mono opacity-80 uppercase">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-[10px] font-mono text-neon-cyan">{value}</span>
    </div>
  );
}

function Corner({ position }: { position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right' }) {
  const styles = {
    'top-left': 'top-4 left-4 border-t-2 border-l-2',
    'top-right': 'top-4 right-4 border-t-2 border-r-2',
    'bottom-left': 'bottom-4 left-4 border-b-2 border-l-2',
    'bottom-right': 'bottom-4 right-4 border-b-2 border-r-2',
  };
  
  return (
    <div className={`fixed w-8 h-8 opacity-20 border-white ${styles[position]} pointer-events-none`} />
  );
}

