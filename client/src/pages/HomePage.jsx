import { useNavigate } from "react-router-dom";
import { signOut } from "../services/authService.js";

const HomePage = () => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  return (
    <div className="page home">
      <div className="panel">
        <h1>Welcome to Flownic</h1>
        <p className="muted">You are authenticated and verified.</p>
        <button className="secondary" type="button" onClick={handleSignOut}>
          Sign Out
        </button>
      </div>
    </div>
  );
};

export default HomePage;
