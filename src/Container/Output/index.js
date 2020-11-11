import React, { useState, useEffect } from "react";
import styles from "./styles.css";
import { useSelector, useDispatch } from "react-redux";
import { setMessages, setLoader } from "./actions";
import DOMPurify from "dompurify";

const Output = () => {
  const reducerData = useSelector((state) => state.outputReducer);
  const editorReducerData = useSelector((state) => state.editorReducer);
  const dispatch = useDispatch();
  
  const { messages, showLoader } = reducerData;
  const { currentEditorContent } = editorReducerData;
  
  useEffect(() => {
    messages && sendResponse();
    messages && handleOnScroll();
  }, [messages]);

  const handleOnScroll = e => {
    document.getElementById('chat-section').scrollTop = document.getElementById('chat-section').scrollHeight;
  };

  const sendResponse = () => {
    const messagelist = [...messages];
    const latestMessage =
      messagelist.length && messagelist[messagelist.length - 1];
    try {
      const fn = new Function(`return ${currentEditorContent}`)();
      if (latestMessage && latestMessage.type == "incoming") {
        if (typeof fn == "function") {
          fn(latestMessage.message)
            .then((data) => {
              const response = {
                id: messagelist.length,
                timestamp: Date.now(),
                message: data,
                type: "outgoing",
              };
              messagelist.push(response);
              dispatch(setMessages(messagelist));
              dispatch(setLoader(false));
            })
            .catch((err) => {
              dispatch(setLoader(false));
            });
        }
      }
    } catch (err) {
      dispatch(setLoader(false));
      alert("Something went Wrong!");
    }
  };
  const onInput = (event) => {
    if (event.keyCode == 13) {
      dispatch(setLoader(true));
      const value = DOMPurify.sanitize(`${event.target.value}`);
      let currentMessages = [...messages];
      let newMessage = {
        id: currentMessages.length,
        timestamp: Date.now(),
        message: value,
        type: "incoming",
      };
      currentMessages.push(newMessage);
      dispatch(setMessages(currentMessages));
      event.target.value = "";
    }
  };
  const getMessageUi = (data, idx) => {
    return (
      <div
        className={`quote ${data.type == "incoming" ? "right" : "left"} `}
        key={idx}
      >
        <img
          className="round-avatar"
          src={
            data.type == "incoming"
              ? "https://s3.amazonaws.com/uifaces/faces/twitter/stan/48.jpg"
              : "assets/images/bot.jpg"
          }
        />
        <div className="speech-bubble left">{data.message}</div>
        <div className="clear" />
      </div>
    );
  };

  const loader = () => {
    return (
      <div className={`quote left`}>
        <img className="round-avatar" src="assets/images/bot.jpg" />
        <div className="speech-bubble left">...</div>
        <div className="clear" />
      </div>
    );
  };

  return (
    <div className="output-container">
      <div className="chat-container">
        <div className="chat-section" id="chat-section">
          {messages && messages.map((msg, idx) => getMessageUi(msg, idx))}
          {showLoader && loader()}
        </div>
        <input
          type="text"
          className="input-section"
          onKeyDown={(e) => onInput(e)}
          placeholder="Type message here…"
        />
      </div>
    </div>
  );
};

export default Output;
