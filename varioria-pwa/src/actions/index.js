import axios from 'axios';
import {
  USER_GET,
  DOCUMENT_GET_MY,
  READLIST_GET_MY,
  DOCUMENT_GET_EXPLORE,
  READLIST_GET_EXPLORE,
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