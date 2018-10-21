import { combineReducers } from 'redux';
import user from './reducer_user';
import documents from './reducer_documents';
import readlists from './reducer_readlists';
import explore from './reducer_explore';
import notifications from './reducer_notifications';
import coteries from './reducer_coteries';
import search from './reducer_search';
import invitations from './reducer_invitations';

const rootReducer = combineReducers({
  user,
  documents,
  coteries,
  readlists,
  explore,
  notifications,
  invitations,
  search
});

export default rootReducer;
