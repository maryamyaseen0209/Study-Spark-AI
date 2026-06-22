import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import AuthShell from '../../components/AuthShell.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ForgotPasswordPage() {
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const [resetLink, setResetLink] = useState('');
  const auth = useAuth();
  return <AuthShell title="Reset password" subtitle="Generate a reset link without SMTP email."><form onSubmit={handleSubmit(async ({ email }) => { const res = await auth.forgotPassword(email); setResetLink(res.resetLink || ''); })} className="space-y-4"><input className="input" placeholder="Email" type="email" {...register('email', { required: true })} /><button className="btn-primary w-full" disabled={isSubmitting}>Generate reset link</button>{resetLink && <Link to={new URL(resetLink).pathname + new URL(resetLink).search} className="block rounded-xl border border-spark-500/30 bg-spark-500/10 p-3 text-sm text-spark-200">Open generated reset link</Link>}<Link to="/login" className="text-sm text-spark-500">Back to login</Link></form></AuthShell>;
}
