import React, { useState, useEffect } from 'react'
import { collection, deleteDoc, doc, getDocs, onSnapshot, query, setDoc, where } from "firebase/firestore";
import { useSelector } from 'react-redux';
import { db } from '../../../firebaseconfig';
import { v4 as uuidv4 } from 'uuid'
import ApplicantsTable from '../../common/ApplicantsTable';
import { Button, Dialog, DialogTitle, Grid, TextField } from '@mui/material';
import DialogBoxCandidateInfo from '../../common/DialogBoxCandidateInfo'
import Search from "../../../assets/search.png"
import Sidebar from '../jobs/Sidebar';
import TalentPool from '../../../assets/talentPool.png'
import toast from '../../common/Toast';

//creating this array to populate the data in the table
const columns = [
  {
    Header: "Candidate Name",
    datakey: "candidateName",
    style: {
      width: "25%",
    },
  },
  {
    Header: "Job Title",
    datakey: "jobTitle",
    style: {
      width: "25%",
    },
  },
  {
    Header: "Resume",
    datakey: "resume",
    type: "doc",
    style: {
      width: "25%",
    },
  },
  {
    Header: "Action",
    datakey: "action",
    type: "action",
    style: {
      width: "25%",
      display: 'flex',
      justifyContent: 'center',
    },
  },
];


function Applicants() {

  const userData = useSelector((state) => state.login);
  const [applicants, setApplicants] = useState(null);
  const [dialogBox, setDialogBox] = useState(false);
  const [candidateInfo, setCandidateInfo] = useState(null);
  const [filteredApplicants, setFliteredApplicants] = useState(applicants || [])
  const [selectedJob, setSelectedJob] = useState(null);
  const [allJobs, setAllJobs] = useState(null);
  const [isJobPost, setIsJobPost] = useState(false);

//get all the job applications submited by candidates from the database
  const fetchAllApplicants = async () => {
    // fetch all applicants from firebase
    const q = query(
      collection(db, "applications"),
      where("employerId", "==", userData.user.email)
    );
    onSnapshot(q, (querySnapshot) => {
      let applicationData = [];
      querySnapshot.forEach((doc) => {
        applicationData.push(doc.data());
      });
      setApplicants(applicationData);
      setFliteredApplicants(applicationData);
      // console.log(applicationData);
    });
  };

 //fetch all the posted jobs by this employer/person cause we are also adding search and filter/sort 
 //functionality for both the jobs and applications 
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
    fetchAllApplicants();
    fetchAllJobs();
  }, []);


//if employer clicks of applicants profile he will be able to see the applicants details in a dialog box
  const handleProfile = (data) => {
    setCandidateInfo(data);
    setDialogBox(true);
  }
//just to add filter func
  const handleSearchInput = (e) => {
    const searchTerm = e.target.value?.toLowerCase()?.trim();
    const result = filterJobs(searchTerm);
    setFliteredApplicants(result);
  };

  const filterJobs = (searchTerm) => {
    return applicants?.filter((job) =>
      job.candidateName.toLowerCase().includes(searchTerm) ||
      job.jobTitle.toLowerCase().includes(searchTerm) ||
      job.status.toLowerCase().includes(searchTerm)
    );
  };

  // useEffect(() => {
  //   setFliteredApplicants(filteredApplicants || []);
  // }, [filteredApplicants]);

//function to handle actions performed by the employer, whether the application gets accepted or declined
  const handleAction = async (type, data) => {
    // console.log(type, data);
    if (type === "accept") {
      try {
        const last_message_id = uuidv4()//primary key
        const conversationKey = uuidv4()//foreign key
        const conversation_id = uuidv4()//primary key

        //1. add a document in last_message collection
        //2 generate a conversation key
        //3. add a document in conversations collection with a specific conversationKey
        //4. update the application status to 'accepted'

        await setDoc(
          doc(db, "last_messages", last_message_id),
          {
            last_message_id,
            last_message: `hey ${data.candidateName}! we have accepted your application for the job ${data.jobTitle}`,
            createdAt: new Date().toISOString(),
            conversationKey,
            employerId: userData.user.email,
            candidateId: data.candidateId,
            candidateName: data.candidateName,
            employerName: data.employerName,
            jobTitle: data.jobTitle,
            candidatePhoto: data.candidatePhoto,
            companyLogo: data.companyLogo
          }
        )
        await setDoc(
          doc(db, "conversations", conversation_id),
          {
            conversation_id,
            conversationKey,
            senderId: userData.user.email,
            message: `hey ${data.candidateName}! we have accepted your application for the job ${data.jobTitle}`,
            createdAt: new Date().toISOString(),
          }
        )
        //we use merge just to update or replace the last message with current message
        await setDoc(
          doc(db, "applications", data.applicationId),
          {
            status: "accepted",
          },
          { merge: true }
        )
        toast("Application accepted", "success");
      }
      catch (err) {
        // console.log(err)
        toast("Something went wrong", "danger");
      }
      // accept the application
    }

    else if (type === "reject") {
      // update the application status with application id
      try {
        await setDoc(doc(db, "applications", data.applicationId), {
          ...data,
          status: 'declined'
        })
        // const doc_ref = doc(db, "applications", data.applicationId);
        // await deleteDoc(doc_ref);
        toast("Application Rejected", "success");
      } catch (err) {
        // console.log(err);
        toast("Something went wrong", "danger");
      }
    }
  };

//these two func are there to handle the css and functionality of current selected job
  const selectedAjob = (job) => {
    setSelectedJob(job)
    const sortByJobId = applicants.filter((apps) => apps.jobId === job.jobId)
    setFliteredApplicants(sortByJobId)
  }

  const resetFilteredApplicants = () => {
    setSelectedJob(null);
    setFliteredApplicants(applicants)
  }


  return (
    <div>
      <Grid container spacing={1}>
        <Grid
          sx={{
            display: { xs: "none", md: "block" },
            background: '#fff'
          }}
          item md={3}>
          <Button onClick={resetFilteredApplicants}>Reset</Button>
          <Sidebar
            selectedJob={selectedJob}
            selectedAjob={selectedAjob}
            allJobs={allJobs}
            isJobPost={isJobPost}
          />
        </Grid>

        <Grid item xs={12} md={9}
         sx={ filteredApplicants && filteredApplicants.length === 0 ?  {backgroundImage:`url("${TalentPool}")`, backgroundRepeat:'no-repeat', backgroundPosition:'center'} : null}
        >
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
            placeholder={"Search Applicants by Candidate Name, Job Title, Applied Status..."}
            size="small"
            onChange={handleSearchInput}
          />

          {applicants && applicants.length === 0 ? (
            <div>No applicants yet</div>
          ) : applicants && applicants.length > 0 ? (
            <div>
              <ApplicantsTable handleAction={handleAction} handleProfile={handleProfile} columns={columns} data={filteredApplicants} />
              {
                dialogBox ? (
                  <Dialog onClose={() => setDialogBox(false)} open={dialogBox} >
                    <img src={candidateInfo.candidatePhoto} alt="displayPicture" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '15px auto' }} />
                    <DialogTitle> {candidateInfo.candidateName} </DialogTitle>
                    <DialogBoxCandidateInfo data={candidateInfo} />
                    <div style={{ margin: '15px auto' }}>
                      <Button size='small' color='secondary' variant="outlined" type="button" onClick={() => setDialogBox(false)} sx={{ marginRight: '9px' }}> Back </Button>
                    </div>
                  </Dialog>
                ) : null
              }
            </div>
          ) : (
            <div>Loading...</div>
          )}
        </Grid>

      </Grid>

    </div>
  )
}

export default Applicants