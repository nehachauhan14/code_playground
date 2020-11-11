const initialState = {
    data: {},
    messages: [],
    showLoader: false
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_MESSAGES":
        return Object.assign({}, state, {
            messages: action.payload.messages
        });
    case "SET_LOADER":
        return Object.assign({}, state, {
            showLoader: action.payload.showLoader
        });
    default:
      return state;
  }
};
