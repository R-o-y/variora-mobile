import { combineReducers } from 'redux';
import user from './reducer_user';
import documents from './reducer_documents';
import notifications from './reducer_notifications';

const rootReducer = combineReducers({
  user,
  documents,
  notifications
});

export default rootReducer;
