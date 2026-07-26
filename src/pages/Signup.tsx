import { useState, useEffect } from "react";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

// Define interface for user data
interface UserData {
  uid: string;
  email: string | null;
  first_name: string;
  last_name: string;
  role_id: string;
  department_id: string;
  status: string;
  profile_image: string | null;
  created_at: Date;
  updated_at: Date;
  is_approved: boolean;
}

const Signup = () => {
  const auth = getAuth();
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roleId, setRoleId] = useState("");
  const [departmentId, setDepartmentId] = useState("");
  const [error, setError] = useState("");

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Get user document from Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
            localStorage.setItem(
              "user",
              JSON.stringify({
                uid: user.uid,
                email: user.email,
                displayName:
                  user.displayName || user.email?.split("@")[0] || "User",
                photoURL: user.photoURL,
                firstName: userData.first_name || "",
                lastName: userData.last_name || "",
                roleId: userData.role_id || "",
                departmentId: userData.department_id || "",
                isApproved: userData.is_approved || false,
              }),
            );
            localStorage.setItem("isLoggedIn", "true");
            navigate("/dashboard", { replace: true });
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    });

    return () => unsubscribe();
  }, [auth, navigate]);

  // Helper function to create Firestore user document
  const createUserDocument = async (
    uid: string,
    userData: Partial<UserData>,
  ) => {
    try {
      console.log("Creating user document for UID:", uid);
      console.log("User data:", userData);

      const userDocRef = doc(db, "users", uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        // In the createUserDocument function
        const newUserData: UserData = {
          uid: uid,
          email: userData.email || null,
          first_name: userData.first_name || "",
          last_name: userData.last_name || "",
          role_id: userData.role_id || "student", // Default to student
          department_id: userData.department_id || "",
          status: "pending", // Changed from "active" to "pending"
          profile_image: userData.profile_image || null,
          created_at: new Date(),
          updated_at: new Date(),
          is_approved: false, // Always false until admin approves
        };

        console.log("Writing to Firestore:", newUserData);
        await setDoc(userDocRef, newUserData);
        console.log("Firestore document created successfully");
        return newUserData;
      } else {
        console.log("User document already exists");
        return userDoc.data();
      }
    } catch (error: any) {
      console.error("Error creating user document:", error);
      console.error("Error details:", error.message);
      throw new Error(`Failed to create user profile: ${error.message}`);
    }
  };

  const signUpWithGoogle = async () => {
    setAuthing(true);
    setError("");

    try {
      console.log("Starting Google sign-up...");
      const response = await signInWithPopup(auth, new GoogleAuthProvider());
      console.log("Google sign-up successful:", response.user.uid);

      const user = response.user;

      // Parse display name into first and last name
      let firstName = "";
      let lastName = "";
      if (user.displayName) {
        const nameParts = user.displayName.split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }

      // Check if user already has a document
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData;
      if (!userDoc.exists()) {
        // Create user document in Firestore
        userData = await createUserDocument(user.uid, {
          email: user.email || "",
          first_name: firstName,
          last_name: lastName,
          role_id: roleId || "",
          department_id: departmentId || "",
          profile_image: user.photoURL || null,
        });
      } else {
        userData = userDoc.data();
        console.log("User already exists in Firestore");
      }

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email,
          displayName: user.displayName || user.email?.split("@")[0] || "User",
          photoURL: user.photoURL,
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          roleId: userData.role_id || "",
          departmentId: userData.department_id || "",
          isApproved: userData.is_approved || false,
        }),
      );
      localStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Google sign-up error:", error);
      setError(error.message);
      setAuthing(false);
    }
  };

  const signUpWithEmail = async () => {
    // Validation
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (!firstName.trim()) {
      setError("First name is required");
      return;
    }

    if (!lastName.trim()) {
      setError("Last name is required");
      return;
    }

    if (!roleId) {
      setError("Please select a role");
      return;
    }

    if (!departmentId) {
      setError("Please select a department");
      return;
    }

    setAuthing(true);
    setError("");

    try {
      console.log("Starting email sign-up...");
      console.log("Email:", email);
      console.log("First name:", firstName);
      console.log("Last name:", lastName);
      console.log("Role:", roleId);
      console.log("Department:", departmentId);

      // Create Firebase Auth user
      const response = await createUserWithEmailAndPassword(
        auth,
        email,
        password,
      );
      console.log("Email sign-up successful:", response.user.uid);

      const user = response.user;

      // Create user document in Firestore
      const userData = await createUserDocument(user.uid, {
        email: user.email || email,
        first_name: firstName,
        last_name: lastName,
        role_id: roleId,
        department_id: departmentId,
        profile_image: null,
      });

      console.log("User data saved:", userData);

      // Store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify({
          uid: user.uid,
          email: user.email || email,
          displayName:
            `${firstName} ${lastName}` || user.email?.split("@")[0] || "User",
          photoURL: null,
          firstName: userData.first_name || "",
          lastName: userData.last_name || "",
          roleId: userData.role_id || "",
          departmentId: userData.department_id || "",
          isApproved: userData.is_approved || false,
        }),
      );
      localStorage.setItem("isLoggedIn", "true");

      navigate("/dashboard");
    } catch (error: any) {
      console.error("Email sign-up error:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);

      // Handle specific Firebase Auth errors
      if (error.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please sign in instead.");
      } else if (error.code === "auth/invalid-email") {
        setError("Invalid email address. Please check and try again.");
      } else if (error.code === "auth/weak-password") {
        setError("Password is too weak. Please use at least 6 characters.");
      } else {
        setError(
          error.message || "Failed to create account. Please try again.",
        );
      }
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

      {/* Right Side - Signup Form */}
      <div className="w-1/2 h-full bg-[#111318] flex flex-col p-20 justify-center overflow-y-auto">
        <div className="w-full flex flex-col max-w-[450px] mx-auto">
          <div className="w-full flex flex-col mb-8 text-white">
            <h3 className="text-3xl font-bold mb-2">Create Account</h3>
            <p className="text-gray-400">
              Sign up for your CoreResearch account
            </p>
          </div>

          <div className="w-full flex flex-col">
            {/* First Name */}
            <div className="mb-2 text-gray-300 text-sm font-medium">
              First Name
            </div>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />

            {/* Last Name */}
            <div className="mb-2 text-gray-300 text-sm font-medium">
              Last Name
            </div>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />

            {/* Email */}
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

            {/* Role ID */}
            <div className="mb-2 text-gray-300 text-sm font-medium">Role</div>
            <select
              className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
              value={roleId}
              onChange={(e) => setRoleId(e.target.value)}
            >
              <option value="">Select your role</option>
              <option value="admin">Admin</option>
              <option value="faculty">Faculty</option>
              <option value="researcher">Researcher</option>
              <option value="student">Student</option>
            </select>

            {/* Department ID */}
            <div className="mb-2 text-gray-300 text-sm font-medium">
              Department
            </div>
            <select
              className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
              value={departmentId}
              onChange={(e) => setDepartmentId(e.target.value)}
            >
              <option value="">Select your department</option>
              <option value="cs">Computer Science</option>
              <option value="eng">Engineering</option>
              <option value="med">Medicine</option>
              <option value="sci">Science</option>
              <option value="hum">Humanities</option>
            </select>

            {/* Password */}
            <div className="mb-2 text-gray-300 text-sm font-medium">
              Password
            </div>
            <input
              type="password"
              placeholder="Create a password (min 6 characters)"
              className="w-full text-white py-3 px-4 mb-6 bg-[#1a1d24] border border-gray-700 rounded-md outline-none focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Confirm Password */}
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
            {authing ? "Creating Account..." : "Sign up with Email"}
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
            <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
              <path
                fill="#FFFFFF"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
              />
              <path
                fill="#FFFFFF"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FFFFFF"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#FFFFFF"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
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
