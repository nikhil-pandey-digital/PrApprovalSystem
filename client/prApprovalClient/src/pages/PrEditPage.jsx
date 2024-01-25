import { useNavigate, useLocation } from "react-router-dom";
import { useState } from "react";
import API from "../Api/index";

const PrEditPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { pr } = location.state;

  const [title, setTitle] = useState(pr.title);
  const [description, setDescription] = useState(pr.description);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);

    API.put(`/api/v1/users/pullRequest/${pr._id}`, data, {
      withCredentials: true,
    })
      .then((res) => {
        alert("PR updated successfully");

        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  };

  return (
    <form className="signup-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
      />
      <textarea
        type="text"
        name="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
      />

      <button type="submit">update PullRequest</button>
    </form>
  );
};

export default PrEditPage;
