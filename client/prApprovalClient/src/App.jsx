import { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";

import HomePage from "./pages/HomePage";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";
import PrCreatePage from "./pages/PrCreatePage";
import PrsPage from "./pages/PrsPage";
import PrsToApprovePage from "./pages/PrsToApprovePage";
import PrDetailsPage from "./pages/PrDetailsPage";
import PrEditPage from "./pages/PrEditPage";

function App() {
  return (
    <>
      {/* <HomePage /> */}
      <Router>
        <Routes>
          <Route path="/" element={<HomePage />} />
        </Routes>
        <Routes>
          <Route path="/login" element={<Login />} />
        </Routes>
        <Routes>
          <Route path="/signup" element={<Signup />} />
        </Routes>
        <Routes>
          <Route path="/create-pr" element={<PrCreatePage />} />
        </Routes>
        <Routes>
          <Route path="/prs" element={<PrsPage />} />
        </Routes>
        <Routes>
          <Route path="/prsToApprove" element={<PrsToApprovePage />} />
        </Routes>
        <Routes>
          <Route path="/prDetails" element={<PrDetailsPage />} />
        </Routes>
        <Routes>
          <Route path="/editPr" element={<PrEditPage />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
