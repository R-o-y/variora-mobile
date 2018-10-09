import axios from 'axios';
import {
  USER_GET,
} from './types';

export function getUser() {
  const url = '/api/user';
  const request = axios.get(url);

  return {type: USER_GET, payload: request};
}
