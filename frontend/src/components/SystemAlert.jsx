import { AlertCircle, CheckCircle2, Info, Loader2 } from 'lucide-react';

const styles = {
  error: 'border-rose-400/30 bg-rose-500/10 text-rose-100',
  success: 'border-emerald-400/30 bg-emerald-500/10 text-emerald-100',
  info: 'border-sky-400/30 bg-sky-500/10 text-sky-100',
  loading: 'border-spark-500/30 bg-spark-500/10 text-spark-50',
};

const icons = { error: AlertCircle, success: CheckCircle2, info: Info, loading: Loader2 };

export default function SystemAlert({ type = 'info', title = 'System response', message }) {
  if (!message) return null;
  const Icon = icons[type] || Info;
  return (
    <div className={`rounded-2xl border p-4 text-sm ${styles[type] || styles.info}`} role="status" aria-live="polite">
      <div className="flex gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${type === 'loading' ? 'animate-spin' : ''}`} />
        <div>
          <p className="font-semibold">{title}</p>
          <p className="mt-1 leading-6 opacity-90">{message}</p>
        </div>
      </div>
    </div>
  );
}