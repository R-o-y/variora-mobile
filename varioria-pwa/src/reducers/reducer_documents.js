import _ from 'lodash';
import {
  USER_SIGN_OFF,
  DOCUMENT_GET_MY,
  DOCUMENT_UPLOAD,
  DOCUMENT_RENAME,
  DOCUMENT_DELETE_SUCCESS,
  COTERIE_GET_MY_DOCUMENTS,
  COTERIE_DOCUMENT_UPLOAD,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case USER_SIGN_OFF:
      return {};
    case DOCUMENT_GET_MY:
      const uploadedDocuments = action.payload.data.uploadedDocuments;
      const collectedDocuments = action.payload.data.collectedDocuments;
      return _.extend(
        _.extend({}, state, _.keyBy(uploadedDocuments, 'slug')),
        _.keyBy(collectedDocuments, 'slug'));

    case COTERIE_GET_MY_DOCUMENTS:
      const myUploadedDocuments = action.payload.data;
      return _.extend({}, state, _.keyBy(myUploadedDocuments, 'slug'));

    case DOCUMENT_UPLOAD:
    case COTERIE_DOCUMENT_UPLOAD:
      const uploadedDocument = action.payload.data;
      return _.extend({}, state, {[uploadedDocument.slug]: uploadedDocument});

    case DOCUMENT_RENAME:
      const renamedDocument = action.payload.data;
      return _.extend({}, state, {[renamedDocument.slug]: renamedDocument});

    case DOCUMENT_DELETE_SUCCESS:
      return _.omit(state, action.payload);

    default:
      return state;
  }
}
