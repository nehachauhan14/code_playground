import { combineReducers } from 'redux';
import outputReducer from '../Container/Output/reducer';
import editorReducer from '../Container/Editor/reducer';

export default combineReducers({
 outputReducer,
 editorReducer
});
