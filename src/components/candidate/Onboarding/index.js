import React, { useEffect, useState } from "react";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import './onboarding.css'
import SearchDropDown from '../../common/SearchDropDown'
import Dropdown from '../../common/dropdown'
import FileUpload from '../../common/FileUpload'
import { skills, experience, primaryRole } from '../../../content'
import { useDispatch, useSelector } from 'react-redux'
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import { useNavigate } from "react-router-dom";
import { SET_USER_INFO } from "../../../store/reducers/Reducer";
import toast from "../../common/Toast/index";

//have already explained how this code works in Employer Component
//candidate && employer components works the same way, slight data or state changes


function CandidateOnboarding() {

  const userData = useSelector((state) => state.login)

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [error, setError] = useState("")

  const [userInformation, setUserInformation] = useState({
    name: userData?.user?.displayName,
    email: userData?.user?.email,
    phone: "",
    location: "",
    skills: [],
    primaryRole: "",
    linkedIn: "",
    experience: "",
    bio: "",
    resume: "",
  })

  useEffect(()=>{
    if(userData?.userInfo){
      userData?.userInfo?.userType === 'employer' ? navigate('/employer/profile') : navigate('/candidate/profile')
    }
  }, [])


  const handleSkills = (data, type) => {
    if (type === "delete") {
      let new_data = userInformation.skills.filter((skill) => skill !== data);
      setUserInformation({ ...userInformation, skills: new_data });
    } else {
      if (userInformation.skills.find((skill) => skill === data)) {
      } else {
        let new_data = [...userInformation.skills, data];
        setUserInformation({ ...userInformation, skills: new_data });
      }
    }
  };


  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    // console.log(userInformation);
    try {
      // Add a new document in collection "cities"
      await setDoc(doc(db, "users", userData.user.email), {
        ...userInformation,
        userType: "candidate",
      });
      toast("Onboarding Successful", "success")
      dispatch(SET_USER_INFO({...userInformation, userType: 'candidate'}))
      navigate('/candidate/profile')
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
          <h1>ONBOARDING CANDIDATE</h1>
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Name</label>
          <TextField
            required
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.name}
            onChange={(e) =>
              setUserInformation({ ...userInformation, name: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Email</label>
          <TextField
            required={true}
            disabled
            id="outlined-basic"
            variant="outlined"
            fullWidth
            type={"email"}
            size="small"
            value={userInformation.email}
            onChange={(e) =>
              setUserInformation({ ...userInformation, email: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Contact</label>
          <TextField
            required={true}
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            type="number"
            value={userInformation.phone}
            onChange={(e) =>
              setUserInformation({ ...userInformation, phone: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Location</label>
          <TextField
            id="outlined-basic"
            variant="outlined"
            required={true}
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
          <label className="onboarding-label">Primary Role</label>

          <Dropdown
            required={true}
            options={primaryRole}
            onChange={(data) =>
              setUserInformation({ ...userInformation, primaryRole: data })
            }
            value={userInformation.primaryRole}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">LinkedIn/Github/Portfolio URL</label>
          <TextField
            id="outlined-basic"
            variant="outlined"
            required={true}
            fullWidth
            type={"url"}
            size="small"
            value={userInformation.linkedIn}
            onChange={(e) =>
              setUserInformation({
                ...userInformation,
                linkedIn: e.target.value,
              })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Experience</label>
          <Dropdown
            required={true}
            options={experience}
            onChange={(data) =>
              setUserInformation({ ...userInformation, experience: data })
            }
            value={userInformation.experience}
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Bio</label>
          <TextField
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.bio}
            onChange={(e) =>
              setUserInformation({ ...userInformation, bio: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Skills</label>
          <SearchDropDown
            required={true}
            options={skills}
            onChange={(data) => handleSkills(data, "add")}
            values={userInformation.skills}
            onDelete={(data) => handleSkills(data, "delete")}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            required={true}
            title="Resume"
            filetype="doc"
            onUpload={(url) =>
              setUserInformation({ ...userInformation, resume: url })
            }
            value={userInformation.resume}
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
            <Button disabled={userInformation.resume === ""} type="submit">
              Complete Onboarding
            </Button>
          )}
        </Grid>
      </Grid>
    </form>
  );
}

export default CandidateOnboarding;