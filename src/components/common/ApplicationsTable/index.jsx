import React, { useState } from 'react'
import './applicationsTable.css'
import moment from "moment";
import Accepted from './../../../assets/accept.png'
import Declined from './../../../assets/decline.png'
import VisibilityIcon from '@mui/icons-material/Visibility';
import DialogBox from '../DialogBox';
import { Button, Dialog, DialogTitle } from '@mui/material';
import { Link } from 'react-router-dom';

//this table will be visible for candidates
const ApplicationsTable = ({ columns, data }) => {

    const [dialogBox, setDialogBox] = useState(false)
    const [jobData, setJobData] = useState(null)

    const viewJobDetails = (data) => {
        setJobData(data);
        setDialogBox(true);
    }

    return (
        <div>
            <div>
                {
                    dialogBox ? (
                        <Dialog onClose={() => setDialogBox(false)} open={dialogBox} >
                            <img src={jobData.companyLogo} alt="displayPicture" style={{ width: '80px', height: '80px', borderRadius: '50%', margin: '15px auto' }} />
                            <DialogTitle> <Link to={jobData.companyWebsite} target="_blank" > {jobData.employerName} </Link>  </DialogTitle>
                            <DialogBox data={jobData} />
                            <div style={{ margin: '15px auto' }}>
                                <Button size='small' color='secondary' variant="outlined" type="button" onClick={() => setDialogBox(false)} sx={{ marginRight: '9px' }}> Back </Button>
                            </div>
                        </Dialog>
                    ) : null
                }
            </div>
            <div className="table-header">
                {columns.map((column, index) => {
                    return <div key={index} style={column.style}>{column.Header}</div>;
                })}
            </div>
            <div>
                {data.map((row) => {
                    return (
                        <div key={row.applicationId} className="table-row">
                            {columns.map((column, index) => {
                                if (column.type === "date") {
                                    return (
                                        <div key={index} style={column.style}>
                                            {moment(row[column.datakey]).format('ll')}
                                        </div>
                                    );
                                }

                                else if (column.datakey === "status") {
                                    return (
                                        <div key={index} style={column.style}>
                                            {row.status === 'applied' ? <span> Applied </span> :
                                                row.status === 'accepted' ? <img src={Accepted} alt="accepted" style={{ height: "30px" }} /> : <img src={Declined} alt="declined" style={{ height: "30px" }} />
                                            }
                                            <VisibilityIcon onClick={() => viewJobDetails(row)} sx={{ marginLeft: '5px', cursor: 'pointer' }} />
                                        </div>
                                    );
                                }
                                return <div key={column.datakey} style={column.style}>{row[column.datakey]}</div>;
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default ApplicationsTable