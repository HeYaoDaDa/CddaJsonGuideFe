import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';

export function getJsonItem(jsonType: string, jsonId: string) {
  return api
    .get(`http://localhost:8081/v0.1/${jsonType}/${jsonId}`)
    .then((response: AxiosResponse<JsonItem>) => response.data);
}

export function getModById(modId: string) {
  return api
    .get(`http://localhost:8081/v0.1/mod_info/${modId}`)
    .then((response: AxiosResponse<JsonItem>) => response.data);
}
