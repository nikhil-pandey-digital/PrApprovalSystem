import API from "../Api/index";
import { useNavigate } from "react-router-dom";

const PrCreatePage = () => {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    if (data.approversList) {
      data.approversList = data.approversList
        .split(",")
        .map((email) => email.trim());
    }

    API.post("/api/v1/users/pullRequest", data, { withCredentials: true })
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          alert("PR created successfully");
        }
        navigate("/");
      })
      .catch((err) => {
        console.log(err);

        alert(err.message);
      });
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <input type="text" name="title" placeholder="Title" />
      <textarea type="text" name="description" placeholder="description" />
      <select name="prType">
        <option value="sequential">sequential</option>
        <option value="parallel">parallel</option>
      </select>

      <input
        type="text"
        name="approversList"
        placeholder="enter approvers email ids"
      />

      <button type="submit">Create PullRequest</button>
    </form>
  );
};

export default PrCreatePage;
