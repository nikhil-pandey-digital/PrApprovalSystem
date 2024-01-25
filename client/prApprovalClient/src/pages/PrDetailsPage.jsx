import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import API from "../Api/index";

const PrDetailsPage = () => {
  const [comments, setComments] = useState([]); // [{}, {}]
  const location = useLocation();
  const navigate = useNavigate();

  const { pr } = location.state;

  const user = JSON.parse(localStorage.getItem("user"));

  // get all the comments of pr
  useEffect(() => {
    API.get(`/api/v1/users/pullRequest/${pr._id}/comments`, {
      withCredentials: true,
    })
      .then((res) => {
        setComments(res.data.reviews);
      })
      .catch((err) => {
        console.log(err);
        alert(err.message);
      });
  }, []);

  const handleDeletePr = () => {
    API.delete(`/api/v1/users/pullRequest/${pr._id}`, {
      withCredentials: true,
    })
      .then((res) => {
        alert("PR deleted successfully");

        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.error);
      });
  };

  const handleApprovePr = () => {
    API.post(
      `/api/v1/users/pullRequest/${pr._id}/approvals`,
      { status: "approved" },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        alert("PR approved successfully");
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
        alert(err.response.data.error);
      });
  };

  const handleRejectPr = () => {
    API.post(
      `/api/v1/users/pullRequest/${pr._id}/approvals`,
      { status: "rejected" },
      {
        withCredentials: true,
      }
    )
      .then((res) => {
        alert("PR rejected successfully");
        navigate("/");
      })
      .catch((err) => {
        alert(err.response.data.error);
      });
  };

  const handleAddComment = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData);
    API.post(`/api/v1/users/pullRequest/${pr._id}/comments`, data, {
      withCredentials: true,
    })
      .then((res) => {
        alert("comment added successfully");
      })
      .catch((err) => {
        alert(err.message);
      });
  };

  return (
    <div>
      <h3>Title</h3>
      <p>{pr.title}</p>
      <h3>Description</h3>
      <p>{pr.description}</p>
      <h3>PR Type</h3>
      <p>{pr.prType}</p>
      <h3>Approvers status</h3>
      {pr.approvers.map((approver, i) => (
        <p key={approver._id}>
          {" "}
          approver{i + 1}:{approver.status}
        </p>
      ))}
      <h3>Comments</h3>
      {comments.map((comment) => (
        <p key={comment._id}>{comment.comment}</p>
      ))}

      {user.role === "approver" && (
        <>
          <button onClick={handleApprovePr}>Approve pr</button>
          <button onClick={handleRejectPr}>reject pr</button>
        </>
      )}
      {user.role === "user" && (
        <>
          <button onClick={() => navigate("/editPr", { state: { pr: pr } })}>
            Edit pr
          </button>
          <button onClick={handleDeletePr}>Delete pr</button>
        </>
      )}

      {user.role === "approver" && (
        <form onSubmit={handleAddComment}>
          <input type="placeholder" name="comment" placeholder="comment" />
          <button type="submit">Add comment</button>
        </form>
      )}
    </div>
  );
};

export default PrDetailsPage;
