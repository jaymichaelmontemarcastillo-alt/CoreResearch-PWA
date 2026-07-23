import { useState } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const signUpWithGoogle = async () => {
    setAuthing(true);

    signInWithPopup(auth, new GoogleAuthProvider())
      .then((response) => {
        console.log(response.user.uid);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setAuthing(false);
      });
  };

  const signUpWithEmail = async () => {
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setAuthing(true);
    setError("");

    createUserWithEmailAndPassword(auth, email, password)
      .then((response) => {
        console.log(response.user.uid);
        navigate("/");
      })
      .catch((error) => {
        console.log(error);
        setError(error.message);
        setAuthing(false);
      });
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

      {/* Right Side - Signup Form */}
      <div className="w-1/2 h-full bg-[#111318] flex flex-col p-20 justify-center">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          <div className="w-full flex flex-col mb-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Create Account</h3>
            <p className="text-gray-400">
              Sign up for your CoreResearch account
            </p>
          </div>

          <div className="w-full flex flex-col">
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

            <div className="mb-2 text-gray-300 text-sm font-medium">
              Password
            </div>
            <input
              type="password"
              placeholder="Create a password"
              className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <div className="mb-2 text-gray-300 text-sm font-medium">
              Confirm Password
            </div>
            <input
              type="password"
              placeholder="Re-enter your password"
              className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && <div className="text-red-500 mb-4 text-sm">{error}</div>}

          <button
            onClick={signUpWithEmail}
            disabled={authing}
            className="w-full bg-blue-500 text-white font-semibold py-3 rounded-md hover:bg-blue-600 transition disabled:opacity-60"
          >
            Sign up with Email
          </button>

          <div className="w-full flex items-center justify-center relative py-4 mt-2">
            <div className="w-full h-[1px] bg-gray-700"></div>
            <p className="text-sm absolute text-gray-500 bg-[#111318] px-2">
              OR
            </p>
          </div>

          <button
            onClick={signUpWithGoogle}
            disabled={authing}
            className="w-full bg-transparent border border-gray-700 text-white font-semibold rounded-md py-3 text-center flex items-center justify-center cursor-pointer hover:bg-white/5 transition disabled:opacity-60"
          >
            Sign up with Google
          </button>

          <div className="w-full flex items-center justify-center mt-6">
            <p className="text-sm text-gray-400">
              Already have an account?{" "}
              <a
                href="/login"
                className="text-blue-400 hover:text-blue-300 hover:underline"
              >
                Log in
              </a>
            </p>
          </div>

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

export default Signup;
