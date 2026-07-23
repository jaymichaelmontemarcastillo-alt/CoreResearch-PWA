import { useState } from "react";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../firebase/firebase";

const Login = () => {
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Google Sign In
  const signInWithGoogle = async () => {
    setAuthing(true);
    setError("");

    try {
      const response = await signInWithPopup(auth, googleProvider);
      console.log(response.user.uid);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
      setAuthing(false);
    }
  };

  // Email Sign In
  const signInWithEmail = async () => {
    setAuthing(true);
    setError("");

    try {
      const response = await signInWithEmailAndPassword(auth, email, password);

      console.log(response.user.uid);
      navigate("/");
    } catch (error: any) {
      console.log(error);
      setError(error.message);
      setAuthing(false);
    }
  };

  return (
    <div className="w-full h-screen flex">
      {/* Left Side - Brand/Image Section */}
      <div className="w-1/2 h-full bg-[#0d0f14] flex flex-col items-start p-14">
        {/* Logo lockup */}
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white font-bold text-base">
            C
          </div>
          <span className="text-white font-bold text-lg">CoreResearch</span>
        </div>

        <div className="max-w-[450px] mt-40">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-3 py-1.5 mb-6">
            <span className="text-blue-400 text-sm">✦</span>
            <span className="text-gray-300 text-sm font-medium">
              Hybrid Research Management
            </span>
          </div>

          <p className="text-white text-3xl font-bold leading-snug">
            "From the first title proposal to the last published page — all in
            one workspace."
          </p>
          <p className="text-gray-500 text-sm mt-4">
            — Office of Graduate Research, prototype demo
          </p>
        </div>
      </div>

      {/* Right Side - Login Form */}
      <div className="w-1/2 h-full bg-[#111318] flex flex-col p-20 justify-center">
        <div className="max-w-[450px] mx-auto w-full">
          <h3 className="text-3xl font-bold text-white mb-2">Welcome back</h3>
          <p className="text-gray-400 mb-8">
            Sign in to your CoreResearch account
          </p>

          <div className="mb-2 text-gray-300 text-sm font-medium">
            Institutional email
          </div>
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <div className="flex justify-between items-center mb-2">
            <div className="text-gray-300 text-sm font-medium">Password</div>
            <a href="#" className="text-sm text-blue-400 hover:text-blue-300">
              Forgot?
            </a>
          </div>
          <input
            type="password"
            placeholder="Enter your password"
            className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={signInWithEmail}
            disabled={authing}
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition disabled:opacity-60"
          >
            Sign in
          </button>

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

          <p className="text-gray-400 mt-6 text-center">
            No account?{" "}
            <a
              href="/signup"
              className="text-blue-400 hover:text-blue-300 hover:underline"
            >
              Register
            </a>
          </p>

          <div className="mt-12 pt-6 border-t border-gray-700">
            <p className="text-gray-500 text-sm text-center">
              © 2026 CoreResearch University Edition
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
