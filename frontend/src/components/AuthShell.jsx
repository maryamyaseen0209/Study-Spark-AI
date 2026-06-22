import { motion } from 'framer-motion';
import { BrainCircuit, MessagesSquare, ShieldCheck, Sparkles } from 'lucide-react';

export default function AuthShell({ title, subtitle, children }) {
  return (
    <main className="min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,#1e88ff38,transparent_34%),radial-gradient(circle_at_bottom_right,#7c3aed24,transparent_32%),#020617] px-4 py-6 sm:px-6 lg:px-8">
      <motion.section initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} className="mx-auto grid min-h-[calc(100vh-3rem)] max-w-7xl items-center gap-8 lg:grid-cols-[minmax(0,1fr)_500px]">
        <div className="flex flex-col justify-center py-8">
          <div className="mb-8 flex items-center gap-3 text-spark-500"><Sparkles /><span className="text-xl font-bold tracking-tight">Study SparkAI</span></div>
          <h1 className="max-w-3xl text-4xl font-black leading-tight text-white sm:text-5xl lg:text-6xl">AI-powered learning, classroom management, and collaboration.</h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-300 sm:text-lg">Secure role-based access, responsive dashboards, visible system feedback, and connected workflows for classrooms, quizzes, assignments, messaging, and resources.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            {[['AI tools', BrainCircuit], ['Live messages', MessagesSquare], ['Secure auth', ShieldCheck]].map(([label, Icon]) => (
              <div key={label} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm font-semibold text-slate-200 backdrop-blur">
                <Icon className="mb-3 h-5 w-5 text-spark-500" />{label}
              </div>
            ))}
          </div>
        </div>
        <div className="card w-full">
          <h2 className="text-2xl font-bold text-white">{title}</h2>
          <p className="mt-2 text-sm text-slate-400">{subtitle}</p>
          <div className="mt-6">{children}</div>
        </div>
      </motion.section>
    </main>
  );
}
