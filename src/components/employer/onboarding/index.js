import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import "./onboarding.css";
import Dropdown from "../../common/dropdown";
import FileUpload from "../../common/FileUpload";
import {  industryType, companySize } from "../../../content";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import toast from "../../common/Toast/index";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SET_USER_INFO } from "../../../store/reducers/Reducer";

function EmployerOnboarding() {
//get data from redux store and initialize imp states to handle functionalities
const userData = useSelector((state) => state.login)
const [loading, setLoading] = useState(false);
const [error, setError] = useState("")
const dispatch = useDispatch()
const navigate=useNavigate();

//this state is to store form data
  const [userInformation, setUserInformation] = React.useState({
    name: userData?.user?.displayName,
    employer_email: userData?.user?.email,
    phone: "",
    location: "",
    industry_type: "",
    company_size: "",
    role: "",
    website: "",
    company_name: "",
    company_tag: "",
    company_bio: "",
    company_logo: "",
  });

//checking if we aleady have user data or not, if yes then redirect to profile page
  useEffect(()=>{
    if(userData?.userInfo){
      userData?.userInfo?.userType === 'employer' ? navigate('/employer/profile') : navigate('/candidate/profile')
    }
  }, [])

//handle form submit action
  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // console.log(userInformation);
    try {
      // Add a new document in collection "cities"
      await setDoc(doc(db, "users", userData.user.email), {
        ...userInformation,
        userType: "employer",
      });
      toast("Onboarding Successful", "success")
      dispatch(SET_USER_INFO({...userInformation, userType: 'employer'}))
      navigate('/employer/profile')
      setLoading(false);
    } catch (e) {
      // console.log(e);
      toast("Onboarding Failed", "danger")
      setError(e)
      setLoading(false);
    }
  };


  return (
    <form onSubmit={(e) => submit(e)}>
      <Grid container spacing={2} className="onboarding-container">
        <Grid item xs={12}>
          <h1>ONBOARDING EMPLOYER</h1>
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label"> Company Name</label>
          <TextField
            required
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.company_name}
            onChange={(e) =>
              setUserInformation({
                ...userInformation,
                company_name: e.target.value,
              })
            }
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Industry Type</label>

          <Dropdown
            required={true}
            options={industryType}
            onChange={(data) =>
              setUserInformation({ ...userInformation, industry_type: data })
            }
            value={userInformation.industry_type}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Company Size</label>

          <Dropdown
            required={true}
            options={companySize}
            onChange={(data) =>
              setUserInformation({ ...userInformation, company_size: data })
            }
            value={userInformation.company_size}
          />
        </Grid>

        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Contact</label>
          <TextField
            required
            type='number'
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.phone}
            onChange={(e) =>
              setUserInformation({ ...userInformation, phone: e.target.value })
            }
          />
        </Grid>
        
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Email</label>
          <TextField
            required
            disabled
            id="outlined-basic"
            variant="outlined"
            fullWidth
            type={"email"}
            size="small"
            value={userInformation.employer_email}
            onChange={(e) =>
              setUserInformation({
                ...userInformation,
                employer_email: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label"> Name</label>
          <TextField
            required
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.name}
            onChange={(e) =>
              setUserInformation({
                ...userInformation,
                name: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label"> Role</label>
          <TextField
            required
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.role}
            onChange={(e) =>
              setUserInformation({
                ...userInformation,
                role: e.target.value,
              })
            }
          />
        </Grid>
  <Grid item xs={12} md={6}>
          <label className="onboarding-label">Location</label>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.location}
            onChange={(e) =>
              setUserInformation({
                ...userInformation,
                location: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Website</label>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            type={"url"}
            size="small"
            value={userInformation.website}
            onChange={(e) =>
              setUserInformation({
                ...userInformation,
                website: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">
          Company Tagline
          </label>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.company_tag}
            onChange={(e) =>
              setUserInformation({ ...userInformation, company_tag: e.target.value })
            }
          />
        </Grid>
      
        <Grid item xs={12} >
          <label className="onboarding-label">Bio</label>
          <TextField
            multiline
            minRows={4}
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.company_bio}
            onChange={(e) =>
              setUserInformation({ ...userInformation, company_bio: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required={true}
            title="Company Logo"
            filetype="image"
            onUpload={(url) =>
              setUserInformation({ ...userInformation, company_logo: url })
            }
            value={userInformation.company_logo}
          />
        </Grid>
        <Grid item xs={12}>
          <div style={{color:'red'}}> {error} </div>
        </Grid>

        <Grid item xs={12} className="submit-btn">
          {loading ? (
            <button
            type="button"
            >
            <CircularProgress />
            </button>
          ) : (
            <Button disabled={userInformation.company_logo === ""} type="submit">
              Complete Onboarding
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default EmployerOnboarding;