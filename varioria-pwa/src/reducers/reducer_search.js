import _ from 'lodash';
import {
  SEARCHRESULT_GET
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case SEARCHRESULT_GET:
      console.log("RESULT")
      console.log(action.payload.data);
      const readlists = action.payload.data.resultReadlists;
      const documents = action.payload.data.resultDocuments;
      const users = action.payload.data.resultUsers;
      return _.extend({}, state, {
        readlists: readlists,
        documents: documents,
        users: users,
      });
    default:
      return state;
  }
}