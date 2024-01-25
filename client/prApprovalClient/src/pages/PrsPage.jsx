import { useEffect, useState } from "react";
import API from "../Api/index";
import Card from "../components/Card";

const PrsPage = () => {
  const [user, setUser] = useState(null);

  //fetch fresh user details
  useEffect(() => {
    API.get("/api/v1/users/me").then((res) => {
      localStorage.setItem("user", JSON.stringify(res.data.user));
      setUser(res.data.user);
    });
  }, []);

  return (
    <div>
      {user && user.prs.map((pr) => <Card key={pr._id} pr={pr.prId} />)}
    </div>
  );
};

export default PrsPage;
