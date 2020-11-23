const initialState = {
    data: {},
    defaultFn: `async function respond(inputText) {
        let result = await CampK12.translate(inputText, "en", "es")
        return result;
      }`,
    editor: null,
    currentEditorContent: `async function respond(inputText) { let result = await CampK12.translate(inputText, "en", "es")
    return result;
    }`,
    instances: [],
    currentTab: null,
}

export default (state = initialState, action) => {
  switch (action.type) {
    case "SET_EDITOR":
        return Object.assign({}, state, {
          editor: action.payload.editor
        });
    case "SET_INSTANCES":
      return Object.assign({}, state, {
        instances: action.payload.instances
      });
    case "SET_EDITOR_CONTENT":
      return Object.assign({}, state, {
        currentEditorContent: action.payload.content
      });
    default:
      return state;
  }
};
