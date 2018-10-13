import axios from 'axios';
import {
  USER_GET,
  DOCUMENT_GET_MY,
  NOTIFICATION_GET_COMBINED,
  NOTIFICATION_READ,
  COTERIE_GET_MY,
  COTERIE_SWITCH
} from './types';

export function getUser() {
  const url = '/api/user';
  const request = axios.get(url);

  return {type: USER_GET, payload: request};
}

export function getMyDocuments() {
  const url = 'file_viewer/api/documents';
  const request = axios.get(url);

  return {type: DOCUMENT_GET_MY, payload: request};
}

export function getCombinedNotifications() {
  const url = 'notifications/api/combined';
  const request = axios.get(url);

  return {type: NOTIFICATION_GET_COMBINED, payload: request};
}

export function markNotificationAsRead(url, slug) {
  axios.get(url);

  return {
    type: NOTIFICATION_READ,
    payload: {
      slug
    }
  }
}

export function getMyCoteries() {
  const url = 'coterie/api/coteries';
  const request = axios.get(url);

  return {type: COTERIE_GET_MY, payload: request};
}

export function switchCoterie(coteriePk) {
  return {
    type: COTERIE_SWITCH,
    payload: {
      coteriePk
    }
  }
}
