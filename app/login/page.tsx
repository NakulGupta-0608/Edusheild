"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Shield, Building2, UserCog, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [instituteId, setInstituteId] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [loginType, setLoginType] = useState<"institute" | "admin">("institute");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        instituteId,
        password,
        redirect: false,
      });

      if (res?.error) {
        setError("Invalid credentials. Please check your ID and Password.");
      } else {
        if (instituteId === "admin") {
          router.push("/admin/dashboard");
        } else {
          router.push("/institute/dashboard");
        }
      }
    } catch (err) {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-neutral-50 selection:bg-blue-200">
      {/* Left side - Login Form */}
      <div className="flex w-full flex-col justify-center px-4 py-12 sm:px-6 lg:w-1/2 lg:px-20 xl:px-24">
        <Link href="/" className="group mb-8 inline-flex items-center text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors">
          <ArrowLeft className="mr-2 h-4 w-4 transition-transform group-hover:-translate-x-1" />
          Back to Home
        </Link>
        
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <div className="flex items-center gap-2">
              <Shield className="h-8 w-8 text-blue-600" />
              <span className="text-2xl font-bold tracking-tight">EduSheild</span>
            </div>
            <h2 className="mt-8 text-3xl font-bold tracking-tight text-neutral-900">
              Sign in to your account
            </h2>
            <p className="mt-2 text-sm text-neutral-600">
              Access your compliance dashboard and monitoring tools.
            </p>
          </div>

          <div className="mt-8">
            {/* Login Type Toggle */}
            <div className="flex rounded-lg bg-neutral-100 p-1 mb-6">
              <button
                type="button"
                onClick={() => setLoginType("institute")}
                className={`flex w-1/2 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                  loginType === "institute"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <Building2 className="h-4 w-4" />
                Institute
              </button>
              <button
                type="button"
                onClick={() => setLoginType("admin")}
                className={`flex w-1/2 items-center justify-center gap-2 rounded-md py-2 text-sm font-medium transition-all ${
                  loginType === "admin"
                    ? "bg-white text-neutral-900 shadow-sm"
                    : "text-neutral-500 hover:text-neutral-900"
                }`}
              >
                <UserCog className="h-4 w-4" />
                Authority
              </button>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="flex items-center gap-2 rounded-lg bg-red-50 p-4 text-sm text-red-600">
                  <AlertCircle className="h-5 w-5 shrink-0" />
                  <p>{error}</p>
                </div>
              )}

              <div>
                <label 
                  htmlFor="instituteId" 
                  className="block text-sm font-medium leading-6 text-neutral-900"
                >
                  {loginType === "institute" ? "Institute ID" : "Admin ID"}
                </label>
                <div className="mt-2">
                  <input
                    id="instituteId"
                    name="instituteId"
                    type="text"
                    required
                    value={instituteId}
                    onChange={(e) => setInstituteId(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                    placeholder={loginType === "institute" ? "e.g. INS-1204" : "admin"}
                  />
                </div>
              </div>

              <div>
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium leading-6 text-neutral-900"
                >
                  Password
                </label>
                <div className="mt-2">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="block w-full rounded-md border-0 py-2.5 px-3.5 text-neutral-900 shadow-sm ring-1 ring-inset ring-neutral-300 placeholder:text-neutral-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 transition-all"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 rounded border-neutral-300 text-blue-600 focus:ring-blue-600"
                  />
                  <label htmlFor="remember-me" className="ml-3 text-sm text-neutral-600">
                    Remember me
                  </label>
                </div>

                <div className="text-sm leading-6">
                  <a href="#" className="font-semibold text-blue-600 hover:text-blue-500">
                    Forgot password?
                  </a>
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="group relative flex w-full justify-center rounded-md bg-blue-600 px-3 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600 transition-all disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isLoading ? "Signing in..." : "Sign in"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Right side - Branding Image/Banner */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 bg-blue-600 h-full w-full object-cover p-12 overflow-hidden flex flex-col justify-end">
          {/* Abstract background elements */}
          <div className="absolute -top-24 -right-24 h-[500px] w-[500px] rounded-full bg-blue-500 blur-3xl opacity-50"></div>
          <div className="absolute bottom-24 -left-24 h-[400px] w-[400px] rounded-full bg-indigo-500 blur-3xl opacity-50"></div>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative z-10 p-8 rounded-3xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-2xl"
          >
            <h3 className="text-3xl font-bold text-white mb-4">Regulatory Compliance Made Simple.</h3>
            <p className="text-blue-100 text-lg">
              EduSheild automates the complex guidelines of the 2024 Ministry of Education directives. 
              Our AI verifies infrastructure photos, tracks capacity limits in real-time, and guarantees student safety.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
