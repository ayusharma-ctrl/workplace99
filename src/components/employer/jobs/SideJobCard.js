import React from "react";

function SideJobCard({ data, selectedJob, selectedAjob }) {
  //destructure props
  const { jobTitle, jobLocation, createdAt, jobType, jobId } = data;

  return (
    <div
      onClick={()=>selectedAjob(data)}
    >
      <div
        className={`sideJobCard ${
          selectedJob && selectedJob.jobId === jobId && "sideJobCard-slected"
        }`}
      >
        <h6>{createdAt}</h6>
        <h1>{jobTitle}</h1>
        <h2>{jobLocation}</h2>
        <p>{jobType}</p>
      </div>
    </div>
  );
}

export default SideJobCard;
