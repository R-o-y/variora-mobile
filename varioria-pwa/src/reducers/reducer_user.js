import _ from 'lodash';
import {
  USER_GET,
  DOCUMENT_GET_MY
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
    default:
      return state;
  }
}
