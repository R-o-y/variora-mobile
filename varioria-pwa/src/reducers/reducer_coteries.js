import _ from 'lodash';
import {
  COTERIE_GET_MY,
  COTERIE_CREATE,
  COTERIE_UPDATE_SUCCESS,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case COTERIE_GET_MY:
      const joinedCoteries = action.payload.data.joinedCoteries;
      const administratedCoteries = action.payload.data.administratedCoteries;
      return _.extend(
        _.extend({}, state, _.keyBy(joinedCoteries, 'uuid')),
        _.keyBy(administratedCoteries, 'uuid'));
    case COTERIE_CREATE:
      const new_coterie = action.payload.data;
      return _.extend({}, state, {[new_coterie.pk]: new_coterie});
    case COTERIE_UPDATE_SUCCESS:
      const updated_coterie = state[action.payload.uuid];
      if (action.payload.name) updated_coterie.name = action.payload.name;
      if (action.payload.description) updated_coterie.description = action.payload.description;
      return _.extend({}, state, {[action.payload.uuid]: updated_coterie});
    default:
      return state;
  }
}
