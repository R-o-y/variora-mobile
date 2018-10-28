import _ from 'lodash';
import {
  USER_GET,
  DOCUMENT_GET_MY,
  DOCUMENT_UPLOAD,
  DOCUMENT_DELETE_SUCCESS,
  DOCUMENT_UNCOLLECT_SUCCESS,
  READLIST_GET_MY,
  COTERIE_GET_MY,
  COTERIE_GET_MY_DOCUMENTS,
  COTERIE_DOCUMENT_UPLOAD,
  COTERIE_LEAVE,
  COTERIE_DELETE,
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

    case COTERIE_LEAVE:
      const joinedCoteriesAfterLeave = _.filter(state.joinedCoteries, (uuid) => {return uuid !== action.uuid});
      return _.extend({}, state, { joinedCoteries: joinedCoteriesAfterLeave});

    case COTERIE_DELETE:
      const administratedCoteriesAfterDelete = _.filter(state.administratedCoteries, (uuid) => {return uuid !== action.uuid});
      return _.extend({}, state, { administratedCoteries: administratedCoteriesAfterDelete});

    case READLIST_GET_MY:
      const createdReadlists = action.payload.data.created_readlists;
      const collectedReadlists = action.payload.data.collected_readlists;
      return _.extend({}, state,
        { createdReadlists: _.map(createdReadlists, 'slug'),
          collectedReadlists: _.map(collectedReadlists, 'slug')
        });

    default:
      return state;
  }
}
