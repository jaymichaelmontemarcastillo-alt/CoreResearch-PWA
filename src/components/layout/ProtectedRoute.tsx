import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/firebase";

const ProtectedRoute: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);

      if (currentUser) {
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
          }),
        );
        localStorage.setItem("isLoggedIn", "true");
      } else {
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
      }
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

  return <Outlet />;
};

export default ProtectedRoute;
