import { useState, useRef, useEffect } from "react";
import { LogOut, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { signOut } from "../services/authService.js";

const UserAccountMenu = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = async () => {
    await signOut();
    navigate("/auth");
  };

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className="user-account" ref={menuRef}>
      <button
        className="user-button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="user-avatar">{getInitials(user.username || "User")}</div>
        <div className="user-info">
          <div className="user-name">{user.username}</div>
          <div className="user-email">{user.email}</div>
        </div>
      </button>

      {isOpen && (
        <div className="user-menu">
          <button className="menu-item">
            <Settings size={18} />
            Settings
          </button>
          <button className="menu-item logout" onClick={handleLogout}>
            <LogOut size={18} />
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default UserAccountMenu;
