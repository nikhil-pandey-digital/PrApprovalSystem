import { useNavigate } from "react-router-dom";
import "./Card.css";
const Card = (props) => {
  const navigate = useNavigate();

  return (
    <div className="card">
      <p>Title: {props.pr.title}</p>
      <p>Status: {props.pr.status}</p>

      <button
        onClick={() => navigate("/prDetails", { state: { pr: props.pr } })}
      >
        Details
      </button>
    </div>
  );
};

export default Card;
