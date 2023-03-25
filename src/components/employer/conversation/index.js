import { Grid } from "@mui/material";
import { collection, doc, onSnapshot, query, setDoc, where, } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "../../../firebaseconfig";
import Lastmessage from "../../common/conversationComponents/Lastmessage";
import MessageArea from "../../common/conversationComponents/MessageArea";
import { v4 as uuidv4 } from "uuid";
import { useSelector } from "react-redux";
import Chat from "../../../assets/chat.png"


function EmployerConversation() {

  const userData = useSelector((state) => state.login);
  const [lastMessages, setLastMessages] = useState(null);
  const [mobileViewLastMessage, setMobileViewLastMessage] = useState(true);
  const [allConversations, setAllConversations] = useState(null);
  const [selectedMessage, setSelectedMessage] = useState(null);

//fetching last message or the latest msg from database
  const fetchLastMessages = async () => {
    const q = query(
      collection(db, "last_messages"),
      where("employerId", "==", userData.user.email)
    );
    onSnapshot(q, (querySnapshot) => {
      let lastMessages = [];
      querySnapshot.forEach((doc) => {
        lastMessages.push(doc.data());
      });
      lastMessages = lastMessages.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      // console.log(lastMessages);
      setLastMessages(lastMessages);
    });
  };


  useEffect(() => {
    fetchLastMessages();
  }, []);


  useEffect(() => {
    if (selectedMessage) {
      fetchAllConversations();
    }
  }, [selectedMessage]);

//fetching all the conversations for this user
  const fetchAllConversations = async () => {
    // call firebase conversation collection where conversationKey is equal to selectedMessage.conversationKey
    const q = query(
      collection(db, "conversations"),
      where("conversationKey", "==", selectedMessage.conversationKey)
    );
    onSnapshot(q, (querySnapshot) => {
      let conversations = [];
      querySnapshot.forEach((doc) => {
        conversations.push(doc.data());
      });
      // console.log(conversations);
      conversations = conversations.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
      setAllConversations(conversations);
    });
  };


  const handleSelectMessage = (data) => {
    setMobileViewLastMessage(false);
    setSelectedMessage(data);
  };

  const handleBackButton = () => {
    setMobileViewLastMessage(true);
    setSelectedMessage(null);
  };
  

  const sendMessage = async (message, setMessage) => {
    // add a doc to conversation collection with conversationKey and message
    // update last_messages collection with last message and last message time
    // set setMessage to ''
    const conversationId = uuidv4();
    await setDoc(doc(db, "conversations", conversationId), {
      conversationKey: selectedMessage.conversationKey,
      message: message,
      senderId: userData.user.email,
      createdAt: new Date().toISOString(),
    });
    await setDoc(
      doc(db, "last_messages", selectedMessage.last_message_id),
      {
        last_message: message,
        createdAt: new Date().toISOString(),
      },
      { merge: true }
    );
    setMessage("");
  };


  return (
    <Grid container>
      <Grid
        sx={{
          display: {
            xs: mobileViewLastMessage ? "block" : "none",
            md: "block",
          },
        }}
        item
        xs={12}
        md={3}
      >
        <Lastmessage
          lastMessages={lastMessages}
          type={"employer"}
          onClick={(data) => handleSelectMessage(data)}
          selectedMessage={selectedMessage}
        />
      </Grid>
      <Grid
        sx={{
          display: {
            xs: !mobileViewLastMessage ? "block" : "none",
            md: "block",
          },
        }}
        item
        xs={12}
        md={9}
      >
        {selectedMessage ? (
          <MessageArea
            handleBackButton={handleBackButton}
            allConversations={allConversations}
            selectedMessage={selectedMessage}
            type={"employer"}
            sendMessage={sendMessage}
          />
        ) : (
          <div style={{marginTop:'20px', height:"80vh", backgroundImage:`url("${Chat}")`, backgroundRepeat:'no-repeat', backgroundPosition:'center'}}></div>
        )}
      </Grid>
    </Grid>
  );
}

export default EmployerConversation;
