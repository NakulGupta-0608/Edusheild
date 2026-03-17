"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck, Mail, Phone, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ForgotPassword() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [identifier, setIdentifier] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);

  const requestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if it is a gmail address
    const isEmail = identifier.includes("@");
    if (isEmail && !identifier.toLowerCase().endsWith("@gmail.com")) {
      return alert("Only @gmail.com email addresses are allowed.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "Password_Reset", 
          identifier 
        })
      });
      const data = await res.json();
      if (data.success) {
        setStep(2);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const verifyOTPAndGetToken = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          type: "Password_Reset", 
          identifier,
          code: otp 
        })
      });
      const data = await res.json();
      if (data.success && data.token) {
        setToken(data.token);
        setStep(3);
      } else {
        alert(data.error);
      }
    } catch {
      alert("Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return alert("Passwords do not match");
    }
    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword })
      });
      const data = await res.json();
      if (data.success) {
        alert("Password reset successfully! You can now log in.");
        window.location.href = "/"; // Redirect to login page
      } else {
        alert(data.error);
      }
    } catch {
      alert("Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-[80vh] flex-col justify-center py-12 sm:px-6 lg:px-8 bg-neutral-50/50">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="inline-flex items-center justify-center h-14 w-14 rounded-full bg-indigo-100 mb-4">
          <ShieldCheck className="h-7 w-7 text-indigo-600" />
        </div>
        <h2 className="text-2xl font-bold leading-9 tracking-tight text-neutral-900">
          Recover Your Account
        </h2>
        <p className="mt-2 text-sm text-neutral-600">
          Reset your password securely over encrypted channels.
        </p>
      </div>

      <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-[480px]">
        <div className="bg-white px-6 py-10 shadow-sm sm:rounded-xl sm:px-12 border border-neutral-100">
          
          {step === 1 && (
            <motion.form initial={{ opacity: 0 }} animate={{ opacity: 1 }} onSubmit={requestOTP} className="space-y-6">
              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  Registered Email or Mobile Number
                </label>
                <div className="mt-2 relative">
                  <input
                    type="text"
                    required
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    placeholder="example@mail.com or 9876543210"
                    className="block w-full rounded-md border-0 py-2.5 px-4 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 disabled:opacity-70"
              >
                {loading ? "Sending..." : "Send Verification Code"}
              </button>
            </motion.form>
          )}

          {step === 2 && (
            <motion.form initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} onSubmit={verifyOTPAndGetToken} className="space-y-6">
              <div className="text-center mb-6">
                <p className="text-sm font-medium text-neutral-600">
                  We sent a 6-digit code to
                  <br/> <strong className="text-neutral-900">{identifier}</strong>
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  Enter 6-digit Security Code
                </label>
                <div className="mt-2">
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 px-4 text-center tracking-[0.5em] text-2xl font-mono text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 disabled:opacity-70"
              >
                {loading ? "Verifying..." : "Verify Code"}
              </button>
              <button
                type="button"
                onClick={() => setStep(1)}
                className="flex w-full justify-center items-center gap-1.5 text-sm font-semibold text-neutral-500 hover:text-indigo-600"
              >
                <ArrowLeft className="h-4 w-4"/> Back
              </button>
            </motion.form>
          )}

          {step === 3 && (
            <motion.form initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} onSubmit={resetPassword} className="space-y-6">
               <div className="flex items-center gap-2 mb-6 bg-emerald-50 text-emerald-700 p-3 rounded-lg border border-emerald-100">
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                  <p className="text-sm font-medium">Identity verified successfully. You may now reset your password.</p>
               </div>
               <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  New Secure Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 px-4 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium leading-6 text-neutral-900">
                  Confirm New Password
                </label>
                <div className="mt-2">
                  <input
                    type="password"
                    required
                    minLength={6}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 px-4 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
                  />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="flex w-full justify-center items-center gap-2 rounded-md bg-neutral-900 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-neutral-800 disabled:opacity-70"
              >
                {loading ? "Resetting..." : <><KeyRound className="h-4 w-4"/> Confirm Password Change</>}
              </button>
            </motion.form>
          )}

        </div>
        
        <p className="mt-8 text-center text-sm text-neutral-500">
          <Link href="/" className="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">
            Return to main login portal
          </Link>
        </p>
      </div>
    </div>
  );
}
