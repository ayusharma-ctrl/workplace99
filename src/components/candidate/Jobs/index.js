import React, { useEffect, useState } from "react";
import { collection, doc, getDocs, query, setDoc, where, } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import JobsCard from "./JobsCard";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import { TextField } from "@mui/material";
import Search from "../../../assets/search.png"
import toast from "../../common/Toast";

//have already explained how this code works in Employer Component
//candidate && employer components works the same way, slight data or state changes


function CandidateJobs() {
  const userData = useSelector((state) => state.login)

  const [Alljobs, setAlljobs] = useState(null);
  const [applications, setApplications] = useState(null);
  const [filteredJobs, setFliteredJobs] = useState(Alljobs || [])

  const fetchAllJobs = async () => {
    // fetch all jobs from jobs collection
    const q = query(collection(db, "jobs"));
    const querySnapshot = await getDocs(q);
    let jobs = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      jobs.push(doc.data());
    });
    setAlljobs(jobs);
    setFliteredJobs(jobs)
    // console.log(jobs)
  };


  useEffect(() => {
    fetchAllJobs();
    fetchAllApplications();
  }, []);


  const fetchAllApplications = async () => {
    // fetch all applications from applications collection where candidate id is equal to current user id
    const q = query(
      collection(db, "applications"),
      where("candidateId", "==", userData.user.email)
    );
    const querySnapshot = await getDocs(q);
    let a = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      // console.log(doc.data());
      a.push(doc.data());
    });
    setApplications(a);
  };



  const handleSearchInput = (e) => {
    const searchTerm = e.target.value?.toLowerCase()?.trim();
    const result = filterJobs(searchTerm);
    setFliteredJobs(result);
  };

  const filterJobs = (searchTerm) => {
    return Alljobs?.filter((job) =>
      job.employerName.toLowerCase().includes(searchTerm) ||
      job.jobTitle.toLowerCase().includes(searchTerm) ||
      job.jobType.toLowerCase().includes(searchTerm) ||
      job.jobLocation.toLowerCase().includes(searchTerm)
    );
  };


  const applyonJob = async (job) => {
    // console.log(job, "job");
    const applicationId = uuidv4();

    // check if user has already applied for the job
    //1 get all the applications from applications collection where candidate id is equal to current user id
    //2 check if any of the application has the same job id as the job id of the job that user is applying for
    //3 if yes then show a toast message saying you have already applied for this job
    // else apply for the job

    const q = query(
      collection(db, "applications"),
      where("candidateId", "==", userData.user.email)
    );
    const querySnapshot = await getDocs(q);

    let applications = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      applications.push(doc.data());
    });

    let isApplied = applications.find((application) => application.jobId === job.jobId);

    if (isApplied) {
      toast("You have already applied for this job", "error");
      return;
    }

    // create a new collection in firestore call applications
    // create a new document in applications collection
    // store job id, candidate id,employer id, and all the relevant data
    // store a status field in the document

    try {
      await setDoc(doc(db, "applications", applicationId), {
        applicationId,
        ...job,
        createdAt: new Date().toISOString(),
        candidateId: userData.user.email,
        candidateName: userData.user.displayName,
        candidatePhoto: userData.user.photoURL,
        candidateExperience: userData.userInfo.experience,
        resume: userData.userInfo.resume,
        // expectedSalary: userData.userInfo.expectedSalary,
        candidatePrimaryRole: userData.userInfo.primaryRole,
        candidatePhone: userData.userInfo.phone,
        linkedIn: userData.userInfo.linkedIn,
        candidateSkills: userData.userInfo.skills,
        candidateBio: userData.userInfo.bio,
        status: "applied",
      });
      fetchAllApplications();
      toast("Applied successfully", "success");
    } catch (err) {
      // console.log(err);
      toast("Something went wrong", "error");
    }
  };



  return (
    <div>
      <div>
        <TextField
          sx={{
            fieldset: {
              borderRadius: "20px",
              backgroundImage: `url(${Search})`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 20px center',
              paddingRight: '20px'
            },
            width: '90%',
            marginTop: '30px',
          }}
          placeholder={"Search Jobs by Company Name, Job Title, Type, Location..."}
          size="small"
          onChange={handleSearchInput}
        />
      </div>

      {filteredJobs && filteredJobs.length === 0 ? (
        <div>no data</div>
      ) : filteredJobs && filteredJobs.length > 0 ? (
        <div>
          {filteredJobs.map((job, index) => {
            return <JobsCard job={job} key={index} applyonJob={applyonJob} applications={applications} />;
          })}
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )
}

export default CandidateJobs