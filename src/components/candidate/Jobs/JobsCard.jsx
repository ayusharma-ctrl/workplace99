import { Button, Dialog, DialogTitle, Grid } from "@mui/material";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import DialogBox from "../../common/DialogBox";
import "./job.css";
import EmpLogo from './../../../assets/empLogo.png'

//have already explained how this code works in Employer Component
//candidate && employer components works the same way, slight data or state changes

function JobsCard({ job, applyonJob, applications }) {

    const [dialogBox, setDialogBox] = useState(false)
    const [check, setCheck] = useState(false)

    const appliedOrNot = () => {
        applications?.forEach((e) => {
            if (e.jobId === job.jobId && e?.status) {
                setCheck(true)
                return;
            }
        })
    }

    useEffect(()=>{
        appliedOrNot()
    }, [applications])

    return (
        <div className="card-container1">
            <Grid container spacing={1}
                sx={{
                    display: "flex",
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: "center",
                    padding: "10px",
                }}
            >
                <Grid item xs={2}>
                    <img src={job.companyLogo} alt="company logo" width={"55px"} style={{ float: 'left' }} />
                </Grid>

                <Grid className="company-info" item xs={6}>
                    <h2>{job.jobTitle}</h2>
                    <h3>- {job.jobLocation}</h3>
                    <h4>- {job.jobType}</h4>
                </Grid>
                <Grid className="company-info2" item xs={4}
                    sx={{
                        textAlign: 'right'
                    }}>
                    <h4> {`Posted: ${moment(job.createdAt).startOf('day').fromNow()}`} </h4>
                    <h3> {job.employerName}</h3>
                    <h4 style={{display:'flex', alignItems:'center',justifyContent:'flex-end'}}> <img src={EmpLogo} alt="logo" /> {job.companySize} </h4>
                    <h4>{`• ${job.salary.currency} ${job.salary.min} -${job.salary.max}`}</h4>
                </Grid>

            </Grid>


            <Grid className="job-info" container>
                <Grid item xs={4} md={2}>
                    <button onClick={() => setDialogBox(true)} className="details-btn"> Details </button>
                </Grid>
                <Grid item xs={4} md={2}>
                    {check ? <button disabled onClick={() => applyonJob(job)} className="applied-btn"> Applied </button>
                        : <button onClick={() => applyonJob(job)} className="apply-btn"> Apply </button>}
                </Grid>
                <Grid item xs={12}>
                    {
                        dialogBox ? (
                            <Dialog onClose={() => setDialogBox(false)} open={dialogBox} >
                                <img src={job.companyLogo} alt="displayPicture" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '15px auto' }} />
                                <DialogTitle> <Link to={job.companyWebsite} target="_blank" > {job.employerName} </Link>  </DialogTitle>
                                <DialogBox data={job} />
                                <div style={{ margin: '15px auto' }}>
                                    <Button size='small' color='secondary' variant="outlined" type="button" onClick={() => setDialogBox(false)} sx={{ marginRight: '9px' }}> Back </Button>
                                </div>
                            </Dialog>
                        ) : null
                    }
                </Grid>
            </Grid>
        </div>
    );
}

export default JobsCard;