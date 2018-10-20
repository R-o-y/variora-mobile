import _ from 'lodash';
import {
  DOCUMENT_GET_MY,
  DOCUMENT_UPLOAD,
  DOCUMENT_RENAME,
  DOCUMENT_DELETE_SUCCESS
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case DOCUMENT_GET_MY:
      const uploadedDocuments = action.payload.data.uploadedDocuments;
      const collectedDocuments = action.payload.data.collectedDocuments;
      return _.extend(
        _.extend({}, state, _.keyBy(uploadedDocuments, 'slug')),
        _.keyBy(collectedDocuments, 'slug'));

    case DOCUMENT_UPLOAD:
      const uploadedDocument = action.payload.data;
      console.log(uploadedDocument)
      return state;
      // USE THIS AFTER FIXING THE API RESPONSE
      // return _.extend({}, state, {[uploadedDocument.slug]: uploadedDocument});

    case DOCUMENT_RENAME:
      const renamedDocument = action.payload.data;
      return _.extend({}, state, {[renamedDocument.slug]: renamedDocument});

    case DOCUMENT_DELETE_SUCCESS:
      return _.omit(state, action.payload);

    default:
      return state;
  }
}
