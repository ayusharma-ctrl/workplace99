import { collection, getDocs, query, where } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { db } from "../../../firebaseconfig";
import ApplicationsTable from "../../common/ApplicationsTable";
import Search from "../../../assets/search.png"
import { TextField } from "@mui/material";

//have already explained how this code works in Employer Component
//candidate && employer components works the same way, slight data or state changes


const columns = [
  {
    Header: "Company",
    datakey: "employerName",
    style: {
      width: "25%"
    }
  },
  {
    Header: "Job Title",
    datakey: "jobTitle",
    style: {
      width: "25%"
    }
  },
  {
    Header: "Applied On",
    datakey: "createdAt",
    type: "date",
    style: {
      width: "25%"
    }
  },
  {
    Header: "Status",
    datakey: "status",
    style: {
      width: "25%",
      display: 'flex',
      justifyContent: 'space-evenly',
      alignItems: 'center',
    }
  }
];

function Applications() {
  const userData = useSelector((state) => state.login)
  const [applications, setApplications] = useState(null);
  const [filteredApplications, setFliteredApplications] = useState(applications || [])


  const fetchAllApplications = async () => {
    try {
      const q = query(
        collection(db, "applications"),
        where("candidateId", "==", userData.user.email)
      );
      const data = await getDocs(q);
      let apps = [];
      data.forEach((doc) => {
        apps.push(doc.data());
      });
      setApplications(apps);
      setFliteredApplications(apps)
      // console.log(apps);
    }
    catch (err) {
      // console.log(err)
      setApplications([])
    }
  };


  useEffect(() => {
    fetchAllApplications()
  }, []);


  const handleSearchInput = (e) => {
    const searchTerm = e.target.value?.toLowerCase()?.trim();
    const result = filterJobs(searchTerm);
    setFliteredApplications(result);
  };

  const filterJobs = (searchTerm) => {
    return applications?.filter((job) =>
      job.employerName.toLowerCase().includes(searchTerm) ||
      job.jobTitle.toLowerCase().includes(searchTerm) ||
      job.status.toLowerCase().includes(searchTerm)
    );
  };


  return (
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
        placeholder={"Search Applications by Company Name, Job Title, Job status..."}
        size="small"
        onChange={handleSearchInput}
      />
      {applications && applications.length === 0 ? (
        <div>No applications found</div>
      ) : applications && applications.length > 0 ? (
        <div>
          <ApplicationsTable columns={columns} data={filteredApplications} />
        </div>
      ) : (
        <div>Loading...</div>
      )}
    </div>
  )

}

export default Applications;