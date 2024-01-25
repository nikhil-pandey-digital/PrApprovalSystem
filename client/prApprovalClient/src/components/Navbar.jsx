import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user"));

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
  }

  return (
    <nav
      style={{
        display: "flex",
        justifyContent: "space-between",
        padding: "1em",
        backgroundColor: "#f5f5f5",
      }}
    >
      {!user ? (
        <div>
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/signup")}>Signup</button>
        </div>
      ) : (
        <>
          <div>
            <button onClick={() => navigate("/prs")}>My PRs</button>
            <button onClick={() => navigate("/prsToApprove")}>
              PRs To Approve
            </button>
            {user.role === "user" && (
              <button onClick={() => navigate("/create-pr")}>
                Create a PR
              </button>
            )}
             <button onClick={handleLogout}>
              Logout
            </button>
          </div>
          <div>{user.name}</div>
        </>
      )}
    </nav>
  );
};

export default Navbar;
