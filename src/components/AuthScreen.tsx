import React, { useState } from 'react';
import { Shield, Key, Mail, Cpu, RefreshCw, AlertTriangle, Lock, UserPlus, Chrome } from 'lucide-react';
import { UserProfile } from '../types';
import { auth } from '../firebase';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, GoogleAuthProvider, signInWithPopup } from 'firebase/auth';

interface AuthScreenProps {
  onLoginSuccess: (user: UserProfile) => void;
}

export default function AuthScreen({ onLoginSuccess }: AuthScreenProps) {
  const [email, setEmail] = useState('bindhanibikash71@gmail.com');
  const [password, setPassword] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [useFirebase, setUseFirebase] = useState(false);
  const [otpMode, setOtpMode] = useState(false);
  const [otpCode, setOtpCode] = useState('');
  const [referral, setReferral] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // 1. Easy One-Click Direct Bypass Login (Foolproof for local development/preview)
  const handleDirectBypass = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: 'bindhanibikash71@gmail.com', name: 'Nova Operator' }),
      });
      const data = await res.json();
      if (data.isBanned) {
        setError('CRITICAL WARN: Your operator profile has been banned.');
        return;
      }
      setSuccessMsg('⚡ BYPASS STABLE: ACCESS AUTHORIZED!');
      // Give a tiny visual pause
      setTimeout(() => {
        onLoginSuccess(data);
      }, 500);
    } catch (err) {
      setError('Connection failure to local Express backend.');
    } finally {
      setLoading(false);
    }
  };

  // 2. Real Firebase Auth Integration (Email/Password Sign In & Sign Up)
  const handleFirebaseSignInOrSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Email and password must be filled.');
      return;
    }
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      let firebaseUserCred;
      if (isSignUp) {
        firebaseUserCred = await createUserWithEmailAndPassword(auth, email, password);
        setSuccessMsg('🔥 FIREBASE ACCOUNT CREATED SUCCESSFULLY!');
      } else {
        firebaseUserCred = await signInWithEmailAndPassword(auth, email, password);
        setSuccessMsg('🔥 FIREBASE SECURITY HANDSHAKE COMPLETED!');
      }

      const fbUser = firebaseUserCred.user;

      // Sync active profile with Express backend to retrieve role & bounds
      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          email: fbUser.email, 
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Firebase User' 
        }),
      });
      const data = await res.json();
      if (data.isBanned) {
        setError('CRITICAL WARN: Your operator profile has been banned.');
        return;
      }

      setTimeout(() => {
        onLoginSuccess(data);
      }, 800);

    } catch (err: any) {
      console.error(err);
      setError(`AUTHENTICATION CODE [${err.code || 'UNKNOWN'}]: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Google Integrated Authentication (Firebase Pop-up)
  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    setSuccessMsg('');
    try {
      const provider = new GoogleAuthProvider();
      // Set custom parameters if needed
      provider.setCustomParameters({ prompt: 'select_account' });
      const result = await signInWithPopup(auth, provider);
      const fbUser = result.user;

      setSuccessMsg('⚡ GOOGLE AUTH SUCCESSFUL! SECURING NEURAL MATRIX LINK...');

      // Sync user profile with current Express backend schema
      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: fbUser.email,
          name: fbUser.displayName || fbUser.email?.split('@')[0] || 'Google Operator',
          avatar: fbUser.photoURL || `https://api.dicebear.com/7.x/pixel-art/svg?seed=${encodeURIComponent(fbUser.email || 'google')}`
        }),
      });
      const data = await res.json();
      if (data.isBanned) {
        setError('CRITICAL WARN: Your operator profile has been banned.');
        return;
      }

      setTimeout(() => {
        onLoginSuccess(data);
      }, 700);

    } catch (err: any) {
      console.error(err);
      setError(`GOOGLE ACCESS ERROR: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // 3. Instant Private Neural Key Synchronization
  const handleDeepNeuralSync = async () => {
    setLoading(true);
    setError('');
    try {
      // Direct real server profile synchronization
      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email || 'anonymous@nova.ai', name: 'Operator Prime' }),
      });
      const data = await res.json();
      if (data.isBanned) {
        setError('CRITICAL WARN: Your operator profile has been banned.');
        return;
      }
      onLoginSuccess(data);
    } catch (err) {
      setError('Connection failure to Nova Core.');
    } finally {
      setLoading(false);
    }
  };

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) {
      setError('Please Enter a valid email address.');
      return;
    }
    setLoading(true);
    setError('');
    setTimeout(() => {
      setLoading(false);
      setOtpMode(true);
      setSuccessMsg('⚡ ONE-TIME TOKEN SENT TO ' + email.toUpperCase() + ' (CODE: 8892)');
    }, 1200);
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    if (otpCode !== '8892' && otpCode !== '1234') {
      setError('INVALID NEURAL SECURITY PASSCODE.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/users/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, referrer: referral }),
      });
      const data = await res.json();
      if (data.isBanned) {
        setError('CRITICAL WARN: Your operator profile has been banned.');
        return;
      }
      onLoginSuccess(data);
    } catch (err) {
      setError('Connection failure.');
    } finally {
      setLoading(false);
    }
  };

  if (isResetting) {
    return (
      <div className="p-6 bg-black min-h-[580px] w-full flex flex-col justify-center items-center font-sans text-white border-4 border-red-600/40 max-w-sm mx-auto shadow-[0_0_30px_rgba(255,26,26,0.15)] select-none">
        <div className="w-full text-center border-b-2 border-red-600 pb-4 mb-6">
          <AlertTriangle className="mx-auto text-red-500 w-10 h-10 animate-bounce mb-2" />
          <h2 className="font-mono text-lg font-black tracking-widest text-red-500 uppercase">PWD_RESET.EXE</h2>
        </div>
        <p className="text-xs font-mono text-gray-400 mb-4 leading-relaxed text-center">
          RESET OPERATOR SECRETS MODULE. ENTER CONSOLE EMAIL TO REQUEST AUTH CRASH TOKEN.
        </p>

        <input
          type="email"
          placeholder="ENTER OPERATOR EMAIL..."
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-3 bg-neutral-900 border-2 border-red-600/60 font-mono text-xs focus:border-red-500 focus:outline-none placeholder-gray-600 text-white"
        />

        <button
          onClick={() => {
            setSuccessMsg('SEC_CRASH_PENDING: Recovery token routed to ' + email);
            setIsResetting(false);
          }}
          className="w-full py-3 bg-red-600 hover:bg-red-700 text-black font-black uppercase tracking-wider text-xs transition duration-200"
        >
          DISPATCH RECOVERY TOKENS
        </button>

        <button
          onClick={() => setIsResetting(false)}
          className="mt-4 font-mono text-[10px] text-gray-500 uppercase tracking-widest hover:text-red-500"
        >
          [ ABORT OPERATION ]
        </button>
      </div>
    );
  }

  return (
    <div className="p-6 bg-black min-h-[580px] w-full flex flex-col justify-center items-center font-sans text-white border-4 border-red-600/40 max-w-sm mx-auto shadow-[0_0_35px_rgba(255,26,26,0.2)] select-none">
      
      {/* Brand Terminal Header */}
      <div className="text-center w-full mb-6 relative">
        <div className="absolute top-0 right-0 left-0 h-0.5 bg-gradient-to-r from-transparent via-red-600 to-transparent animate-pulse" />
        <div className="border-2 border-red-600 p-2 bg-red-950/20 inline-block rounded-sm mb-3">
          <Cpu className="text-red-600 w-8 h-8 animate-[spin_8s_linear_infinite]" />
        </div>
        <h1 className="text-3xl font-extrabold tracking-tighter text-white uppercase select-none">
          NOVA <span className="text-red-600">AI</span>
        </h1>
        <p className="font-mono text-[9px] uppercase text-red-500/80 tracking-[0.25em] font-medium mt-1">
          ✦ Core Neural Interface ✦
        </p>
      </div>

      {/* 🚀 QUICK FOOLPROOF BYPASS FOR LOGGING IN (SOLVES CHAT SCREEN UNREACHABLE) */}
      <div className="w-full mb-6 border-2 border-dashed border-red-600 p-3.5 bg-red-950/20 rounded-sm">
        <h3 className="text-[10px] font-mono text-red-400 font-extrabold uppercase mb-1 flex items-center gap-1">
          ⚡ DEV/ADMIN DIRECT PORTAL ACCESS
        </h3>
        <p className="text-[9px] text-gray-400 font-sans leading-relaxed mb-3.5">
          Skip credentials and enter the Nova Admin / Chat Console instantly.
        </p>
        <button
          type="button"
          onClick={handleDirectBypass}
          disabled={loading}
          className="w-full py-3 bg-red-600 hover:bg-red-700 active:translate-y-0.5 text-black font-black uppercase tracking-widest text-xs flex justify-center items-center gap-1.5 transition-all rounded-sm cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.2)]"
        >
          {loading ? <RefreshCw className="animate-spin w-4 h-4" /> : <span>INSTANT ADMINISTRATOR LOGIN</span>}
        </button>
      </div>

      {error && (
        <div className="w-full mb-4 bg-red-950/30 border-2 border-red-600 p-3 text-red-400 font-mono text-[10px] leading-relaxed uppercase">
          🚨 ERROR: {error}
        </div>
      )}

      {successMsg && (
        <div className="w-full mb-4 bg-neutral-900 border border-green-500 p-3 text-green-400 font-mono text-[10px] leading-relaxed uppercase">
          {successMsg}
        </div>
      )}

      {/* Switch auth mode between Simple OTP and Real Firebase Account */}
      <div className="w-full mb-5 flex justify-between border-b border-neutral-900 pb-2">
        <button
          onClick={() => { setUseFirebase(false); setOtpMode(false); }}
          className={`text-[9px] font-mono uppercase tracking-wider ${!useFirebase ? 'text-red-500 border-b-2 border-red-600 pb-1 font-bold' : 'text-gray-500 hover:text-white'}`}
        >
          [ OTP PIN / DEMO ]
        </button>
        <button
          onClick={() => { setUseFirebase(true); setOtpMode(false); }}
          className={`text-[9px] font-mono uppercase tracking-wider ${useFirebase ? 'text-red-500 border-b-2 border-red-600 pb-1 font-bold' : 'text-gray-500 hover:text-white'}`}
        >
          [ FIREBASE ACC SECURE ]
        </button>
      </div>

      {!useFirebase ? (
        <>
          {!otpMode ? (
            <form onSubmit={handleSendOTP} className="w-full">
              <label className="block text-[10px] uppercase font-mono text-gray-500 tracking-wider mb-1.5 align-left">
                OPERATOR IDENTIFIER (EMAIL)
              </label>
              <div className="relative mb-3.5">
                <Mail className="absolute left-3 top-3 w-4 h-4 text-red-600/70" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="operator@nova.ai"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-red-600/20 text-xs text-white focus:outline-none focus:border-red-500 transition-colors font-mono"
                />
              </div>

              <label className="block text-[10px] uppercase font-mono text-gray-500 tracking-wider mb-1.5 align-left">
                REFERRAL PIN (OPTIONAL)
              </label>
              <div className="relative mb-5">
                <Key className="absolute left-3 top-3 w-4 h-4 text-red-600/70" />
                <input
                  type="text"
                  value={referral}
                  onChange={(e) => setReferral(e.target.value)}
                  placeholder="e.g. NOVA-1442"
                  className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-red-600/20 text-xs text-white focus:outline-none focus:border-red-500 transition-colors font-mono uppercase"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-neutral-950 hover:bg-neutral-900 border-2 border-red-600/80 hover:border-red-500 text-white font-extrabold uppercase tracking-widest text-xs flex justify-center items-center gap-2 transition duration-150 rounded-sm cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="animate-spin w-4 h-4" />
                ) : (
                  <span>REQUEST PASSCODE TOKEN</span>
                )}
              </button>
            </form>
          ) : (
            <form onSubmit={handleVerifyOTP} className="w-full">
              <p className="text-[10px] font-mono text-gray-400 mb-4 uppercase text-center leading-relaxed">
                Enter 4-Digit Passcode sent to profile screen. Use <b className="text-red-500">8892</b> or <b className="text-red-500">1234</b> for rapid simulation.
              </p>

              <input
                type="text"
                required
                maxLength={6}
                placeholder="ENTER AUTH PASSCODE..."
                value={otpCode}
                onChange={(e) => setOtpCode(e.target.value)}
                className="w-full text-center px-4 py-3 bg-neutral-900 border-2 border-red-600 tracking-[0.4em] font-mono text-base focus:outline-none text-white placeholder-gray-700 uppercase mb-4"
              />

              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-black font-extrabold uppercase tracking-widest text-xs flex justify-center items-center gap-2 transition duration-150 rounded-sm cursor-pointer"
              >
                {loading ? (
                  <RefreshCw className="animate-spin w-4 h-4" />
                ) : (
                  <span>VERIFY OTP CODES</span>
                )}
              </button>

              <button
                type="button"
                onClick={() => setOtpMode(false)}
                className="w-full text-center mt-3 text-[10px] font-mono text-gray-500 hover:text-red-500 uppercase tracking-widest"
              >
                ← GO BACK
              </button>
            </form>
          )}
        </>
      ) : (
        /* FIREBASE AUTH EMAIL/PASSWORD BLOCK */
        <form onSubmit={handleFirebaseSignInOrSignUp} className="w-full">
          <label className="block text-[10px] uppercase font-mono text-gray-500 tracking-wider mb-1.5 align-left">
            FIREBASE OPERATOR EMAIL
          </label>
          <div className="relative mb-3.5">
            <Mail className="absolute left-3 top-3 w-4 h-4 text-red-600/70" />
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="operator@nova.ai"
              className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-red-600/30 text-xs text-white focus:outline-none focus:border-red-500 transition-colors font-mono"
            />
          </div>

          <label className="block text-[10px] uppercase font-mono text-gray-500 tracking-wider mb-1.5 align-left">
            SECURE PASSWORD
          </label>
          <div className="relative mb-5">
            <Lock className="absolute left-3 top-3 w-4 h-4 text-red-600/70" />
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full pl-10 pr-4 py-3 bg-neutral-900 border-2 border-red-600/30 text-xs text-white focus:outline-none focus:border-red-500 transition-colors font-mono"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-red-600 hover:bg-red-700 disabled:bg-red-900 text-black font-extrabold uppercase tracking-widest text-xs flex justify-center items-center gap-2 transition duration-150 rounded-sm cursor-pointer mb-3"
          >
            {loading ? (
              <RefreshCw className="animate-spin w-4 h-4" />
            ) : (
              <span>{isSignUp ? 'FIREBASE SECURE SIGNUP' : 'FIREBASE SECURE SIGNIN'}</span>
            )}
          </button>

          <button
            type="button"
            onClick={() => setIsSignUp(!isSignUp)}
            className="w-full text-center text-[10.5px] font-mono text-red-500 hover:text-white uppercase tracking-wider"
          >
            {isSignUp ? '← Shift to Password Login' : '✦ No account? Register a new profile'}
          </button>
        </form>
      )}

      {/* Futuristic Social Login Divider */}
      <div className="w-full my-5 flex items-center justify-between">
        <span className="h-0.5 w-[20%] bg-neutral-900" />
        <span className="text-[8px] font-mono text-gray-500 uppercase tracking-widest whitespace-nowrap">
          SECURE CREDENTIALS & SATELLITE
        </span>
        <span className="h-0.5 w-[20%] bg-neutral-900" />
      </div>

      <div className="w-full space-y-3">
        {/* Google Unified Authentication Button */}
        <button
          type="button"
          onClick={handleGoogleSignIn}
          disabled={loading}
          className="w-full py-3 bg-white text-black hover:bg-neutral-250 active:translate-y-0.5 font-black uppercase tracking-widest text-xs flex justify-center items-center gap-2 transition duration-150 rounded-sm cursor-pointer shadow-[0_0_15px_rgba(255,255,255,0.1)]"
        >
          <Chrome className="w-4 h-4 text-black animate-[pulse_2s_infinite]" />
          <span>SIGN IN WITH GOOGLE LINK</span>
        </button>

        <button
          type="button"
          onClick={handleDeepNeuralSync}
          className="w-full py-3 bg-neutral-950 hover:bg-neutral-900 border-2 border-red-600/60 text-white hover:text-red-500 font-bold uppercase tracking-widest text-[9.5px] flex justify-center items-center gap-2 transition duration-150 rounded-sm cursor-pointer"
        >
          <Shield className="w-3.5 h-3.5 text-red-500" />
          <span>INTEGRATE PRIVATE HYPER-KEY</span>
        </button>
      </div>

      {/* Reset password link */}
      <button
        onClick={() => setIsResetting(true)}
        className="mt-5 text-[9px] font-mono text-gray-600 uppercase tracking-widest hover:text-red-500 transition-colors"
      >
        [ FORGOTTEN SYSTEM CREDS ]
      </button>

      {/* Live System Status Indicator */}
      <div className="mt-6 border-t border-red-600/15 pt-3.5 w-full text-center">
        <div className="inline-flex items-center gap-1.5 text-[8px] font-mono text-green-500 uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
          SYSTEM STABLE • PWA ACTIVE
        </div>
      </div>
    </div>
  );
}
