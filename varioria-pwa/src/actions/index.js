import axios from 'axios';
import {
  USER_GET,
  USER_SIGN_OFF,
  DOCUMENT_GET_MY,
  READLIST_GET_MY,
  DOCUMENT_GET_EXPLORE,
  READLIST_GET_EXPLORE,
  NOTIFICATION_GET_COMBINED,
  NOTIFICATION_READ,
  NOTIFICATION_READ_ALL_SUCCESS,
  NOTIFICATION_READ_ALL_ERROR,
  COTERIE_GET_MY,
  COTERIE_GET_MY_DOCUMENTS,
  COTERIE_CREATE,
  COTERIE_UPDATE,
  COTERIE_UPDATE_SUCCESS,
  COTERIE_INVITE,
  COTERIE_MEMBER_REMOVE,
  COTERIE_DOCUMENT_UPLOAD,
  COTERIE_LEAVE,
  COTERIE_DELETE,
  COTERIE_JOIN_WITH_CODE,
  COTERIE_APPLY,
  SEARCHTERM_UPDATE,
  SEARCHRESULT_GET,
  SEARCH_ERROR,
  READLIST_GET,
  READLIST_CREATE,
  READLIST_EDIT,
  READLIST_DELETE_SUCCESS,
  READLIST_COLLECT_SUCCESS,
  READLIST_UNCOLLECT_SUCCESS,
  READLIST_REMOVE_DOCUMENT_SUCCESS,
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

export function signOff(data) {
  const url = '/api/signoff';
  const request = axios({
    method: 'post',
    url,
    data
  });

  return {type: USER_SIGN_OFF, payload: request};
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

export function deleteReadlistSuccess(slug) {
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

export function markAllNotificationsAsRead(data, unreadNotificationSlug) {
  const url = '/notifications/api/mark-all-as-read';
  return function(dispatch) {
    axios({
      method: 'post',
      url,
      data
    })
    .then((response) => {
      dispatch({type: NOTIFICATION_READ_ALL_SUCCESS, payload: {unreadNotificationSlug}})
    })
    .catch((error) => {
      dispatch({type: NOTIFICATION_READ_ALL_ERROR})
    })
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

export function editReadlist(url, data) {
  const request = axios({
    method: 'post',
    url,
    data
  });

  return {type: READLIST_EDIT, payload: request};
}

export function collectReadlist(data, slug) {
  const url = "/file_viewer/api/readlists/" + slug + "/collect";
  return function(dispatch) {
    return axios({
      method: 'post',
      url,
      data
    })
    .then(() => {
      dispatch(collectReadlistSuccess(slug));
      return;
    }).catch(error => {
      throw(error);
    })
  }
}

export function collectReadlistSuccess(slug) {
  return {type: READLIST_COLLECT_SUCCESS, payload: slug}
}

export function uncollectReadlist(data, slug) {
  const url = "/file_viewer/api/readlists/" + slug + "/uncollect";
  return function(dispatch) {
    return axios({
      method: 'post',
      url,
      data
    })
    .then(() => {
      dispatch(uncollectReadlistSuccess(slug));
      return;
    }).catch(error => {
      throw(error);
    })
  }
}

export function uncollectReadlistSuccess(slug) {
  return {type: READLIST_UNCOLLECT_SUCCESS, payload: slug}
}


export function documentChangeReadlists(pk, data) {
  const url = '/file_viewer/api/documents/' + pk + '/changereadlists'
  console.log("making req to " + url + " with data")
  console.log(data)
  return function(dispatch) {
    return axios({
      method: 'post',
      url,
      data
    })
    .then(() => {
      dispatch(removeFromReadlistSuccess());
      return;
    }).catch(error => {
      throw(error);
    })
  }
}

export function removeFromReadlistSuccess() {
  return {type: READLIST_REMOVE_DOCUMENT_SUCCESS, payload: {}}
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
  return function(dispatch) {
    axios.get(url)
    .then((response) => {
      dispatch({type: SEARCHRESULT_GET, payload: response})
    })
    .catch((error) => {
      dispatch({type: SEARCH_ERROR})
    })
  }
}

export function getCoterieSearchResults(term, coterieUuid) {
  const url = '/coterie/api/coteries/' + coterieUuid + '/search?key=' + term;
  return function(dispatch) {
    axios.get(url)
    .then((response) => {
      dispatch({type: SEARCHRESULT_GET, payload: response})
    })
    .catch((error) => {
      dispatch({type: SEARCH_ERROR})
    })
  }
}

export function inviteToCoterie(data) {
  const request = axios({
    method: 'post',
    url: INVITE_TO_COTERIE_API_URL,
    data
  });

  return {type: COTERIE_INVITE, payload: request};
}

export function removeMember(url, data, uuid, email) {
  return function(dispatch) {
    return axios({
      method: 'post',
      url,
      data
    })
    .then((response) => {
      dispatch({type: COTERIE_MEMBER_REMOVE, payload: {uuid, email}})
    }).catch(error => {
      throw(error);
    })
  }
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

export function joinCoterieWithCode(data, pk) {
  const url = `/coterie/api/coteries/${pk}/join_with_code`;
  const request = axios({
    method: 'post',
    url,
    data
  })

  return { type: COTERIE_JOIN_WITH_CODE, payload: request }
}

export function applyCoterie(data) {
  const url = '/coterie/api/apply';
  const request = axios({
    method: 'post',
    url,
    data
  })

  return { type: COTERIE_APPLY, payload: request }
}
