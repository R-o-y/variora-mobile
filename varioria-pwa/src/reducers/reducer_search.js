import _ from 'lodash';
import {
  SEARCHTERM_UPDATE,
  SEARCHRESULT_GET
} from '../actions/types';

export default function (state = {term: ''}, action) {
  switch (action.type) {
    case SEARCHTERM_UPDATE:
      return _.extend({}, state, {
        term: action.payload.newTerm
      });
    case SEARCHRESULT_GET:
      const readlists = action.payload.data.resultReadlists;
      const documents = action.payload.data.resultDocuments;
      return _.extend({}, state, {
        readlists: readlists,
        documents: documents
      });
    default:
      return state;
  }
}