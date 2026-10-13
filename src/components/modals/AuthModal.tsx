import React, { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  KeyRound, 
  X, 
  ArrowLeft, 
  ShieldCheck,
  AlertCircle,
  Phone,
  Eye,
  EyeOff,
  Zap
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useUI } from '../../context/UIContext';
import { useToast } from '../../context/ToastContext';
import { api } from '../../api';

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const AuthModal: React.FC = () => {
  const { isAuthModalOpen, setIsAuthModalOpen } = useUI();
  const { loginWithEmail, registerWithEmail, loginAsDemo } = useAuth();
  const { success, error: toastError } = useToast();

  const [isLogin, setIsLogin] = useState(true);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [resetStep, setResetStep] = useState<1 | 2 | 3>(1);
  const [registrationStep, setRegistrationStep] = useState<1 | 2>(1);
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetToken, setResetToken] = useState('');

  // Resend OTP timer states
  const [resendCountdown, setResendCountdown] = useState(30);
  const [isResending, setIsResending] = useState(false);

  useEffect(() => {
    let timer: any;
    if (resendCountdown > 0 && ((!isLogin && registrationStep === 2) || (isForgotPassword && resetStep === 2))) {
      timer = setInterval(() => {
        setResendCountdown(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [resendCountdown, registrationStep, resetStep, isLogin, isForgotPassword]);

  useEffect(() => {
    if (isAuthModalOpen) {
      setIsLogin(true);
      setIsForgotPassword(false);
      setResetStep(1);
      setRegistrationStep(1);
      setName('');
      setEmail('');
      setPhone('');
      setPassword('');
      setOtp('');
      setNewPassword('');
      setConfirmPassword('');
      setResetToken('');
      setErrorMessage('');
      setResendCountdown(30);
    }
  }, [isAuthModalOpen]);

  if (!isAuthModalOpen) return null;

  const handleResendOtp = async () => {
    if (resendCountdown > 0 || isResending) return;
    if (!phone || !/^\d{10}$/.test(phone.trim())) {
      setErrorMessage('Please enter a valid 10-digit phone number first.');
      return;
    }
    setIsResending(true);
    setErrorMessage('');
    try {
      if (!isLogin && registrationStep === 2) {
        const data = await api.post<any>('/auth/send-registration-otp', { phone: phone.trim() });
        if (data.success) {
          setResendCountdown(30);
          success(data.message || 'OTP resent successfully to your phone.');
        } else {
          setErrorMessage(data.message || 'Failed to resend OTP.');
        }
      } else if (isForgotPassword && resetStep === 2) {
        const data = await api.post<any>('/auth/forgot-password', { phone: phone.trim() });
        if (data.success) {
          setResendCountdown(30);
          success(data.message || 'OTP resent successfully to your phone.');
        } else {
          setErrorMessage(data.message || 'Failed to resend OTP.');
        }
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to resend OTP.');
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isForgotPassword) {
      if (resetStep === 1) {
        if (!phone.trim()) {
          setErrorMessage('Please enter your phone number.');
          return;
        }
        if (!/^\d{10}$/.test(phone.trim())) {
          setErrorMessage('Please enter a valid 10-digit phone number.');
          return;
        }
        setIsLoading(true);
        setErrorMessage('');
        try {
          const data = await api.post<any>('/auth/forgot-password', { phone: phone.trim() });
          if (data.success) {
            setResetStep(2);
            setResendCountdown(30);
            success(data.message || 'OTP sent successfully to your phone.');
          } else {
            setErrorMessage(data.message || 'Failed to send OTP');
          }
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to connect to server.');
        }
        setIsLoading(false);
        return;
      }
      if (resetStep === 2) {
        if (!otp.trim()) {
          setErrorMessage('Please enter the OTP.');
          return;
        }
        if (!/^\d{4,6}$/.test(otp.trim())) {
          setErrorMessage('Please enter a valid 6-digit OTP.');
          return;
        }
        setIsLoading(true);
        setErrorMessage('');
        try {
          const data = await api.post<any>('/auth/verify-otp', { 
            phone: String(phone.trim()), 
            otp: String(otp.trim()) 
          });
          if (data.success) {
            setResetToken(data.resetToken);
            setResetStep(3);
            success(data.message || 'OTP verified successfully');
          } else {
            setErrorMessage(data.message || 'Invalid OTP');
          }
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to connect to server.');
        }
        setIsLoading(false);
        return;
      }
      if (resetStep === 3) {
        if (!newPassword || !confirmPassword) {
          setErrorMessage('Please enter and confirm your new password.');
          return;
        }
        if (newPassword.length < 6) {
          setErrorMessage('Password must be at least 6 characters long.');
          return;
        }
        if (newPassword !== confirmPassword) {
          setErrorMessage('Passwords do not match.');
          return;
        }
        setIsLoading(true);
        setErrorMessage('');
        try {
          const data = await api.post<any>('/auth/reset-password', { resetToken, newPassword, confirmPassword });
          if (data.success) {
            setIsForgotPassword(false);
            setResetStep(1);
            setIsLogin(true);
            setOtp('');
            setNewPassword('');
            setConfirmPassword('');
            setResetToken('');
            success(data.message || 'Password reset successfully. You can now login.');
          } else {
            setErrorMessage(data.message || 'Failed to reset password');
          }
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to connect to server.');
        }
        setIsLoading(false);
        return;
      }
    }
    
    if (isLogin && !isForgotPassword) {
      if (!email.trim() || !password) {
        setErrorMessage('Please enter both email and password.');
        return;
      }
      if (!EMAIL_REGEX.test(email.trim())) {
        setErrorMessage('Please enter a valid email address.');
        return;
      }
      setIsLoading(true);
      setErrorMessage('');
      const isSuccess = await loginWithEmail(email.trim(), password);
      if (isSuccess) {
        setIsAuthModalOpen(false);
      } else {
        setErrorMessage('Invalid credentials. Please try again.');
      }
      setIsLoading(false);
      return;
    }

    if (!isLogin && !isForgotPassword) {
      if (registrationStep === 1) {
        if (!name.trim() || !email.trim() || !password || !phone.trim()) {
          setErrorMessage('Please fill in all details.');
          return;
        }
        if (!/^[A-Za-z\s]{2,}$/.test(name.trim())) {
          setErrorMessage('Full name should contain letters only (minimum 2 characters).');
          return;
        }
        if (!/^\d{10}$/.test(phone.trim())) {
          setErrorMessage('Please enter a valid 10-digit phone number.');
          return;
        }
        if (!EMAIL_REGEX.test(email.trim())) {
          setErrorMessage('Please enter a valid email address.');
          return;
        }
        if (password.length < 6) {
          setErrorMessage('Password must be at least 6 characters.');
          return;
        }
        setIsLoading(true);
        setErrorMessage('');
        try {
          const data = await api.post<any>('/auth/send-registration-otp', { phone: phone.trim() });
          if (data.success) {
            setRegistrationStep(2);
            setResendCountdown(30);
            success(data.message || 'OTP sent successfully to your phone.');
          } else {
            setErrorMessage(data.message || 'Failed to send OTP.');
          }
        } catch (err: any) {
          setErrorMessage(err.message || 'Failed to connect to server.');
        }
        setIsLoading(false);
        return;
      }
      
      if (registrationStep === 2) {
        if (!otp.trim()) {
          setErrorMessage('Please enter the OTP.');
          return;
        }
        if (!/^\d{4,6}$/.test(otp.trim())) {
          setErrorMessage('Please enter a valid 6-digit OTP.');
          return;
        }
        setIsLoading(true);
        setErrorMessage('');
        const isSuccess = await registerWithEmail(name.trim(), email.trim(), password, phone.trim(), otp.trim());
        if (isSuccess) {
          setIsAuthModalOpen(false);
        } else {
          setErrorMessage('Registration failed. Please check your details and OTP.');
        }
        setIsLoading(false);
        return;
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn overflow-y-auto">
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-100 animate-scaleIn flex flex-col max-h-[92vh] my-auto"
        role="dialog"
        aria-modal="true"
      >
        {/* Modal Header */}
        <div className="p-5 bg-gradient-to-r from-wine-900 via-wine-800 to-slate-900 text-white relative flex-shrink-0">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-2.5">
              {(isForgotPassword || (!isLogin && registrationStep === 2)) && (
                <button
                  type="button"
                  onClick={() => { 
                    if (isForgotPassword) { 
                       if (resetStep > 1) { 
                        setResetStep((resetStep - 1) as 1 | 2 | 3); 
                        setErrorMessage(''); 
                      } else { 
                        setIsForgotPassword(false); 
                        setErrorMessage(''); 
                      } 
                    } else if (!isLogin && registrationStep === 2) {
                      setRegistrationStep(1); 
                      setErrorMessage(''); 
                    } 
                  }}
                  className="w-10 h-10 rounded-2xl text-rose-100 hover:text-white bg-white/10 hover:bg-white/20 border border-white/15 flex items-center justify-center transition-all cursor-pointer"
                  title="Go back"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}

              <div className="w-10 h-10 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center">
                {isForgotPassword ? (
                  <KeyRound className="w-5 h-5 text-white" />
                ) : (
                  <User className="w-5 h-5 text-white" />
                )}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setIsAuthModalOpen(false)}
              className="w-9 h-9 rounded-xl text-rose-200 hover:text-white hover:bg-white/10 flex items-center justify-center transition-colors cursor-pointer"
              title="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <h3 className="font-extrabold text-lg sm:text-xl leading-tight">
            {isForgotPassword ? 'Reset Password' : (isLogin ? 'Member Sign In' : 'Create an Account')}
          </h3>
          <p className="text-xs text-rose-200 mt-1">
            {isForgotPassword 
              ? (resetStep === 1 ? 'Enter your registered phone number to receive an OTP.' : (resetStep === 2 ? 'Enter the OTP sent to your phone.' : 'Enter your new password.'))
              : (isLogin 
                  ? 'Sign in to access cellar inventory, pricing, and express delivery.' 
                  : (registrationStep === 1 ? 'Sign up to order rare spirits, fine wines, and craft beers securely (21+).' : 'Enter the OTP sent to your phone.'))}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1">
          {errorMessage && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2 animate-fadeIn">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            
            {/* REGISTRATION STEP 1 */}
            {!isLogin && !isForgotPassword && registrationStep === 1 && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Full Name</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <User className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type="text" 
                      placeholder="Enter your full name" 
                      value={name} 
                      onChange={(e) => setName(e.target.value.replace(/[^A-Za-z\s]/g, ''))} 
                      autoFocus 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number (10 digits)</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <Phone className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type="tel" 
                      maxLength={10}
                      placeholder="Enter your 10-digit phone number" 
                      value={phone} 
                      onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Password (Min. 6 chars)</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Create a password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="px-3 text-slate-400 hover:text-slate-600 focus:outline-none" 
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* REGISTRATION STEP 2 (OTP) */}
            {!isLogin && !isForgotPassword && registrationStep === 2 && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">OTP Code</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type="text" 
                      maxLength={6}
                      placeholder="Enter 6-digit OTP" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                      autoFocus 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 tracking-widest outline-none" 
                    />
                  </div>
                </div>

                {/* Resend OTP Section */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-500">Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={resendCountdown > 0 || isResending}
                    onClick={handleResendOtp}
                    className={`font-bold transition-colors ${
                      resendCountdown > 0 || isResending
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-amber-700 hover:text-amber-800 hover:underline cursor-pointer'
                    }`}
                  >
                    {isResending ? 'Resending...' : resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* LOGIN FLOW */}
            {isLogin && !isForgotPassword && (
              <div className="space-y-3.5 animate-fadeIn">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Email Address</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <Mail className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type="email" 
                      placeholder="Enter your email" 
                      value={email} 
                      onChange={(e) => setEmail(e.target.value)} 
                      autoFocus 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Password</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type={showPassword ? 'text' : 'password'} 
                      placeholder="Enter your password" 
                      value={password} 
                      onChange={(e) => setPassword(e.target.value)} 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowPassword(!showPassword)} 
                      className="px-3 text-slate-400 hover:text-slate-600 focus:outline-none" 
                      tabIndex={-1}
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD STEP 1 */}
            {isForgotPassword && resetStep === 1 && (
              <div className="animate-fadeIn">
                <label className="text-xs font-bold text-slate-700 block mb-1.5">Phone Number (10 digits)</label>
                <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                  <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                    <Phone className="w-4 h-4 text-slate-500" />
                  </span>
                  <input 
                    type="tel" 
                    maxLength={10}
                    placeholder="Enter your registered 10-digit phone number" 
                    value={phone} 
                    onChange={(e) => setPhone(e.target.value.replace(/\D/g, '').slice(0, 10))} 
                    autoFocus 
                    className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                  />
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD STEP 2 */}
            {isForgotPassword && resetStep === 2 && (
              <div className="space-y-3 animate-fadeIn">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">OTP Code</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type="text" 
                      maxLength={6}
                      placeholder="Enter 6-digit OTP" 
                      value={otp} 
                      onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))} 
                      autoFocus 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 tracking-widest outline-none" 
                    />
                  </div>
                </div>

                {/* Resend OTP Section */}
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="text-slate-500">Didn't receive code?</span>
                  <button
                    type="button"
                    disabled={resendCountdown > 0 || isResending}
                    onClick={handleResendOtp}
                    className={`font-bold transition-colors ${
                      resendCountdown > 0 || isResending
                        ? 'text-slate-400 cursor-not-allowed'
                        : 'text-amber-700 hover:text-amber-800 hover:underline cursor-pointer'
                    }`}
                  >
                    {isResending ? 'Resending...' : resendCountdown > 0 ? `Resend OTP in ${resendCountdown}s` : 'Resend OTP'}
                  </button>
                </div>
              </div>
            )}

            {/* FORGOT PASSWORD STEP 3 */}
            {isForgotPassword && resetStep === 3 && (
              <div className="space-y-3.5 animate-fadeIn">
                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">New Password (Min. 6 chars)</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type={showNewPassword ? 'text' : 'password'} 
                      placeholder="Enter new password" 
                      value={newPassword} 
                      onChange={(e) => setNewPassword(e.target.value)} 
                      autoFocus 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowNewPassword(!showNewPassword)} 
                      className="px-3 text-slate-400 hover:text-slate-600 focus:outline-none" 
                      tabIndex={-1}
                    >
                      {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-700 block mb-1.5">Confirm New Password</label>
                  <div className="flex items-center rounded-2xl border border-slate-200 focus-within:border-amber-500 focus-within:ring-4 focus-within:ring-amber-500/10 overflow-hidden bg-slate-50 transition-all">
                    <span className="px-3.5 py-2.5 bg-slate-100 border-r border-slate-200 text-sm font-bold text-slate-700 flex items-center">
                      <KeyRound className="w-4 h-4 text-slate-500" />
                    </span>
                    <input 
                      type={showConfirmPassword ? 'text' : 'password'} 
                      placeholder="Confirm new password" 
                      value={confirmPassword} 
                      onChange={(e) => setConfirmPassword(e.target.value)} 
                      className="w-full bg-transparent px-3.5 py-2.5 text-sm font-semibold text-slate-800 outline-none" 
                    />
                    <button 
                      type="button" 
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)} 
                      className="px-3 text-slate-400 hover:text-slate-600 focus:outline-none" 
                      tabIndex={-1}
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {isLogin && !isForgotPassword && (
              <div className="flex justify-end mt-1 mb-1">
                <button
                  type="button"
                  onClick={() => { setIsForgotPassword(true); setErrorMessage(''); }}
                  className="text-xs font-bold text-wine-800 hover:text-wine-900 hover:underline transition-colors"
                >
                  Forgot Password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3.5 bg-wine-600 hover:bg-wine-700 text-white rounded-2xl text-sm font-black transition-all shadow-md shadow-wine-700/20 active:scale-[0.99] cursor-pointer ${
                isLoading ? 'opacity-70 cursor-not-allowed' : ''
              }`}
            >
              {isLoading 
                ? (isForgotPassword ? (resetStep === 1 ? 'Sending OTP...' : resetStep === 2 ? 'Verifying...' : 'Resetting...') : (isLogin ? 'Signing In...' : (registrationStep === 1 ? 'Sending OTP...' : 'Registering...'))) 
                : (isForgotPassword ? (resetStep === 1 ? 'Send OTP' : resetStep === 2 ? 'Verify OTP' : 'Reset Password') : (isLogin ? 'Sign In & Access Cellar' : (registrationStep === 1 ? 'Send OTP' : 'Create Account')))}
            </button>

            {/* Quick Demo Sign-In for Immediate Access & Testing */}
            {!isForgotPassword && (
              <div className="pt-2">
                <div className="relative flex py-2 items-center">
                  <div className="flex-grow border-t border-slate-200"></div>
                  <span className="flex-shrink mx-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest">or 1-click member access</span>
                  <div className="flex-grow border-t border-slate-200"></div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    loginAsDemo('Manish Sharma');
                    setIsAuthModalOpen(false);
                  }}
                  className="w-full py-3 px-4 rounded-2xl bg-slate-900 hover:bg-slate-800 text-amber-300 hover:text-amber-200 text-xs font-black border border-amber-500/30 shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-95"
                >
                  <Zap className="w-4 h-4 text-amber-400 fill-amber-400" />
                  <span>⚡ Quick Member Sign-In (Manish Sharma)</span>
                </button>
              </div>
            )}
            
            {!isForgotPassword && (
              <div className="text-center pt-2">
                <button 
                  type="button" 
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setErrorMessage('');
                  }}
                  className="text-xs font-bold text-wine-800 hover:text-wine-900 hover:underline cursor-pointer"
                >
                  {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Log In"}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
};
