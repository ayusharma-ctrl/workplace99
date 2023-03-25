import React, { useEffect, useState } from "react";
import { TextField } from "@mui/material";
import SideJobCard from "./SideJobCard";
import Search from "../../../assets/search.png"


function Sidebar({ postAjob, selectedJob, selectedAjob, allJobs, isJobPost }) {

  const [dataJobs, setDataJobs] = useState(allJobs || []);
//update value entered by user in search box
  const handleSearchInput = (e) => {
    const searchTerm = e.target.value?.toLowerCase()?.trim();
    setDataJobs(filterJobs(searchTerm));
  };
//func to filter posted jobs based on search
  const filterJobs = (searchTerm) => {
    return allJobs?.filter((job) =>
      job.jobTitle.toLowerCase().includes(searchTerm) ||
      job.jobType.toLowerCase().includes(searchTerm) ||
      job.jobLocation.toLowerCase().includes(searchTerm)
    );
  };

  useEffect(() => {
    setDataJobs(allJobs || []);
  }, [allJobs]);

  return (
    <div className="sidebar-container">
      {isJobPost ?
        (<div onClick={postAjob} className="postbtn">
          <p>+ Post A Job</p>
          <div>Post your requirements and hire candidates.</div>
        </div>) : null
      }
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
          }}
          placeholder={"Search Jobs"}
          fullWidth
          size="small"
          onChange={handleSearchInput}
        />
      </div>
      <div>
        {dataJobs?.length ? (
          dataJobs.map((job) => (
            <SideJobCard
              selectedJob={selectedJob}
              selectedAjob={selectedAjob}
              key={job.jobId}
              data={job}
            />
          ))
        ) : (
          <div>No Jobs</div>
        )}
      </div>
    </div>
  );
}

export default Sidebar;
