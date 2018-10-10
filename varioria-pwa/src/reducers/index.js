import { combineReducers } from 'redux';
import user from './reducer_user';
import documents from './reducer_documents';
import explore from './reducer_explore';

const rootReducer = combineReducers({
  user,
  documents,
  explore
});

export default rootReducer;
