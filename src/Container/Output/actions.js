export const setMessages = (messages) => {
  return {
    type: "SET_MESSAGES",
    payload: {
      messages,
    },
  };
};

export const setLoader = (showLoader) => {
  return {
    type: "SET_LOADER",
    payload: {
      showLoader,
    },
  };
};
