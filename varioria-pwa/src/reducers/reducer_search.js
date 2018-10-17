import _ from 'lodash';
import {
  SEARCHRESULT_GET
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
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