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
  COTERIE_GET_MY_DOCUMENTS,
  COTERIE_CREATE,
  COTERIE_UPDATE,
  COTERIE_UPDATE_SUCCESS,
  COTERIE_INVITE,
  COTERIE_DOCUMENT_UPLOAD,
  COTERIE_LEAVE,
  COTERIE_DELETE,
  SEARCHTERM_UPDATE,
  SEARCHRESULT_GET,
  READLIST_GET,
  READLIST_CREATE,
  READLIST_EDIT,
  READLIST_DELETE_SUCCESS,
  DOCUMENT_UPLOAD,
  DOCUMENT_RENAME,
  DOCUMENT_DELETE_SUCCESS,
  DOCUMENT_UNCOLLECT_SUCCESS,
  INVITATION_GET,
  INVITATION_ACCEPT,
  INVITATION_DECLINE
} from './types';


const FILE_UPLOAD_API_URL = '/file_viewer/api/documents/upload';
const COTERIE_DOCUMENT_UPLOAD_API_URL = '/coterie/api/coteriedocuments/upload';
const INVITE_TO_COTERIE_API_URL = '/coterie/api/invite';
const GET_INVITATION_API_URL = '/coterie/api/invitations';

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

export function uploadCoterieDocument(data) {
  const request = axios({
    method: 'post',
    headers: {'Content-Type': 'multipart/form-data'},
    url: COTERIE_DOCUMENT_UPLOAD_API_URL,
    data
  });

  return {type: COTERIE_DOCUMENT_UPLOAD, payload: request};
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

  return {type: READLIST_GET, payload: request};
}

export function deleteReadlist(url, data, slug) {
  console.log(url, "URL")
  console.log(data, "data")
  console.log(slug, "slug")

  return function(dispatch) {
    return axios({
      method: 'post',
      url,
      data
    })
    .then(() => {
      dispatch(deleteReadlistSuccess(slug));
      return;
    }).catch(error => {
      throw(error);
    })
  }
}

export function deleteReadlistSuccess(slug) {
  console.log("readlist " + slug + " deleted!!!");
  return {type: READLIST_DELETE_SUCCESS, payload: slug}
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
  const request = axios.get(url);

  return {
    type: NOTIFICATION_READ,
    payload: request,
    slug
  }
}

export function getMyCoteries() {
  const url = '/coterie/api/coteries';
  const request = axios.get(url);

  return {type: COTERIE_GET_MY, payload: request};
}

export function getMyCoteriesDocument(uuid) {
  const url = `/coteries/api/coteries/${uuid}/members/me/uploaded-documents`;
  const request = axios.get(url);

  return {type: COTERIE_GET_MY_DOCUMENTS, payload: request};
}

export function getMyCoteriesReadlists(uuid) {
  // const url = `/coteries/api/coteries/${uuid}/members/me/uploaded-documents`;
  // const request = axios.get(url);

  // return {type: COTERIE_GET_MY_DOCUMENTS, payload: request};
}

export function createReadlist(data) {
  const url = '/file_viewer/api/readlists/create';
  const request = axios({
    method: 'post',
    url,
    data
  });
  return {type: READLIST_CREATE, payload: request};
}

export function editReadlist(data, slug) {
  const url = '/file_viewer/api/readlists/edit';

  const request = axios({
    method: 'post',
    url,
    data
  });

  return {type: READLIST_EDIT, payload: request};
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

export function updateCoterie(data, pk) {
  const url = `/coterie/api/coteries/${pk}/update`
  const request = axios({
    method: 'post',
    url,
    data
  });

  return {type: COTERIE_UPDATE, payload: request};
}

export function updateCoterieSuccess(uuid, name, description) {
  return {
    type: COTERIE_UPDATE_SUCCESS,
    payload: {
      uuid,
      name,
      description
    }
  }
}

export function leaveCoterie(data, pk, uuid) {
  const url = `/coterie/api/coteries/${pk}/exit`
  const request = axios({
    method: 'post',
    url,
    data
  });

  return {type: COTERIE_LEAVE, payload: request, uuid};
}

export function deleteCoterie(data, pk, uuid) {
  const url = `/coterie/api/coteries/${pk}/delete`
  const request = axios({
    method: 'post',
    url,
    data
  });

  return {type: COTERIE_DELETE, payload: request, uuid};
}

export function getSearchResults(term) {
  const url = '/api/search?key=' + term;
  const request = axios.get(url);
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

export function getInvitations() {
  const request = axios.get(GET_INVITATION_API_URL);

  return {type: INVITATION_GET, payload: request};
}

export function acceptInvitation(url, data, pk) {
  const request = axios({
    method: 'post',
    url,
    data
  })

  return { type: INVITATION_ACCEPT, payload: request, pk }
}

export function declineInvitation(url, data, pk) {
  const request = axios({
    method: 'post',
    url,
    data
  })

  return { type: INVITATION_DECLINE, payload: request, pk }
}
