const AuthTabs = ({ activeTab, onChange }) => {
  return (
    <div className="tabs">
      <button
        type="button"
        className={activeTab === "signin" ? "tab active" : "tab"}
        onClick={() => onChange("signin")}
      >
        Sign In
      </button>
      <button
        type="button"
        className={activeTab === "signup" ? "tab active" : "tab"}
        onClick={() => onChange("signup")}
      >
        Sign Up
      </button>
    </div>
  );
};

export default AuthTabs;
