import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Dialog, DialogTitle, Grid, TextField } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import Dropdown from "../../common/dropdown";
import { jobType, yearsOfExperience, salaryCurrency, skills } from "../../../content";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import toast from "../../common/Toast";
import SearchDropDown from "../../common/SearchDropDown";
import { v4 as uuiv4 } from "uuid";
import { useSelector } from "react-redux";
import Block from '../../../assets/Block.png'


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


function FormEdit({ setEditInMobile, selectedJob, allJobs, setSelectedJob }) {

    const userData = useSelector((state) => state.login)
    const [loading, setLoading] = useState(false);
    const [jobData, setJobData] = useState({ ...initalState, });
    const [isEdit, setIsEdit] = useState(false);
    const [dialogBox, setDialogBox] = useState(false)

//if no job is selected then form should be empty, else it should populate the right data respectively
    useEffect(() => {
        if (selectedJob) {
            setIsEdit(false)
            setJobData({ ...selectedJob });
        } else {
            setJobData({
                ...initalState,
            });
        }
    }, [selectedJob]);

//handling deleting a job from the database
    const deleteJob = async () => {
        const jobID = selectedJob.jobId;
        setLoading(true);
        const updatedJobs = allJobs.map((e) => e.jobId !== jobID)

        try {
            await setDoc(doc(db, "jobs", jobID), {
                ...updatedJobs,
            });
            setLoading(false);
            setDialogBox(false)
            setEditInMobile(false);
            toast("Job Deleted", "success")

        } catch (err) {
            // console.log(err);
            toast("Something went wrong", "danger");
            setLoading(false);
        }

    }

//handling skills row, these skills have to be selected by a user
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

//handle form submit and update the fields of that job and adding a current time
    const submit = async (e) => {
        e.preventDefault();
        // console.log(jobData);
        const jobId = selectedJob ? selectedJob.jobId : uuiv4();
        // post this data to firebase in jobs collection
        setLoading(true);
        try {
            await setDoc(doc(db, "jobs", jobId), {
                ...jobData,
                createdAt: new Date().toISOString().slice(0, 10),
                // employerName: userData.userInfo.company_name,
                // companySize: userData.userInfo.company_size,
                // companyWebsite: userData.userInfo.website,
                // companyTag: userData.userInfo.company_tag,
            });
            if (selectedJob) {
                toast("Job updated successfully", "success");
            }
            else {
                toast("Job posted successfully", "success");
            }
            setLoading(false);
            setEditInMobile(false);

        } catch (err) {
            // console.log(err);
            toast("Something went wrong", "danger");
            setLoading(false);
        }
    };


    return (
        <div>
            <Button
                onClick={() => {
                    setEditInMobile(false) 
                    setSelectedJob(null)
                }}
                variant="outlined"
                size='small'
                sx={{
                    margin: '10px auto 10px 20px',
                    float: "left"
                }}
            >
                Back
            </Button>

            {loading ? (
                <button type="button">
                    <CircularProgress />
                </button>
            ) : (<Button
                onClick={() => setDialogBox(true)}
                color='error'
                variant="contained"
                size='small'
                startIcon={<DeleteIcon />}
                sx={{
                    margin: '10px 20px 10px auto',
                    float: "right",
                }}
            >
                Inactive Job
            </Button>)
            }

            <form onSubmit={(e) => submit(e)}>
                <Grid container spacing={2} className="jobfrom-container">

                    <Grid item xs={12} md={6}>
                        <label className="form-label"> Job Title</label>
                        <TextField
                            required
                            disabled={!isEdit}
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
                            disabled={!isEdit}
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
                            disabled={!isEdit}
                            required={true}
                            options={jobType}
                            onChange={(data) => setJobData({ ...jobData, jobType: data })}
                            value={jobData.jobType}
                        />
                    </Grid>

                    <Grid item xs={12} md={6}>
                        <label className="form-label">Years Of Experience</label>
                        <Dropdown
                            disabled={!isEdit}
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
                                    disabled={!isEdit}
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
                                    disabled={!isEdit}
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
                                    disabled={!isEdit}
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
                            disabled={!isEdit}
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
                            disabled={!isEdit}
                            required={true}
                            options={skills}
                            onChange={(data) => handleSkills(data, "add")}
                            values={jobData.skills}
                            onDelete={(data) => handleSkills(data, "delete")}
                        />
                    </Grid>

                    <Grid item xs={12} >
                        {loading ? (
                            <button type="button">
                                <CircularProgress />
                            </button>
                        ) : (<div>
                            {isEdit ? (
                                <div style={{ display: "flex", justifyContent: 'center' }}>
                                    <Button
                                        size='small'
                                        color='error'
                                        variant="contained"
                                        style={{
                                            marginRight: "10px",
                                        }}
                                        onClick={() => {
                                            setIsEdit(false);
                                            // fetchData();
                                        }}
                                        type="button"
                                    >
                                        Cancel
                                    </Button>

                                    <Button size="small" variant="contained" color='success' type="submit" >Save</Button>
                                </div>
                            ) : (
                                <Button
                                    size='small'
                                    color='error'
                                    variant="contained"
                                    onClick={() => {
                                        setIsEdit(true);
                                    }}
                                    type="button"
                                >
                                    Edit
                                </Button>
                            )}
                        </div>
                        )}
                    </Grid>

                    <Grid item xs={12}>
                        {
                            dialogBox ? (
                                <Dialog onClose={() => setDialogBox(false)} open={dialogBox} >
                                    <img src={Block} alt="block" style={{ width: '25px', height: '25px', margin: '15px auto' }} />
                                    <DialogTitle>Do you really want to inactive this job? </DialogTitle>
                                    <div style={{ margin: '15px auto' }}>
                                        <Button size='small' color='secondary' variant="outlined" type="button" onClick={() => setDialogBox(false)} sx={{ marginRight: '9px' }}> No </Button>
                                        {loading ? (
                                            <button type="button">
                                                <CircularProgress />
                                            </button>
                                        ) : (
                                            <Button size='small' color='error' variant="contained" onClick={() => deleteJob()} type="button"> Yes </Button>)}
                                    </div>

                                </Dialog>

                            ) : null
                        }
                    </Grid>

                </Grid>
            </form>
        </div>
    );
}

export default FormEdit;
