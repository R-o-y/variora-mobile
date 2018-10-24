import _ from 'lodash';
import {
  USER_GET,
  DOCUMENT_GET_MY,
  DOCUMENT_UPLOAD,
  DOCUMENT_DELETE_SUCCESS,
  DOCUMENT_UNCOLLECT_SUCCESS,
  COTERIE_GET_MY,
  COTERIE_GET_MY_DOCUMENTS,
  COTERIE_DOCUMENT_UPLOAD,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case USER_GET:
      const user = action.payload.data;
      return _.extend({}, state, user);
    case DOCUMENT_GET_MY:
      const uploadedDocuments = action.payload.data.uploadedDocuments;
      const collectedDocuments = action.payload.data.collectedDocuments;
      return _.extend({}, state,
        { uploadedDocuments: _.map(uploadedDocuments, 'slug'),
          collectedDocuments: _.map(collectedDocuments, 'slug')
        });
    case COTERIE_GET_MY_DOCUMENTS:
      const coterieMyUploadedDocuments = action.payload.data;
      return _.extend({}, state,
        { uploadedDocuments: _.map(coterieMyUploadedDocuments, 'slug'),
          collectedDocuments: []
      });
    case DOCUMENT_UPLOAD:
    case COTERIE_DOCUMENT_UPLOAD:
      const addedUploadedDocuments = _.concat(state.uploadedDocuments, action.payload.data.slug);
      return _.extend({}, state, { uploadedDocuments: addedUploadedDocuments });
    case DOCUMENT_DELETE_SUCCESS:
      const newUploadedDocuments = _.filter(state.uploadedDocuments, (slug) => {return slug !== action.payload});
      const newCollectedDocuments = _.filter(state.collectedDocuments, (slug) => {return slug !== action.payload});
      return _.extend({}, state,
        { uploadedDocuments: newUploadedDocuments,
          collectedDocuments: newCollectedDocuments
        });
    case DOCUMENT_UNCOLLECT_SUCCESS:
      const newCollected = _.filter(state.collectedDocuments, (slug) => {return slug !== action.payload});
      return _.extend({}, state, {collectedDocuments: newCollected});
    case COTERIE_GET_MY:
      const joinedCoteries = action.payload.data.joinedCoteries;
      const administratedCoteries = action.payload.data.administratedCoteries;
      return _.extend({}, state,
        { joinedCoteries: _.map(joinedCoteries, 'uuid'),
          administratedCoteries: _.map(administratedCoteries, 'uuid')
        });
    default:
      return state;
  }
}
