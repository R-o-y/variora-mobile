import _ from 'lodash';
import {
  USER_GET,
  DOCUMENT_GET_MY,
  COTERIE_GET_MY,
  COTERIE_SWITCH
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
    case COTERIE_GET_MY:
      const joinedCoteries = action.payload.data.joinedCoteries;
      const administratedCoteries = action.payload.data.administratedCoteries;
      return _.extend({}, state,
        { joinedCoteries: _.map(joinedCoteries, 'pk'),
          administratedCoteries: _.map(administratedCoteries, 'pk')
        });
    case COTERIE_SWITCH:
      return _.extend({}, state, { currentCoterie: action.payload.coteriePk })
    default:
      return state;
  }
}
