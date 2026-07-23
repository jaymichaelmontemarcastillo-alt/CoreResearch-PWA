import { useNavigate } from "react-router-dom";

function App() {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove login data
    localStorage.removeItem("isLoggedIn");

    // Go back to login page
    navigate("/login");
  };

  return (
    <>
      <h1>You're currently logged in.</h1>

      <button onClick={handleLogout}>Logout</button>
    </>
  );
}

export default App;
