import _ from 'lodash';
import {
  NOTIFICATION_GET_COMBINED,
  NOTIFICATION_READ
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case NOTIFICATION_GET_COMBINED:
      const notifications = action.payload.data;
      return _.extend({}, state, _.keyBy(notifications, 'slug'))
    case NOTIFICATION_READ:
      let notification_read = state[action.slug];
      notification_read.unread = false;
      return _.extend({}, state, {[notification_read.slug]: notification_read});
    default:
      return state;
  }
}
