import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";

const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        try {
          // Get user document from Firestore
          const userDocRef = doc(db, "users", currentUser.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const data = userDoc.data();
            setUserData(data);

            // Store complete user data in localStorage
            localStorage.setItem(
              "user",
              JSON.stringify({
                uid: currentUser.uid,
                email: currentUser.email,
                displayName:
                  currentUser.displayName ||
                  currentUser.email?.split("@")[0] ||
                  "User",
                photoURL: currentUser.photoURL,
                firstName: data.first_name || "",
                lastName: data.last_name || "",
                roleId: data.role_id || "",
                departmentId: data.department_id || "",
                isApproved: data.is_approved || false,
              }),
            );
            localStorage.setItem("isLoggedIn", "true");
            setUser(currentUser);
          } else {
            // User document doesn't exist
            console.error("User document not found in Firestore");
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            setUser(null);
          }
        } catch (error) {
          console.error("Error fetching user data:", error);
          localStorage.removeItem("user");
          localStorage.removeItem("isLoggedIn");
          setUser(null);
        }
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0f14]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // You can add additional checks here, e.g., if user.is_approved is false
  // if (!userData?.is_approved) {
  //   return <Navigate to="/pending-approval" replace />;
  // }

  return <Outlet />;
};

export default ProtectedRoute;
