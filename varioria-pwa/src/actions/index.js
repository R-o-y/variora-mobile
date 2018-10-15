import axios from 'axios';
import {
  USER_GET,
  DOCUMENT_GET_MY,
  READLIST_GET_MY,
  DOCUMENT_GET_EXPLORE,
  READLIST_GET_EXPLORE,
  NOTIFICATION_GET_COMBINED,
  NOTIFICATION_READ,
  SEARCHTERM_UPDATE,
  SEARCHRESULT_GET
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

export function getMyReadlists() {
  const url = 'file_viewer/api/readlists';
  const request = axios.get(url);

  return {type: READLIST_GET_MY, payload: request};
}

export function getExploreDocuments() {
  const url = 'file_viewer/api/documents/explore';
  const request = axios.get(url);

  return {type: DOCUMENT_GET_EXPLORE, payload: request};
}

export function getExploreReadlists() {
  const url = 'file_viewer/api/readlists/explore';
  const request = axios.get(url);

  return {type: READLIST_GET_EXPLORE, payload: request};
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

export function updateSearchTerm(newTerm) {
  return {type: SEARCHTERM_UPDATE, payload: {newTerm}};
}

export function getSearchResults(term) {
  const url = 'api/search?key=' + term;
  const request = axios.get(url);

  return {type: SEARCHRESULT_GET, payload: request};
}