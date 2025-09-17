'use client';
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaGithub, FaMicrosoft } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const { loginWithGoogle, loginWithGithub, loginWithMicrosoft, loginWithEmailPassword, user } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLogin, setIsLogin] = useState(true);

  if (user) {
    router.push("/");
  }

  const handleSuccessfulLogin = async (user) => {
    try {
      if (user) {
        await fetch("/api/users/check-and-create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user.uid, email: user.email }),
        });
      }
      router.push("/");
    } catch (err) {
      console.error("Failed to handle post-login actions:", err);
      router.push("/");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      const userCredential = await loginWithGoogle();
      if (userCredential.user) await handleSuccessfulLogin(userCredential.user);
    } catch (err) {
      console.error("Google login failed", err);
    }
  };

  const handleGithubLogin = async () => {
    try {
      const userCredential = await loginWithGithub();
      if (userCredential.user) await handleSuccessfulLogin(userCredential.user);
    } catch (err) {
      console.error("GitHub login failed", err);
    }
  };

  const handleMicrosoftLogin = async () => {
    try {
      const userCredential = await loginWithMicrosoft();
      if (userCredential.user) await handleSuccessfulLogin(userCredential.user);
    } catch (err) {
      console.error("Microsoft login failed", err);
    }
  };

  const handleEmailLogin = async (e) => {
    e.preventDefault();
    try {
      const userCredential = await loginWithEmailPassword(email, password);
      if (userCredential.user) await handleSuccessfulLogin(userCredential.user);
    } catch (err) {
      console.error("Email login failed", err);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-3 sm:px-4 md:px-6 bg-gray-50">
      <div className="w-full max-w-sm sm:max-w-md md:max-w-lg bg-white rounded-2xl border border-gray-200 shadow-lg p-6 sm:p-8 space-y-6">
        <h1 className="text-2xl sm:text-3xl font-bold text-center font-heading text-gray-900">
          {isLogin ? "Sign in to" : "Join"}{" "}
          <span className="text-blue-600">HSA HUB</span>
        </h1>

        <p className="text-center text-xs sm:text-sm text-gray-500">
          {isLogin
            ? "Choose your login method"
            : "Create your account using any provider"}
        </p>

        {/* Providers */}
        <div className="space-y-3 sm:space-y-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-3 bg-white border border-gray-300 shadow-sm text-gray-800 py-2 sm:py-2.5 rounded-lg font-medium hover:bg-gray-100 transition text-sm sm:text-base"
          >
            <FcGoogle size={20} />
            {isLogin ? "Continue with Google" : "Sign up with Google"}
          </button>

          <button
            onClick={handleGithubLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#24292F] text-white py-2 sm:py-2.5 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base"
          >
            <FaGithub size={20} />
            {isLogin ? "Continue with GitHub" : "Sign up with GitHub"}
          </button>

          <button
            onClick={handleMicrosoftLogin}
            className="w-full flex items-center justify-center gap-3 bg-[#2F2F90] text-white py-2 sm:py-2.5 rounded-lg font-medium hover:opacity-90 transition text-sm sm:text-base"
          >
            <FaMicrosoft size={20} />
            {isLogin ? "Continue with Microsoft" : "Sign up with Microsoft"}
          </button>
        </div>

        {/* Email Login */}
        {isLogin && (
          <>
            <div className="relative text-center text-xs sm:text-sm text-gray-400">
              <span className="px-2 bg-white">or use email</span>
              <div className="absolute left-0 top-1/2 w-full h-px bg-gray-200 -z-10" />
            </div>

            <form className="space-y-3 sm:space-y-4">
              <input
                type="email"
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />

              <input
                type="password"
                className="w-full px-3 sm:px-4 py-2 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />

              <button
                type="submit"
                className="w-full bg-blue-600 text-white hover:bg-blue-700 py-2 rounded-lg font-semibold transition text-sm sm:text-base"
                onClick={handleEmailLogin}
              >
                Login with Email
              </button>
            </form>
          </>
        )}

        {/* Toggle */}
        <p className="text-xs sm:text-sm text-gray-500 text-center">
          {isLogin ? (
            <>
              Don&apos;t have an account?{" "}
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={() => setIsLogin(false)}
              >
                Sign up
              </span>
            </>
          ) : (
            <>
              Already have an account?{" "}
              <span
                className="text-blue-600 underline cursor-pointer"
                onClick={() => setIsLogin(true)}
              >
                Sign in
              </span>
            </>
          )}
        </p>
      </div>
    </div>
  );
}
