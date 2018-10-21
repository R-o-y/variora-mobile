import axios from 'axios';
import {
  USER_GET,
  DOCUMENT_GET_MY,
  READLIST_GET_MY,
  DOCUMENT_GET_EXPLORE,
  READLIST_GET_EXPLORE,
  NOTIFICATION_GET_COMBINED,
  NOTIFICATION_READ,
  COTERIE_GET_MY,
  COTERIE_SWITCH,
  COTERIE_CREATE,
  COTERIE_INVITE,
  SEARCHTERM_UPDATE,
  SEARCHRESULT_GET,
  READLIST_GET,
  DOCUMENT_UPLOAD,
  DOCUMENT_RENAME,
  DOCUMENT_DELETE_SUCCESS,
  DOCUMENT_UNCOLLECT_SUCCESS,
} from './types';


const FILE_UPLOAD_API_URL = '/file_viewer/api/documents/upload';
const INVITE_TO_COTERIE_API_URL = '/coterie/api/invite';

export function getUser() {
  const url = '/api/user';
  const request = axios.get(url);

  return {type: USER_GET, payload: request};
}

export function getMyDocuments() {
  const url = '/file_viewer/api/documents';
  const request = axios.get(url);

  return {type: DOCUMENT_GET_MY, payload: request};
}

export function uploadDocument(data) {
  const request = axios({
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    url: FILE_UPLOAD_API_URL,
    data
  });

  return {type: DOCUMENT_UPLOAD, payload: request};
}

export function renameDocument(url, data) {
  const request = axios({
    method: 'post',
    url,
    data
  });

  return {type: DOCUMENT_RENAME, payload: request};
}

export function deleteDocument(url, data, slug) {
  return function(dispatch) {
    return axios({
      method: 'post',
      url,
      data
    })
    .then(() => {
      dispatch(deleteDocumentSuccess(slug));
      return;
    }).catch(error => {
      throw(error);
    })
  }
}

export function deleteDocumentSuccess(slug) {
  return {type: DOCUMENT_DELETE_SUCCESS, payload: slug}
}

export function uncollectDocument(url, data, slug) {
  return function(dispatch) {
    return axios({
      method: 'post',
      url,
      data
    })
    .then(() => {
      dispatch(uncollectDocumentSuccess(slug));
      return;
    }).catch(error => {
      throw(error);
    })
  }
}

export function uncollectDocumentSuccess(slug) {
  return {type: DOCUMENT_UNCOLLECT_SUCCESS, payload: slug}
}


export function getMyReadlists() {
  const url = '/file_viewer/api/readlists';
  const request = axios.get(url);

  return {type: READLIST_GET_MY, payload: request};
}

export function getReadlist(slug) {
  const url = '/file_viewer/api/readlists/' + slug;
  const request = axios.get(url);
  console.log("url is " + url)

  return {type: READLIST_GET, payload: request};
}

export function getExploreDocuments() {
  const url = '/file_viewer/api/documents/explore';
  const request = axios.get(url);

  return {type: DOCUMENT_GET_EXPLORE, payload: request};
}

export function getExploreReadlists() {
  const url = '/file_viewer/api/readlists/explore';
  const request = axios.get(url);

  return {type: READLIST_GET_EXPLORE, payload: request};
}

export function getCombinedNotifications() {
  const url = '/notifications/api/combined';
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
  const url = '/coterie/api/coteries';
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

export function createCoterie(data) {
  const url = '/coterie/api/coteries/create';
  const request = axios({
    method: 'post',
    url,
    data
  });

  return {type: COTERIE_CREATE, payload: request};
}

export function getSearchResults(term) {
  const url = '/api/search?key=' + term;
  const request = axios.get(url);
  console.log(request);
  return {type: SEARCHRESULT_GET, payload: request};
}

export function inviteToCoterie(data) {
  const request = axios({
    method: 'post',
    url: INVITE_TO_COTERIE_API_URL,
    data
  });

  return {type: COTERIE_INVITE, payload: request};
}
