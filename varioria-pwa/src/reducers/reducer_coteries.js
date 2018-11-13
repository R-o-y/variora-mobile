import _ from 'lodash';
import {
  USER_SIGN_OFF,
  COTERIE_GET_MY,
  COTERIE_CREATE,
  COTERIE_DELETE,
  COTERIE_UPDATE_SUCCESS,
  COTERIE_MEMBER_REMOVE,
  COTERIE_JOIN_WITH_CODE,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case USER_SIGN_OFF:
      return {};
    case COTERIE_GET_MY:
      const joinedCoteries = action.payload.data.joinedCoteries;
      const administratedCoteries = action.payload.data.administratedCoteries;
      return _.extend(
        _.extend({}, state, _.keyBy(joinedCoteries, 'uuid')),
        _.keyBy(administratedCoteries, 'uuid'));
    case COTERIE_CREATE:
      const new_coterie = action.payload.data;
      return _.extend({}, state, {[new_coterie.uuid]: new_coterie});
    case COTERIE_DELETE:
      return _.omit(state, action.uuid);
    case COTERIE_UPDATE_SUCCESS:
      const updated_coterie = state[action.payload.uuid];
      if (action.payload.name) updated_coterie.name = action.payload.name;
      if (action.payload.description) updated_coterie.description = action.payload.description;
      return _.extend({}, state, {[action.payload.uuid]: updated_coterie});
    case COTERIE_MEMBER_REMOVE:
      const member_removed_coterie = state[action.payload.uuid];
      member_removed_coterie.members = member_removed_coterie.members.filter(member => member.email_address !== action.payload.email);
      return _.extend({}, state, {[member_removed_coterie.uuid]: member_removed_coterie});
    case COTERIE_JOIN_WITH_CODE:
      const coterie_joined_with_code = action.payload.data;
      return _.extend({}, state, {[coterie_joined_with_code.uuid]: coterie_joined_with_code});
    default:
      return state;
  }
}
