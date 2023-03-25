import { TextField } from "@mui/material";
import React, { useEffect, useRef, useState } from "react";
import "./conversation.css";
import SendIcon from '@mui/icons-material/Send';
import { useSelector } from "react-redux";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import moment from "moment";


function MessageArea({ allConversations, selectedMessage, type, sendMessage, handleBackButton }) {
  const userData = useSelector((state) => state.login);
  const [textmessage, setTextMessage] = useState("");
//handles auto scroll feature in chatbox
  const chatContainerRef = useRef(null);

  useEffect(() => {
    const chatContainer = chatContainerRef.current;
    chatContainer.scrollTop = chatContainer.scrollHeight;
  }, [allConversations]);

//send message on hitting enter key and click of a send button
  const sendMsgEnterKey = (e) => {
    if(e.keyCode === 13){
      sendMessage(textmessage, setTextMessage)
    }
  }

  return (
    <div className="message-area-container">
      <div>
        <div className="message-area-container-header">
          <div>
            <ArrowBackIcon onClick={handleBackButton} sx={{marginLeft:'10px'}} />
            <div style={{ margin: 'auto', display:'flex', alignItems:'center' }}>
              <img 
              src={type === "employer"
                ? selectedMessage?.candidatePhoto
                : selectedMessage?.companyLogo}
              alt="profile"
              style={{borderRadius:'50%', width:'26px', height:'26px', marginRight:'5px' }} />
              {type === "employer"
                ? selectedMessage.candidateName
                : selectedMessage.employerName}
            </div>
            <div style={{ margin: 'auto', fontWeight:'300', fontSize:'clamp(10px,1.7vw,18px)' }}>
              {selectedMessage.jobTitle}
            </div>
          </div>
        </div>

      </div>
      <div ref={chatContainerRef} className="message-area-container-messages">
        {allConversations &&
          allConversations.map((item, index) => {
            return (
              <div
                key={index}
                className="message-area-container-messages-message"
                style={{
                  justifyContent:
                    item.senderId === userData.user.email
                      ? "flex-end"
                      : "flex-start",
                }}
              >
                <div
                  style={{
                    borderRadius:
                      item.senderId === userData.user.email
                        ? "16px 0px 16px 16px"
                        : "0px 16px 16px 16px",
                    backgroundColor:
                      item.senderId === userData.user.email
                        ? "#38D9F2"
                        : "#EB5151",
                  }}
                >
                  {item.message}
                  <div className="msgSentTime">{moment(item.createdAt).format('LT')}</div>
                </div>
              </div>
            );
          })}
      </div>
      <div className="message-area-container-text-area">
        <TextField
          fullWidth
          size="small"
          value={textmessage}
          onChange={(e) => setTextMessage(e.target.value)}
          onKeyDown={sendMsgEnterKey}
          placeholder="Type a message..."
        />
        <button
          disabled={textmessage.length === 0}
          onClick={() => sendMessage(textmessage, setTextMessage)}
        >Send <span><SendIcon /></span> </button>
      </div>
    </div>
  );
}

export default MessageArea;
