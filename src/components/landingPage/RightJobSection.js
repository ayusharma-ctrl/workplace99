import React, { useEffect, useState } from "react";
import SVG from './../../assets/svg4.png'
import SVG1 from './../../assets/svg3.png'
import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { collection, getDocs, query } from "firebase/firestore";
import { db } from "../../firebaseconfig";


function RightJobSection() {

  const navigate = useNavigate();
//with these states, we are able to check total number of jobs and registed candidates on our portal
  const [totalJobs, setTotalJobs] = useState(0)
  const [totalUsers, setTotalUsers] = useState(0)

// fetch all jobs from jobs collection
  const fetchAllJobs = async () => {
    const q = query(collection(db, "jobs"));
    const querySnapshot = await getDocs(q);
    let jobs = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      jobs.push(doc.data());
    });
    setTotalJobs(jobs.length);
  };

//fetching all the users, we can also filter them
  const fetchAllCandidates = async () => {
    const q = query(collection(db, "users"));
    const querySnapshot = await getDocs(q);
    let users = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      users.push(doc.data());
    });
    setTotalUsers(users.length);
  };
//on component render we are calling these functions
  useEffect(()=>{
    fetchAllJobs()
    fetchAllCandidates()
  },[])

  return (
    <div style={{
      backgroundImage: `url(${SVG1})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'left bottom',
    }}>
      <div className="right-job-section"
        style={{
          backgroundImage: `url(${SVG})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'left top',
        }}
      >
        <h1>
          Get The <span>Right Job </span>
          You Deserve
        </h1>

        <div>
          <Button variant="contained" onClick={()=>navigate('/candidate/auth')}>
            Looking For A Job?
          </Button>
        </div>
        <div style={{margin: '20px auto'}}>
          OR
        </div>
        <div>
          <Button variant="contained" color="success" onClick={()=>navigate('/employer/auth')}>
            Want to Hire?
          </Button>
        </div>

        <h3> {totalJobs} Jobs & {totalUsers} Candidates are registered!!! </h3>
      </div>
    </div>
  );
}

export default RightJobSection;
