import _ from 'lodash';
import {
  NOTIFICATION_GET_COMBINED,
  NOTIFICATION_READ,
  NOTIFICATION_READ_ALL_SUCCESS,
  NOTIFICATION_READ_ALL_ERROR,
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
    case NOTIFICATION_READ_ALL_SUCCESS:
      let notifications_read_list = _.filter(state, (notification) =>
        action.payload.unreadNotificationSlug.includes(notification.slug));
      notifications_read_list = _.map(notifications_read_list, (notification) => {
        notification.unread = false;
        return notification;
      })
      return _.extend({}, state, _.keyBy(notifications_read_list, 'slug'));
    default:
      return state;
  }
}
