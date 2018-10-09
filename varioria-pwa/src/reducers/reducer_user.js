import _ from 'lodash';
import {
  USER_GET
} from '../actions/types';

export default function (state = [], action) {
  switch (action.type) {
    case USER_GET:
      const user = action.payload.data;
      return _.extend({}, state, {[user.pk]: user});
    default:
      return state;
  }
}
