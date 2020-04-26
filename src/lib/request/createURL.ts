import axios, { AxiosResponse } from 'axios';
import getDataFromResp from '@/lib/util/getDataFromResp';
import { API_ADDR } from '../../../config/server';

export default async (fileName: string): Promise<string> => {
  let URL = `${API_ADDR}/file/create-url`;

  const resp: AxiosResponse = await axios.post(URL, {
    file_name: fileName,
  });

  const { url } = getDataFromResp(resp);
  return url
}
