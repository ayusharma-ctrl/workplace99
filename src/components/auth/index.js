import React, { useState, useEffect } from "react";
import btnIcon from "../../assets/btn.png";
import "./auth.css";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../../firebaseconfig";
import { useNavigate } from "react-router-dom";
import { LOGIN, SET_USER_INFO } from '../../store/reducers/Reducer'
import { useSelector, useDispatch } from 'react-redux'
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseconfig/index";
import SVG from '../../assets/svg.png'
import SVG2 from '../../assets/svg2.png'
import toast from '../common/Toast/index'

//get usertype as a prop from Nav component
function Auth({ usertype }) {
//get redux store data
  const userData = useSelector((state) => state.login)
  const dispatch = useDispatch()
//seeting up signing with google authentication
  const provider = new GoogleAuthProvider();

  const navigate = useNavigate();
//some useful states to handle features
  // const [exist, setExist] = useState(false);
  // const [type, setType] = useState("");
  const [error, setError] = useState("");

//fetching user's google account info after signing with google account
  const fetchData = async (email) => {
    const docRef = doc(db, "users", email);
    const docSnap = await getDoc(docRef);

//if user exists, then redirect 
    if (docSnap.exists()) {
      // dispatch(SET_USER_INFO(docSnap.data()))
      // setExist(true)
      // setType(docSnap.data().userType)
      // console.log("Document data:", docSnap.data());
      // setUserInformation(docSnap.data());
      // setScreenLoading(false);
      redirectUser(docSnap.data().userType, true,docSnap)
    } else {
      // doc.data() will be undefined in this case
      redirectUser(docSnap.data().userType, false,docSnap)
      // console.log("No such document!");
    }
  };

//storing userdata in localStorage only if user has completed onboard process and if we don't have that data, then redirect to onboard
  useEffect(() => {
    if (userData?.userInfo) {
      userData.userInfo.userType === 'candidate' ? navigate('/candidate/profile') : navigate('/employer/profile')
    }

    if (userData?.user && !userData?.userInfo) {
      usertype === 'Candidate' ? navigate('/candidate/onboarding') : navigate('/employer/onboarding')
    }

  }, [])

  // useEffect(() => {
  //   if (type) {
  //     redirectUser();
  //   }
  // }, [type]);

  useEffect(() => {
    setError("")
  }, [usertype])

//hanldes if user exist or not, if yes then update the redux store and based on various validations redirect 
  const redirectUser = (type,exist,docSnap) => {
    // if usertype is Candidate
    if (usertype === "Candidate") {
      // if user exists in database
      if (exist) {
        // check the user type in the database for this user, if in the database the user type is candidate // redirect to candidate profile
        if (type === 'candidate') {
          setError("")
          dispatch(SET_USER_INFO(docSnap.data()))
          toast("Login Success", "success")
          navigate("/candidate/profile");
        }// else show error message this id is already registered as employer
        else {
          setError("This user is already registered as employer. Please login as an employer!!!");
          return;
        }
      }// if user does not exist in database
      else {
        setError("")
        toast("Complete Onboarding", "warning")
        navigate("/candidate/onboarding");
      }
    }
    else {
      // if user exists in database
      if (exist) {
        // check the user type in the database for this user, if in the database the user type is employer // redirect to employer profile
        if (type === 'employer') {
          setError("")
          dispatch(SET_USER_INFO(docSnap.data()))
          toast("Login Success", "success")
          navigate("/employer/profile");
        }//else show error message this id is already registered as candidate
        else {
          setError("This user is already registered as candidate. Please login as a Candidate!!!");
          return;
        }
      }// if user does not exist in database
      else {
        setError("")
        toast("Complete Onboarding", "warning")
        navigate("/employer/onboarding");
      }
    }
  };

//this is how we use google authentication for sign-in using firebase
//this 'auth' is coming from firebaseconfig
  const signIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        // This gives you a Google Access Token. You can use it to access the Google API.
        const { user } = result;
        const { email, displayName, photoURL } = user;
        // console.log(email, displayName, photoURL, "user");
        dispatch(LOGIN({ email: email, displayName: displayName, photoURL: photoURL }))
        fetchData(email);
      })
      .catch((error) => {
        // Handle Errors here.
        // console.log(error, "error");
        toast("Error", "error")
      });
  };



  return (
    <div
    style={{
      backgroundImage: `url(${SVG2})`,
      backgroundRepeat: 'no-repeat',
      backgroundPosition: 'top',
      // backgroundColor: 'midnightblue'
    }}
    >
      <div className="auth-container"
        style={{
          backgroundImage: `url(${SVG})`,
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right bottom',
        }}
      >
        <div>
          <h1>Welcome {usertype}!!</h1>
          <h3>Please Sign IN</h3>

          <div>
            <button onClick={signIn}>
              <img src={btnIcon} alt="btn" />
            </button>
          </div>
          <div style={{ marginTop: '20px', color: 'red', fontWeight: '400' }}>{error}</div>
        </div>

      </div>
    </div>
  );
}

export default Auth;
