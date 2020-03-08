import { AxiosResponse } from 'axios'
export default (resp: AxiosResponse) => {
  const { data } = resp;
  return data.data;
}