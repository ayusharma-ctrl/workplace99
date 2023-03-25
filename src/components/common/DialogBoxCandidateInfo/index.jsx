import React from 'react'
import { Link } from 'react-router-dom';
import './dialog.css'

const DialogBoxCandidateInfo = ({ data }) => {

    return (
        <div className='container'>
            <div>
                <span>Primary Role:</span>   {data.candidatePrimaryRole}
            </div>
            <div>
                <span>Experience:</span>   {data.candidateExperience}
            </div>
            <div>
                <span>Email:</span>   {data.candidateId}
            </div>
            <div>
                <span>Contact:</span>  {data.candidatePhone}
            </div>
            <div>
                <span>Bio:</span>  {data.candidateBio}
            </div>
            <div>
                <span>Skills:</span>  {data.candidateSkills}
            </div>
            <div>
                <span>LinkedIn:</span> <Link to={data.linkedIn} target='_blank'>  {data.linkedIn} </Link>
            </div>
            <div>
                <span>Resume:</span> <Link to={data.resume} target='_blank'>  Click Here </Link>
            </div>
        </div>
    )
}

export default DialogBoxCandidateInfo;