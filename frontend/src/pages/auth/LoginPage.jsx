import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { getApiErrorMessage } from '../../api/client.js';
import AuthShell from '../../components/AuthShell.jsx';
import FieldError from '../../components/FieldError.jsx';
import PasswordInput from '../../components/PasswordInput.jsx';
import SystemAlert from '../../components/SystemAlert.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function LoginPage() {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
  const [response, setResponse] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const onSubmit = async (data) => { try { setResponse({ type: 'loading', message: 'Signing you in securely...' }); const res = await auth.login({ ...data, rememberMe: Boolean(data.rememberMe) }); setResponse({ type: 'success', message: res.message }); navigate('/dashboard'); } catch (error) { setResponse({ type: 'error', message: getApiErrorMessage(error) }); } };
  return <AuthShell title="Welcome back" subtitle="Log in to continue your learning journey."><form onSubmit={handleSubmit(onSubmit)} className="space-y-4"><SystemAlert type={response?.type} message={response?.message} /><div><input className="input" placeholder="Email" type="email" {...register('email', { required: 'Email is required' })} /><FieldError message={errors.email?.message} /></div><div><PasswordInput registration={register('password', { required: 'Password is required' })} /><FieldError message={errors.password?.message} /></div><label className="flex items-center gap-2 text-sm text-slate-300"><input type="checkbox" {...register('rememberMe')} /> Remember me</label><button className="btn-primary w-full" disabled={isSubmitting}>{isSubmitting ? 'Logging in...' : 'Log in'}</button><div className="flex flex-col gap-2 text-sm sm:flex-row sm:justify-between"><Link to="/register" className="text-spark-500">Create account</Link><Link to="/forgot-password" className="text-spark-500">Forgot password?</Link></div></form></AuthShell>;
}
