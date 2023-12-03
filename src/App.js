import "./App.css";
import React, { useState, useEffect } from "react";

import MemberList from "./FetchData";

function App() {
  const [members, setMembers] = useState([]);

  useEffect(() => {
    fetchMembers();
  }, []);

  const fetchMembers = async () => {
    try {
      const response = await fetch(
        "https://geektrust.s3-ap-southeast-1.amazonaws.com/adminui-problem/members.json"
      );
      if (!response.ok) {
        throw new Error("Failed to fetch members");
      }
      const memberData = await response.json();
      setMembers(memberData);
    } catch (error) {
      console.error("Error fetching members:", error);
    }
  };
  return (
    <>
      <div className="search"></div>
      <h1>Admin Dashboard</h1>
      <MemberList members={members} />
    </>
  );
}

export default App;
