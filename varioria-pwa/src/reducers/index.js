import { combineReducers } from 'redux';
import user from './reducer_user';
import documents from './reducer_documents';
import notifications from './reducer_notifications';
import coteries from './reducer_coteries';

const rootReducer = combineReducers({
  user,
  documents,
  notifications,
  coteries
});

export default rootReducer;
