import { TextField } from "@mui/material";
import React, { useState, useEffect } from "react";
import pfgimg from "../../../assets/pfgimg.png";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../../../firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../../firebaseconfig";
import { useSelector } from "react-redux";


//function to handle file upload by user, files will be stored in firebase storage
function FileUpload({ title, filetype, onUpload, value, disabled }) {
//creating useful states and get redux store data
  const[msg, setMsg] = useState("")
  const[resumeLink, setResumeLink] = useState("")

  const userData = useSelector((state) => state.login)

//fetching user info and updating resume link state
  const fetchData = async () => {
    const docRef = doc(db, "users", userData?.user?.email);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      // console.log("Document data:", docSnap.data());
      setResumeLink(docSnap?.data()?.resume);
    } else {
      // doc.data() will be undefined in this case
      // console.log("No such document!");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);


// handle resume upload 
  const upload = (e) => {
    const file = e.target.files[0];
    // console.log(file);
    const storageRef = ref(storage, `${filetype}/${file.name}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        // console.log("Upload is " + progress + "% done");
        setMsg("Upload is " + progress + "% done")
      },
      (error) => {
        // Handle unsuccessful uploads
        // console.log(error, 'error');
        setMsg("Error: " + error)
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          // console.log("File available at", downloadURL);
          setResumeLink(downloadURL)
          onUpload(downloadURL);
        });
      }
    );
  };



  return (
    <div>
      <div>
        <label className="onboarding-label">{title}</label>

        <TextField
          disabled={disabled}
          id="outlined-basic"
          variant="outlined"
          fullWidth
          inputProps={{ accept: filetype === 'doc' ? "application/pdf" : 'image/*' }}
          size="small"
          type={"file"}
          onChange={(e) => upload(e)}
        />
      </div>
      <div> {msg} </div>
      {filetype === "doc" && value ? (
        <div style={{ margin: "20px" }}>
          <div style={{margin: "20px"}}> <a href={resumeLink}> Click here </a> to see your Resume! </div>
          <img src={pfgimg} width="100px" alt="pfgimg" />
        </div>
      ) : filetype === "image" && value ? (
        <div style={{ margin: "20px" }}>
          <img src={value} width="100px" alt="logo" />
        </div>
      ) : null}
    </div>
  );
}

export default FileUpload;