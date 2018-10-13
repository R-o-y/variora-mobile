import _ from 'lodash';
import {
  USER_GET,
  DOCUMENT_GET_MY,
  COTERIES_GET_MY
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
        { uploadedDocuments: _.map(uploadedDocuments, 'pk'),
          collectedDocuments: _.map(collectedDocuments, 'pk')
        });
    case COTERIES_GET_MY:
      const joinedCoteries = action.payload.data.joinedCoteries;
      const administratedCoteries = action.payload.data.administratedCoteries;
      return _.extend({}, state,
        { joinedCoteries: _.map(joinedCoteries, 'pk'),
          administratedCoteries: _.map(administratedCoteries, 'pk')
        });
    default:
      return state;
  }
}
