"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signUp, confirmSignUp } from "aws-amplify/auth";

export default function SignupPage() {
  const router = useRouter();
  const [step, setStep] = useState<"signup" | "confirm">("signup");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!name || !email || !password || !confirm) {
      setError("Please fill in all fields.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirm) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    try {
      const { nextStep } = await signUp({
        username: email,
        password,
        options: { userAttributes: { email, name } },
      });
      if (nextStep.signUpStep === "CONFIRM_SIGN_UP") {
        setStep("confirm");
      }
    } catch (err: unknown) {
      const errCode = (err as { name?: string }).name;
      if (errCode === "UsernameExistsException") {
        setError("An account with this email already exists.");
      } else if (errCode === "InvalidPasswordException") {
        setError(
          "Password too weak. Use 8+ chars with uppercase, number & symbol."
        );
      } else {
        setError(err instanceof Error ? err.message : "Sign up failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleConfirm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!code.trim()) {
      setError("Please enter the confirmation code.");
      return;
    }
    setLoading(true);
    try {
      await confirmSignUp({ username: email, confirmationCode: code.trim() });
      router.push("/login");
    } catch (err: unknown) {
      const errCode = (err as { name?: string }).name;
      if (errCode === "CodeMismatchException") {
        setError("Incorrect code. Please try again.");
      } else if (errCode === "ExpiredCodeException") {
        setError("Code expired. Please sign up again.");
      } else {
        setError(err instanceof Error ? err.message : "Confirmation failed.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-lg">T</span>
            </div>
            <span className="text-2xl font-bold text-gray-900">TaskFlow</span>
          </Link>

          {step === "signup" ? (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                Create an account
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                Start organizing your tasks in seconds
              </p>
            </>
          ) : (
            <>
              <h1 className="text-2xl font-bold text-gray-900">
                Check your email
              </h1>
              <p className="text-gray-500 mt-1 text-sm">
                We sent a 6-digit code to{" "}
                <span className="font-medium text-gray-700">{email}</span>
              </p>
            </>
          )}
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-100 p-8">
          {step === "signup" ? (
            <form onSubmit={handleSignUp} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Full name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Email address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 8 characters"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirm password
                </label>
                <input
                  type="password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-sm text-gray-900 placeholder-gray-400"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Creating account…" : "Create Account"}
              </button>
            </form>
          ) : (
            <form onSubmit={handleConfirm} className="space-y-5">
              {error && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
                  {error}
                </div>
              )}
              <div className="p-4 bg-indigo-50 border border-indigo-100 rounded-lg text-sm text-indigo-700">
                📧 A 6-digit confirmation code was sent to your email. Check
                your spam folder if you don&apos;t see it.
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Confirmation code
                </label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  placeholder="123456"
                  maxLength={6}
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-gray-900 placeholder-gray-400 tracking-widest text-center font-mono text-lg"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {loading ? "Verifying…" : "Confirm Email"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setStep("signup");
                  setCode("");
                  setError("");
                }}
                className="w-full py-2 text-sm text-gray-400 hover:text-indigo-500 transition-colors"
              >
                ← Go back
              </button>
            </form>
          )}

          {step === "signup" && (
            <p className="text-center text-sm text-gray-500 mt-6">
              Already have an account?{" "}
              <Link
                href="/login"
                className="text-indigo-600 font-medium hover:underline"
              >
                Sign in
              </Link>
            </p>
          )}
        </div>

        <p className="text-center text-xs text-gray-400 mt-6">
          Secured by AWS Cognito
        </p>
        <div className="text-center mt-3">
          <Link
            href="/"
            className="text-xs text-gray-400 hover:text-indigo-500 transition-colors"
          >
            ← Back to home
          </Link>
        </div>
      </div>
    </div>
  );
}
