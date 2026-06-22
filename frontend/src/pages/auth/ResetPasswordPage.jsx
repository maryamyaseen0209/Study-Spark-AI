import { useForm } from 'react-hook-form';
import { Link, useSearchParams } from 'react-router-dom';
import AuthShell from '../../components/AuthShell.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function ResetPasswordPage() {
  const [params] = useSearchParams();
  const { register, handleSubmit, formState: { isSubmitting } } = useForm();
  const auth = useAuth();
  return <AuthShell title="Choose a new password" subtitle="Your reset link is valid for one hour."><form onSubmit={handleSubmit(({ password }) => auth.resetPassword(params.get('token'), password))} className="space-y-4"><input className="input" placeholder="New password" type="password" {...register('password', { required: true, minLength: 8 })} /><button className="btn-primary w-full" disabled={isSubmitting}>Update password</button><Link to="/login" className="text-sm text-spark-500">Back to login</Link></form></AuthShell>;
}
