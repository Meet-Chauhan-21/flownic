import { useNavigate } from "react-router-dom";

const VerifiedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="page center">
      <div className="card">
        <h2>✅ Your email has been verified!</h2>
        <p className="muted">You can continue to your home page.</p>
        <button className="primary" type="button" onClick={() => navigate("/")}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default VerifiedPage;
