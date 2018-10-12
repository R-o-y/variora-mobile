import _ from 'lodash';
import {
  NOTIFICATION_GET_COMBINED,
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case NOTIFICATION_GET_COMBINED:
      const notifications = action.payload.data;
      return _.extend({}, state, _.keyBy(notifications, 'slug'))
    default:
      return state;
  }
}
