import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import Dropdown from "../../common/dropdown";
import { jobType, yearsOfExperience, salaryCurrency, skills } from "../../../content";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import toast from "../../common/Toast";
import SearchDropDown from "../../common/SearchDropDown";
import { v4 as uuiv4 } from "uuid";
import { useSelector } from "react-redux";


const initalState = {
  jobType: "", //
  jobLocation: "", //
  jobTitle: "", //
  yearsOfExperience: "", //
  salary: {
    min: "",
    max: "",
    currency: "",
  },
  jobDescription: "",
  skills: [],
};


function Form({ setShowFormInMobile, selectedJob }) {

  const userData = useSelector((state) => state.login)
  const [loading, setLoading] = useState(false);
  const [jobData, setJobData] = useState({ ...initalState, });

//if no job is selected then form should be empty, else it should populate the right data respectively
  useEffect(() => {
    if (selectedJob) {
      setJobData({ ...selectedJob });
    } else {
      setJobData({
        ...initalState,
      });
    }
  }, [selectedJob]);


//handle skills row
  const handleSkills = (data, type) => {
    if (type === "delete") {
      let new_data = jobData.skills.filter((skill) => skill !== data);
      setJobData({ ...jobData, skills: new_data });
    } else {
      if (jobData.skills.find((skill) => skill === data)) {
      } else {
        let new_data = [...jobData.skills, data];
        setJobData({ ...jobData, skills: new_data });
      }
    }
  };

//handle job data form submit.. add the data to jobs in firebase
  const submit = async (e) => {
    e.preventDefault();
    // console.log(jobData);
    const jobId = selectedJob ? selectedJob.jobId : uuiv4();
    // post this data to firebase in jobs collection
    setLoading(true);
    try {
      await setDoc(doc(db, "jobs", jobId), {
        ...jobData,
        jobId,
        createdAt: new Date().toISOString().slice(0,10),
        employerId: userData.user.email,
        employerName: userData.userInfo.company_name,
        companyLogo: userData.userInfo.company_logo,
        companyBio: userData.userInfo.company_bio,
        companySize: userData.userInfo.company_size,
        companyWebsite: userData.userInfo.website,
        companyTag: userData.userInfo.company_tag,
      });
      if (selectedJob) {
        toast("Job updated successfully", "success");
      }
      else {
        toast("Job posted successfully", "success");
      }
      setLoading(false);
      setShowFormInMobile(false);
      setJobData({...initalState,})

    } catch (err) {
      // console.log(err);
      toast("Something went wrong", "danger");
      setLoading(false);
    }
  };


  return (
    <div>
      <Button
        onClick={() => setShowFormInMobile(false)}
        sx={{
          marginTop: '10px',
          marginLeft: '15px',
          float: "left"
        }}
      >
        Back
      </Button>
      <span style={{marginTop:"15px", marginRight: "20px", float:'right', fontWeight:'500'}}> New Job Posting </span>
      <form onSubmit={(e) => submit(e)}>
        <Grid container spacing={2} className="jobfrom-container">

          <Grid item xs={12} md={6}>
            <label className="form-label"> Job Title</label>
            <TextField
              required
              placeholder="Software Engineer"
              id="outlined-basic"
              variant="outlined"
              fullWidth
              size="small"
              value={jobData.jobTitle}
              onChange={(e) =>
                setJobData({
                  ...jobData,
                  jobTitle: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="form-label">Job Location</label>
            <TextField
              required
              placeholder="Mumbai, India"
              id="outlined-basic"
              variant="outlined"
              fullWidth
              size="small"
              value={jobData.jobLocation}
              onChange={(e) =>
                setJobData({
                  ...jobData,
                  jobLocation: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="form-label">Job Type</label>
            <Dropdown
              required={true}
              options={jobType}
              onChange={(data) => setJobData({ ...jobData, jobType: data })}
              value={jobData.jobType}
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="form-label">Years Of Experience</label>
            <Dropdown
              required={true}
              options={yearsOfExperience}
              onChange={(data) =>
                setJobData({ ...jobData, yearsOfExperience: data })
              }
              value={jobData.yearsOfExperience}
            />
          </Grid>

          <Grid item xs={12} md={6}>

            <label className="form-label">Salary</label>
            <Grid container columnSpacing={1}>

              <Grid item xs={4}>
                <Dropdown
                  required={true}
                  options={salaryCurrency}
                  onChange={(data) =>
                    setJobData({
                      ...jobData,
                      salary: {
                        ...jobData.salary,
                        currency: data,
                      },
                    })
                  }
                  value={jobData.salary.currency}
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  required
                  placeholder="Min"
                  id="outlined-basic"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={jobData.salary.min}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      salary: {
                        ...jobData.salary,
                        min: e.target.value,
                      },
                    })
                  }
                />
              </Grid>

              <Grid item xs={4}>
                <TextField
                  required
                  placeholder="Max"
                  id="outlined-basic"
                  variant="outlined"
                  fullWidth
                  size="small"
                  value={jobData.salary.max}
                  onChange={(e) =>
                    setJobData({
                      ...jobData,
                      salary: {
                        ...jobData.salary,
                        max: e.target.value,
                      },
                    })
                  }
                />
              </Grid>

            </Grid>

          </Grid>

          <Grid item xs={12}>
            <label className="form-label">Job Description</label>
            <TextField
              placeholder="Describe the role..."
              required
              multiline
              minRows={4}
              id="outlined-basic"
              variant="outlined"
              fullWidth
              size="small"
              value={jobData.jobDescription}
              onChange={(e) =>
                setJobData({
                  ...jobData,
                  jobDescription: e.target.value,
                })
              }
            />
          </Grid>

          <Grid item xs={12} md={6}>
            <label className="onboarding-label">Skills</label>
            <SearchDropDown
              required={true}
              options={skills}
              onChange={(data) => handleSkills(data, "add")}
              values={jobData.skills}
              onDelete={(data) => handleSkills(data, "delete")}
            />
          </Grid>

          <Grid item xs={12} className="submit-btn">
            {loading ? (
              <button type="button">
                <CircularProgress />
              </button>
            ) : (
              <Button size='small' type="submit">
                Submit
              </Button>
            )}
          </Grid>
        </Grid>
      </form>
    </div>
  );
}

export default Form;
