import _ from 'lodash';
import {
  READLIST_GET_MY,
  READLIST_GET,
  COTERIE_GET_MY_READLISTS
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
    case COTERIE_GET_MY_READLISTS:
      const coterieCreatedReadlists = action.payload.data.created_readlists;
      const coterieCollectedReadlists = action.payload.data.collected_readlists;
      return _.extend(
        _.extend({}, state, _.keyBy(coterieCreatedReadlists, 'slug')),
        _.keyBy(coterieCollectedReadlists, 'slug'));
    default:
    return state;
  }
}
