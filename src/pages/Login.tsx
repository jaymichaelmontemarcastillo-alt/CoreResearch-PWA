import { useState, useEffect } from "react";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider, db } from "../firebase/firebase";
import {
  doc,
  getDoc,
  setDoc,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const Login = () => {
  const navigate = useNavigate();

  const [authing, setAuthing] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Helper function to find user by email if UID doesn't match
  const findUserByEmail = async (email: string) => {
    try {
      const usersRef = collection(db, "users");
      const q = query(usersRef, where("email", "==", email));
      const querySnapshot = await getDocs(q);

      if (!querySnapshot.empty) {
        const doc = querySnapshot.docs[0];
        return { id: doc.id, data: doc.data() };
      }
      return null;
    } catch (error) {
      console.error("Error finding user by email:", error);
      return null;
    }
  };

  // Helper function to create user document
  const createUserDocument = async (user: any) => {
    try {
      console.log("Creating user document for:", user.uid);

      const userDocRef = doc(db, "users", user.uid);

      // Parse display name
      let firstName = "";
      let lastName = "";
      if (user.displayName) {
        const nameParts = user.displayName.split(" ");
        firstName = nameParts[0] || "";
        lastName = nameParts.slice(1).join(" ") || "";
      }

      const userData = {
        uid: user.uid,
        email: user.email || "",
        first_name: firstName,
        last_name: lastName,
        role_id: "",
        department_id: "",
        status: "active",
        profile_image: user.photoURL || null,
        created_at: new Date(),
        updated_at: new Date(),
        is_approved: false,
      };

      await setDoc(userDocRef, userData);
      console.log("User document created successfully");
      return userData;
    } catch (error: any) {
      console.error("Error creating user document:", error);
      throw new Error("Failed to create user profile");
    }
  };

  // Check if already logged in
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          console.log("Auth state changed - User UID:", user.uid);
          console.log("Auth state changed - User Email:", user.email);

          // Try to get user document by UID first
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          let userData;

          if (userDoc.exists()) {
            userData = userDoc.data();
            if (!userData.is_approved) {
              setError(
                "Your account is pending approval. Please wait for admin approval.",
              );
              setAuthing(false);
              return;
            }
            console.log("User document found by UID:", userData);
          } else {
            console.log(
              "No document found for UID, trying to find by email...",
            );

            // Try to find user by email
            const userByEmail = await findUserByEmail(user.email || "");

            if (userByEmail) {
              console.log("User found by email:", userByEmail);
              userData = userByEmail.data;

              // Update the document to use the correct UID
              const correctUserDocRef = doc(db, "users", user.uid);
              await setDoc(correctUserDocRef, {
                ...userData,
                uid: user.uid,
                updated_at: new Date(),
              });
              console.log("Updated document with correct UID");
            } else {
              console.log("User not found by email, creating new document...");
              userData = await createUserDocument(user);
            }
          }

          // Store user data in localStorage
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
        } catch (error: any) {
          console.error("Error in auth state change:", error);
          setError(error.message);
        }
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  // Google Sign In
  const signInWithGoogle = async () => {
    setAuthing(true);
    setError("");

    try {
      const response = await signInWithPopup(auth, googleProvider);
      console.log("Google sign-in successful:", response.user.uid);

      const user = response.user;

      // Check if user document exists
      const userDocRef = doc(db, "users", user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData;
      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log("User document found");
      } else {
        console.log("User document not found, creating one...");
        userData = await createUserDocument(user);
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
      console.log("Email sign-in successful:", response.user.uid);

      // Get user document from Firestore
      const userDocRef = doc(db, "users", response.user.uid);
      const userDoc = await getDoc(userDocRef);

      let userData;
      if (userDoc.exists()) {
        userData = userDoc.data();
        console.log("User document found");
      } else {
        console.log("User document not found by UID, trying by email...");

        // Try to find by email
        const userByEmail = await findUserByEmail(email);

        if (userByEmail) {
          console.log("User found by email:", userByEmail);
          userData = userByEmail.data;

          // Update the document to use the correct UID
          const correctUserDocRef = doc(db, "users", response.user.uid);
          await setDoc(correctUserDocRef, {
            ...userData,
            uid: response.user.uid,
            updated_at: new Date(),
          });
          console.log("Updated document with correct UID");
        } else {
          console.log("User not found, creating new document...");
          userData = await createUserDocument(response.user);
        }
      }

      // Store user data in localStorage
      const user = response.user;
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
            {authing ? "Signing in..." : "Sign in"}
          </button>

          {error && <p className="text-red-500 mt-4 text-sm">{error}</p>}

          <div className="mt-6">
            <button
              onClick={signInWithGoogle}
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
              Sign in with Google
            </button>
          </div>

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
