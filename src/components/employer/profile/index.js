import React, { useState, useEffect } from "react";
import { Button, CircularProgress, Grid, TextField } from "@mui/material";
import "./profile.css";
import Dropdown from "../../common/dropdown";
import FileUpload from "../../common/FileUpload";
import { industryType, companySize } from "../../../content";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import toast from "../../common/Toast/index";
import { useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import FormLoading from "../../common/Loading/FormLoading";
import { LOGOUT, SET_USER_INFO } from '../../../store/reducers/Reducer';


function EmployerProfile() {
//get data from redux store
  const userData = useSelector((state) => state.login)
  const navigate = useNavigate();
  const dispatch = useDispatch()
//states to handle data visibility
  const [loading, setLoading] = useState(false);
  const [screenLoading, setScreenLoading] = useState(true);
  const [isEdit, setIsEdit] = useState(false);
//state to store user info
  const [userInformation, setUserInformation] = useState({
    name: userData.user.displayName,
    employer_email: userData.user.email,
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

//fetching user data from database using getDoc method
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
      //this means we are going back to previous screen/component and we use navigate(1) to forward
      navigate(-1)
      setScreenLoading(false);
    }
  };
//tringgering func on first load
  useEffect(() => {
    fetchData();
    if(userData?.userInfo?.userType === 'candidate'){
      navigate('/candidate/profile')
    }
  }, []);

//func to handle form submit, storing info in users database using setDoc method
  const submit = async (e) => {
    setLoading(true);
    e.preventDefault();
    // console.log(userInformation);
    try {
      // Add a new document in collection "users"
      await setDoc(doc(db, "users", userData.user.email), {
        ...userInformation,
        userType: "employer",
      });
      toast("data updated sucessfully", "success");
      setLoading(false);
    } catch (e) {
      // console.log(e);
      toast("Failed", "danger")
      setLoading(false);
    }
    setIsEdit(false);
  };

//logout func, LOGOUT() is a action, getting it from the reducers  
  const logout = () => {
    dispatch(LOGOUT())
    navigate('/')
  }


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
          <label className="onboarding-label"> Company Name</label>
          <TextField
            required
            disabled={!isEdit}
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
          <label className="onboarding-label">Contact</label>
          <TextField
            required
            disabled={!isEdit}
            id="outlined-basic"
            variant="outlined"
            type={'number'}
            fullWidth
            size="small"
            value={userInformation.phone}
            onChange={(e) =>
              setUserInformation({ ...userInformation, phone: e.target.value })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Industry Type</label>

          <Dropdown
            disabled={!isEdit}
            required={true}
            options={industryType}
            value={userInformation.industry_type}
            onChange={(data) =>
              setUserInformation({ ...userInformation, industry_type: data })
            }
          />
        </Grid>
        <Grid item xs={12} md={6}>
          <label className="onboarding-label">Company Size</label>

          <Dropdown
            disabled={!isEdit}
            required={true}
            options={companySize}
            onChange={(data) =>
              setUserInformation({ ...userInformation, company_size: data })
            }
            value={userInformation.company_size}
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
            disabled={!isEdit}
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
          <label className="onboarding-label"> Your Role</label>
          <TextField
            required
            disabled={!isEdit}
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
          <label className="onboarding-label">Website</label>
          <TextField
            disabled={!isEdit}
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
            disabled={!isEdit}
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
            disabled={!isEdit}
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
            disabled={!isEdit}
            required={true}
            title="Company Logo"
            filetype="image"
            onUpload={(url) =>
              setUserInformation({ ...userInformation, company_logo: url })
            }
            value={userInformation.company_logo}
          />
        </Grid>

      </Grid>
    </form>
  );
}

export default EmployerProfile