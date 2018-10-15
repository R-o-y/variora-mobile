import _ from 'lodash';
import {
  COTERIE_GET_MY,
  COTERIE_CREATE,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case COTERIE_GET_MY:
      const joinedCoteries = action.payload.data.joinedCoteries;
      const administratedCoteries = action.payload.data.administratedCoteries;
      return _.extend(
        _.extend({}, state, _.keyBy(joinedCoteries, 'pk')),
        _.keyBy(administratedCoteries, 'pk'));
    case COTERIE_CREATE:
      const new_coterie = action.payload.data;
      return _.extend({}, state, {[new_coterie.pk]: new_coterie});
    default:
      return state;
  }
}
