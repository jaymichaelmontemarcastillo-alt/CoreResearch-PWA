import React, { useEffect, useState } from "react";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";

export interface IAuthRouteProps {
  children: React.ReactNode;
}

const AuthRoute: React.FunctionComponent<IAuthRouteProps> = (props) => {
  const { children } = props;
  const auth = getAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          // Verify user exists in Firestore
          const userDocRef = doc(db, "users", user.uid);
          const userDoc = await getDoc(userDocRef);

          if (userDoc.exists()) {
            const userData = userDoc.data();
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
            setLoading(false);
          } else {
            console.log("User document not found in Firestore");
            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            setLoading(false);
            navigate("/login");
          }
        } catch (error) {
          console.error("Error verifying user:", error);
          setLoading(false);
          navigate("/login");
        }
      } else {
        console.log("unauthorized");
        localStorage.removeItem("user");
        localStorage.removeItem("isLoggedIn");
        setLoading(false);
        navigate("/login");
      }
    });
    return () => unsubscribe();
  }, [auth, navigate]);

  if (loading) return <p></p>;

  return <div>{children}</div>;
};

export default AuthRoute;
