import { AxiosResponse } from 'axios';
import { api } from 'boot/axios';

export function searchItem(name: string, category: string) {
  return api
    .get('http://localhost:8081/v0.1/search', {
      params: { name, category },
    })
    .then((response: AxiosResponse<SearchResultItem[]>) => response.data);
}
