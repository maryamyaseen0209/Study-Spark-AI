import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getApiErrorMessage } from '../../api/client.js';
import AuthShell from '../../components/AuthShell.jsx';
import FieldError from '../../components/FieldError.jsx';
import PasswordInput from '../../components/PasswordInput.jsx';
import SystemAlert from '../../components/SystemAlert.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function RegisterPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({ defaultValues: { role: 'student' } });
  const [response, setResponse] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (data) => { try { setResponse({ type: 'loading', message: 'Creating your secure account...' }); const res = await auth.register({ ...data, termsAccepted: data.termsAccepted ? 'true' : 'false' }); setResponse({ type: 'success', message: res.message }); reset(); navigate('/dashboard', { replace: true }); } catch (error) { setResponse({ type: 'error', message: getApiErrorMessage(error) }); } };
  return <AuthShell title="Create your account" subtitle="Choose your role to unlock a personalized dashboard."><form onSubmit={handleSubmit(onSubmit)} className="space-y-4"><SystemAlert type={response?.type} message={response?.message} /><div><input className="input" placeholder="Full name" {...register('fullName', { required: 'Full name is required' })} /><FieldError message={errors.fullName?.message} /></div><div><input className="input" placeholder="Email" type="email" {...register('email', { required: 'Email is required' })} /><FieldError message={errors.email?.message} /></div><div><PasswordInput registration={register('password', { required: 'Password is required', minLength: { value: 8, message: 'Use at least 8 characters' } })} /><FieldError message={errors.password?.message} /></div><input className="input" placeholder="Institution name (optional)" {...register('institution')} /><select className="input" {...register('role')}><option value="student">Student</option><option value="teacher">Teacher</option></select><p className="rounded-2xl border border-spark-500/20 bg-spark-500/10 px-4 py-3 text-xs text-spark-100">Admin accounts are not publicly registered. Create or promote admins directly in MongoDB.</p><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" {...register('termsAccepted', { required: 'You must accept the terms' })} /> I accept the terms</label><FieldError message={errors.termsAccepted?.message} /><button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Creating account...' : 'Register'}</button><p className="text-sm text-slate-400">Already registered? <Link to="/login" className="text-spark-500">Log in</Link></p></form></AuthShell>;
}
