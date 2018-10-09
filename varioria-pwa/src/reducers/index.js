import { combineReducers } from 'redux';
import user from './reducer_user';
import documents from './reducer_documents';

const rootReducer = combineReducers({
  user,
  documents
});

export default rootReducer;
