import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import "../../employer/profile/profile.css";
import Dropdown from "../../common/dropdown";
import SearchDropDown from '../../common/SearchDropDown'
import FileUpload from "../../common/FileUpload";
import { skills, experience, primaryRole } from "../../../content";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import toast from "../../common/Toast/index";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FormLoading from "../../common/Loading/FormLoading";
import { LOGOUT, SET_USER_INFO } from '../../../store/reducers/Reducer';

//have already explained how this code works in Employer Component
//candidate && employer components works the same way, slight data or state changes

function CandidateProfile() {
  const userData = useSelector((state) => state.login)
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
  const [error, setError] = useState("")

  const [userInformation, setUserInformation] = React.useState({
    name: userData.user.displayName,
    email: userData.user.email,
    phone: "",
    location: "",
    skills: [], //
    primaryRole: "",
    linkedIn: "",
    experience: "",
    bio: "",
    resume: "",
  });

  const fetchData = async () => {
    const docRef = doc(db, "users", userData.user.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setUserInformation(docSnap.data());
      dispatch(SET_USER_INFO(docSnap.data()))
      setScreenLoading(false);
    } else {
      // doc.data() will be undefined in this case
      navigate(-1)
      setScreenLoading(false);
    }
  };

  useEffect(() => {
    
    fetchData();

    if(userData?.userInfo?.userType === 'employer'){
      navigate('/employer/profile')
    }

  }, []);


  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // console.log(userInformation);
    try {
      // Add a new document in collection "cities"
      await setDoc(doc(db, "users", userData?.user?.email), {
        ...userInformation,
        userType: "candidate",
      });
      toast("data updated sucessfully", "success");
      setLoading(false);
    } catch (e) {
      console.log(e);
      toast("Failed", "danger")
      setError(e)
      setLoading(false);
    }
    setIsEdit(false);
  };

  const logout = () => {
    dispatch(LOGOUT())
    navigate('/')
  }


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


  return screenLoading ? (
    <FormLoading
      fields={10}
      height={100}

    />
  ) : (
    <form onSubmit={(e) => submit(e)}>
      <Grid container spacing={2} className="onboarding-container">
      <Grid item xs={12}>
          <h1>P R O F I L E</h1>
        </Grid>
        <Grid item xs={12} className="submit-btn-employer">
          <div>
            {loading ? (
              <button type="button">
                <CircularProgress />
              </button>
            ) : (
              <div>
                {isEdit ? (
                  <div style={{ display: "flex" }}>
                    <Button
                      style={{
                        backgroundColor: "red",
                        marginRight: "10px",
                      }}
                      onClick={() => {
                        setIsEdit(false);
                        fetchData();
                      }}
                      type="button"
                    >
                      Cancel
                    </Button>

                    <Button type="submit">Save</Button>
                  </div>
                ) : (
                  <Button
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
          </div>
          <Button type="button" onClick={logout}>Logout</Button>
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Name</label>
          <TextField
            disabled={!isEdit}
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
            required
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
            disabled={!isEdit}
            required
            id="outlined-basic"
            variant="outlined"
            type='number'
            fullWidth
            size="small"
            value={userInformation.phone}
            onChange={(e) =>
              setUserInformation({ ...userInformation, phone: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Location</label>
          <TextField
            disabled={!isEdit}
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
          <label className="onboarding-label">Primary Role</label>
          <Dropdown
            disabled={!isEdit}
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
            disabled={!isEdit}
            id="outlined-basic"
            variant="outlined"
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
            disabled={!isEdit}
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
            disabled={!isEdit}
            id="outlined-basic"
            variant="outlined"
            fullWidth
            size="small"
            value={userInformation.bio}
            placeholder='Write about yourself'
            onChange={(e) =>
              setUserInformation({ ...userInformation, bio: e.target.value })
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
            values={userInformation.skills}
            onDelete={(data) => handleSkills(data, "delete")}
          />
        </Grid>
        <Grid item xs={12}>
          <FileUpload
            disabled={!isEdit}
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
      </Grid>
    </form>
  );
}

export default CandidateProfile