import { useNavigate } from "react-router-dom";

import API from "../../Api/index";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    API.post("/api/v1/users/login", data).then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data.data.user));
      localStorage.setItem("token", JSON.stringify(res.data.token));
      navigate("/");
    });
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <input type="email" name="email" placeholder="Email" />
      <input type="password" name="password" placeholder="Password" />

      <button type="submit">Log in</button>
    </form>
  );
};

export default Login;
