import _ from 'lodash';
import {
  DOCUMENT_GET_MY,
  DOCUMENT_RENAME
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case DOCUMENT_GET_MY:
      const uploadedDocuments = action.payload.data.uploadedDocuments;
      const collectedDocuments = action.payload.data.collectedDocuments;
      return _.extend(
        _.extend({}, state, _.keyBy(uploadedDocuments, 'slug')),
        _.keyBy(collectedDocuments, 'slug'));

    case DOCUMENT_RENAME:
      const renamedDocument = action.payload.data;
      return _.extend({}, state, {[renamedDocument.slug]: renamedDocument});
    default:
      return state;
  }
}
