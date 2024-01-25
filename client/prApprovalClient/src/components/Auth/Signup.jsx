import { useNavigate } from "react-router-dom";
import API from "../../Api/index";
import "./Signup.css";

const Signup = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    API.post("/api/v1/users/signup", data).then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("token", JSON.stringify(res.data.token));
      navigate("/");
    });
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <input type="text" name="name" placeholder="Name" />
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />
      <input
        type="password"
        name="passwordConfirm"
        placeholder="Confirm Password"
      />
      <select name="role">
        <option value="user">User</option>
        <option value="approver">Approver</option>
      </select>
      <button type="submit">Sign Up</button>
    </form>
  );
};

export default Signup;
