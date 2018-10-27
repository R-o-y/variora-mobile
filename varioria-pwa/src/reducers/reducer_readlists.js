import _ from 'lodash';
import {
  READLIST_GET_MY,
  READLIST_GET,
  READLIST_REMOVE_DOCUMENT_SUCCESS
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case READLIST_GET:
      const readlist = action.payload.data;
      return _.extend({}, state, {
        readlist: readlist
      });
    case READLIST_GET_MY:
      const createdReadlists = action.payload.data.created_readlists;
      const collectedReadlists = action.payload.data.collected_readlists;
      return _.extend(
        _.extend({}, state, _.keyBy(createdReadlists, 'slug')),
        _.keyBy(collectedReadlists, 'slug'));
    default:
      return state;
  }
}
