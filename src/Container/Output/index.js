import React, { useState, useEffect } from "react";
import styles from "./styles.module.scss";
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
        if (fn && typeof fn == "function" && (fn.constructor.name === 'AsyncFunction' || typeof fn.then === "function")) {
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
        } else {
          const data = fn(latestMessage.message);
          const response = {
            id: messagelist.length,
            timestamp: Date.now(),
            message: data,
            type: "outgoing",
          };
          messagelist.push(response);
          dispatch(setMessages(messagelist));
          dispatch(setLoader(false));
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
        className={`${styles.quote} ${data.type == "incoming" ? styles.right : styles.left} `}
        key={idx}
      >
        <img
          className={styles.roundAvatar}
          src={
            data.type == "incoming"
              ? "https://s3.amazonaws.com/uifaces/faces/twitter/stan/48.jpg"
              : "assets/images/bot.jpg"
          }
        />
        <div className={`${styles.speechBubble} ${styles.left}`}>{data.message}</div>
        <div className={styles.clear} />
      </div>
    );
  };

  const loader = () => {
    return (
      <div className={`${styles.quote} ${styles.left}`}>
        <img className={styles.roundAvatar} src="assets/images/bot.jpg" />
        <div className={`${styles.speechBubble} ${styles.left}`}>...</div>
        <div className={styles.clear} />
      </div>
    );
  };

  return (
    <div className="outputContainer">
      <div className={styles.chatContainer}>
        <div className={styles.chatSection} id="chat-section">
          {messages && messages.map((msg, idx) => getMessageUi(msg, idx))}
          {showLoader && loader()}
        </div>
        <input
          type="text"
          className={styles.inputSection}
          onKeyDown={(e) => onInput(e)}
          placeholder="Type message here…"
        />
      </div>
    </div>
  );
};

export default Output;
