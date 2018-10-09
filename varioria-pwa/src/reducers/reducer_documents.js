import _ from 'lodash';
import {
  DOCUMENT_GET_MY,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case DOCUMENT_GET_MY:
      const uploadedDocuments = action.payload.data.uploadedDocuments;
      const collectedDocuments = action.payload.data.collectedDocuments;
      return _.extend(
        _.extend({}, state, _.keyBy(uploadedDocuments, 'pk')),
        _.keyBy(collectedDocuments, 'pk'));
    default:
      return state;
  }
}
