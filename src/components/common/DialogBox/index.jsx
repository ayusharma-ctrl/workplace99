import React from 'react'
import './dialog.css'

const DialogBox = ({ data }) => {

    return (
        <div className='container'>
            <div>
                <span>{data.jobTitle}</span>
            </div>
            <div>
                <span>Location:</span>   {data.jobLocation}
            </div>
            <div>
                <span>Job type:</span>  {data.jobType}
            </div>
            <div>
                <span>Experience Required:</span>  {data.yearsOfExperience} years
            </div>
            <div>
                <span>Salary Range:</span>  {`${data.salary.currency} ${data.salary.min} -${data.salary.max}`}
            </div>
            <div>
                <span>About Us:</span>  {data.companyBio}
            </div>
            <div>
                <span>Tagline:</span>  {data.companyTag}
            </div>
            <div>
                <span>Job Description:</span>  {data.jobDescription}
            </div>
            <div>
                <span>Skills:</span>  {data.skills}
            </div>
        </div>
    )
}

export default DialogBox