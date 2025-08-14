import React, { useState, useEffect } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import { Eye, EyeOff, Loader2, Lock, Mail, MessageSquare, User, CheckCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import AuthImagePattern from "../components/AuthImagePattern";
import toast from "react-hot-toast";

const passwordCriteria = [
  { label: 'At least 8 characters', test: (pw) => pw.length >= 8 },
  { label: 'Contains a number', test: (pw) => /\d/.test(pw) },
  { label: 'Contains an uppercase letter', test: (pw) => /[A-Z]/.test(pw) },
  { label: 'Contains a lowercase letter', test: (pw) => /[a-z]/.test(pw) },
  { label: 'Contains a special character', test: (pw) => /[^A-Za-z0-9]/.test(pw) },
];

const SignUpPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
  });

  const { signup, isSigningUp } = useAuthStore();

  const validated = passwordCriteria.map(c => c.test(formData.password));
  const validCount = validated.filter(Boolean).length;

  const validateForm = () => {
    if (!formData.fullName.trim()) return toast.error("Full name is required");
    if (!formData.email.trim()) return toast.error("Email is required");
    if (!/\S+@\S+\.\S+/.test(formData.email)) return toast.error("Invalid email format");
    if (!formData.password) return toast.error("Password is required");
    if (validCount < passwordCriteria.length) return toast.error("Password is weak");
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const success = validateForm();
    if (success === true) signup(formData);
  };

  return (
    <div className="min-h-screen grid grid-cols-1 lg:grid-cols-2 bg-black text-white">

      {/* Middle Column - Form */}
      <div className="flex flex-col justify-center items-center p-3 sm:p-10">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <div className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
            </div>
            <p className="text-2xl font-bold">Create Account</p>
            <p className="text-white/60">Get started with your free account</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div>
              <label className="label"><span className="label-text font-medium">Full Name</span></label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content/40" />
                <input
                  type="text"
                  className="input input-bordered w-full pl-10 bg-gray-900"
                  placeholder="John Doe"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="label"><span className="label-text font-medium">Email</span></label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content/40" />
                <input
                  type="email"
                  className="input input-bordered w-full pl-10"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="label"><span className="label-text font-medium">Password</span></label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 size-5 text-base-content/40" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  className="input input-bordered w-full pl-10 pr-10"
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff className="size-5 text-base-content/40" /> : <Eye className="size-5 text-base-content/40" />}
                </button>
              </div>

              {/* Password strength bar */}
              <div className="mt-2 space-y-1">
                <div className="w-full h-2 bg-gray-800 rounded">
                  <div
                    className="h-full rounded transition-all"
                    style={{
                      width: `${(validCount / passwordCriteria.length) * 100}%`,
                      backgroundColor: validCount === passwordCriteria.length ? 'green' : 'orange'
                    }}
                  />
                </div>
                <ul className="text-sm space-y-1">
                  {passwordCriteria.map((c, idx) => (
                    <li key={idx} className={`flex items-center gap-2 ${validated[idx] ? 'text-green-400' : 'text-white/40'}`}>
                      <CheckCircle className="size-4" /> {c.label}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button type="submit" className="btn btn-primary w-full" disabled={isSigningUp}>
              {isSigningUp ? <><Loader2 className="size-5 animate-spin" /> Loading...</> : 'Create Account'}
            </button>
          </form>

          <div className="text-center">
            <p className="text-white/60">
              Already have an account? <Link to="/login" className="link link-primary">Sign in</Link>
            </p>
          </div>
        </div>
      </div>

      {/* Right Column - Community Text */}
      <AuthImagePattern
        title="Join our community"
        subtitle="Connect with friends, share moments, and stay in touch with your loved ones."
      />
    </div>
  );
};

export default SignUpPage;
