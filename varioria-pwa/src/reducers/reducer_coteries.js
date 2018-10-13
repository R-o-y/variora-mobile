import _ from 'lodash';
import {
  COTERIE_GET_MY,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case COTERIE_GET_MY:
      const joinedCoteries = action.payload.data.joinedCoteries;
      const administratedCoteries = action.payload.data.administratedCoteries;
      return _.extend(
        _.extend({}, state, _.keyBy(joinedCoteries, 'pk')),
        _.keyBy(administratedCoteries, 'pk'));
    default:
      return state;
  }
}
