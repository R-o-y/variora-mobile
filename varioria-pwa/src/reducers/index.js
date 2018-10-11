import { combineReducers } from 'redux';
import user from './reducer_user';
import documents from './reducer_documents';
import readlists from './reducer_readlists';
import explore from './reducer_explore';

const rootReducer = combineReducers({
  user,
  documents,
  readlists,
  explore
});

export default rootReducer;
