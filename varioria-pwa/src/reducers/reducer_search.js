import _ from 'lodash';
import {
  SEARCHRESULT_GET,
  SEARCH_ERROR
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case SEARCHRESULT_GET:
      const readlists = action.payload.data.resultReadlists;
      const documents = action.payload.data.resultDocuments;
      const users = action.payload.data.resultUsers;
      const coteries = action.payload.data.resultCoteries;
      return _.extend({}, state, {
        readlists: readlists,
        documents: documents,
        users: users,
        coteries: coteries,
      });
    case SEARCH_ERROR:
      return {};
    default:
      return state;
  }
}
