import _ from 'lodash';
import {
  USER_SIGN_OFF,
  INVITATION_GET,
  INVITATION_ACCEPT,
  INVITATION_DECLINE,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case USER_SIGN_OFF:
      return {};
    case INVITATION_GET:
      const invitations = action.payload.data;
      return _.extend({}, state, _.keyBy(invitations, 'pk'));
    case INVITATION_ACCEPT:
    case INVITATION_DECLINE:
      return _.omit(state, action.pk);
    default:
      return state;
  }
}
