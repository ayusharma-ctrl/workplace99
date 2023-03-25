import { Grid } from "@mui/material";
import React, { useEffect, useState } from "react";
import Form from "./Form";
import FormEdit from "./FormEdit";
import Sidebar from "./Sidebar";
import './jobs.css'
import { useSelector } from "react-redux";
import { db } from "../../../firebaseconfig";
import { collection, onSnapshot, query, where } from "firebase/firestore";


function EmployerJobs() {

  const [selectedJob, setSelectedJob] = useState(null);
  const [showFormInMobile, setShowFormInMobile] = useState(false);
  const [editInMobile, setEditInMobile] = useState(false);
  const [allJobs, setAllJobs] = useState(null);
  const [isJobPost, setIsJobPost] = useState(true);
  const userData = useSelector((state) => state.login)

//handle post button onClick
  const postAjob = () => {
    setShowFormInMobile(true)
    setEditInMobile(false)
    setSelectedJob(null)
  }
//this func is to update the css properties of selected job card and show the right job data
  const selectedAjob = (job) => {
    setShowFormInMobile(false)
    setEditInMobile(true)
    setSelectedJob(job)
  }
//fetching all the jobs from database jobs
  const fetchAllJobs = () => {
    const q = query(
      //collection ref
      collection(db, "jobs"),
      //condition
      where("employerId", "==", userData.user.email)
    );
    onSnapshot(q, (snapshot) => {
      let jobs = [];
      snapshot.forEach((doc) => {
        jobs.push(doc.data());
      });
      setAllJobs(jobs);
      // console.log(jobs);
    });
  };


  useEffect(() => {
    fetchAllJobs();
  }, []);


  return (
    <Grid container spacing={2} >

      <Grid
        sx={{
          display: { xs: showFormInMobile || editInMobile ? "none" : "block", md: "block" },
          background: '#fff'
        }}
        item xs={12} md={3}>
        <Sidebar
          postAjob={postAjob}
          selectedJob={selectedJob}
          selectedAjob={selectedAjob}
          allJobs={allJobs}
          isJobPost={isJobPost}
        />
      </Grid>

      <Grid item xs={12} md={9} className='formArea' >

        <Grid sx={{ display: { xs: showFormInMobile ? "block" : "none" }, }} item>
          <Form
            selectedJob={selectedJob}
            setShowFormInMobile={setShowFormInMobile}
          />
        </Grid>

        <Grid sx={{ display: { xs: editInMobile ? "block" : "none" }, }} item>
          <FormEdit
            selectedJob={selectedJob}
            setSelectedJob={setSelectedJob}
            setEditInMobile={setEditInMobile}
            allJobs={allJobs}
          />
        </Grid>
        
      </Grid>
    </Grid>
  );
}

export default EmployerJobs;
