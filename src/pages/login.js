"use client";

import { useState, useContext } from "react";
import { useRouter } from "next/router";
import { Mail, Lock, Eye, EyeOff, ArrowRight } from "lucide-react";
import { userContext } from "./_app";
import { Api } from "@/services/service";
import { toast } from "react-toastify";

export default function Login(props) {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [userDetail, setUserDetail] = useState({ email: "", password: "" });
  const [user, setUser] = useContext(userContext);

  const submit = async () => {
    setSubmitted(true);

    if (!userDetail.email || !userDetail.password) {
      toast.error("Missing credentials");
      return;
    }

    try {
      setLoading(true);
      props.loader(true);

      const res = await Api("post", "auth/login", { ...userDetail }, router);

      if (res?.status) {
        const user = res.data.user;

        if (user.role === "Admin") {
          localStorage.setItem("userDetail", JSON.stringify(user));
          localStorage.setItem("token", res.data?.token);
          setUser(user);
          toast.success(res.data.message);
          router.push("/");
        } else {
          toast.error(res.data.message || "You are not authorized");
        }
      } else {
        toast.error("Login failed");
      }
    } catch (err) {
      toast.error(err?.message || "Something went wrong");
    } finally {
      props.loader(false);
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-black flex items-center justify-center px-4 py-10">
      {/* Background Pattern */}
      <div className="absolute inset-0 pointer-events-none -z-10">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, rgba(223,243,73,0.15) 1px, transparent 0)",
            backgroundSize: "30px 30px",
          }}
        ></div>
      </div>

      <div className="relative w-full max-w-md z-20">
        <div className="bg-gray-900 border rounded-3xl border-green-500/20  backdrop-blur-sm  p-6 md:p-8 shadow-2xl transition-all duration-300">
          <h1 className="text-center text-xl md:text-3xl font-bold text-custom-yellow mb-3">Forma</h1>
          <div className="text-center mb-6 md:mb-8">
            <h1 className="text-xl md:text-2xl font-bold text-white">
              Welcome Back!
            </h1>
            <p className="text-white text-xs md:text-sm mt-1">
              Sign in to access your Admin dashboard
            </p>
          </div>

          <div className="space-y-6">
           
            <div>
              <label className="block text-sm font-semibold text-custom-yellow">
                Email
              </label>
              <div className="relative mt-1">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={userDetail.email}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, email: e.target.value })
                  }
                  className={`w-full pl-10 pr-4 py-3 bg-gray-800 text-white rounded-xl border focus:ring-2 focus:ring-custom-green outline-none transition-all ${
                    submitted && !userDetail.email
                      ? "border-red-500 bg-red-900/20"
                      : "border-gray-700"
                  }`}
                />
              </div>
              {submitted && !userDetail.email && (
                <p className="text-red-400 text-xs mt-1">Email is required</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-custom-yellow">
                Password
              </label>
              <div className="relative mt-1">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-custom-green pointer-events-none" />

                <input
                  type={showPass ? "text" : "password"}
                  placeholder="Enter your password"
                  value={userDetail.password}
                  onChange={(e) =>
                    setUserDetail({ ...userDetail, password: e.target.value })
                  }
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  className={`w-full pl-10 pr-12 py-3 bg-gray-800 text-white rounded-xl border focus:ring-2 focus:ring-custom-green outline-none transition-all ${
                    submitted && !userDetail.password
                      ? "border-red-500 bg-red-900/20"
                      : "border-gray-700"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  {showPass ? (
                    <EyeOff className="h-5 w-5 text-custom-yellow" />
                  ) : (
                    <Eye className="h-5 w-5 text-custom-yellow" />
                  )}
                </button>
              </div>
              {submitted && !userDetail.password && (
                <p className="text-red-400 text-xs mt-1">
                  Password is required
                </p>
              )}
            </div>

            <button
              onClick={submit}
              disabled={loading}
              className="w-full bg-custom-yellow text-black font-semibold py-2.5 rounded-xl hover:scale-[1.02] transition-transform shadow-lg disabled:opacity-70"
            >
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="animate-spin h-5 w-5 border-b-2 border-black rounded-full"></div>
                  Signing In...
                </div>
              ) : (
                <div className="flex items-center justify-center gap-2 cursor-pointer">
                  Sign In <ArrowRight className="h-5 w-5" />
                </div>
              )}
            </button>
          </div>
        </div>
      </div>

      <div className="hidden md:block absolute -top-14 -left-10 w-32 h-32 rounded-full bg-custom-green blur-md opacity-20"></div>
      <div className="hidden md:block absolute -bottom-10  w-32 h-32 rounded-full bg-custom-green blur-md opacity-20"></div>
    </div>
  );
}
