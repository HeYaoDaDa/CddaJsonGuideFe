import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';

export async function getVersions() {
  return api
    .get('http://localhost:8081/v0.1/versions')
    .then((response: AxiosResponse<Version[]>) => response.data);
}
