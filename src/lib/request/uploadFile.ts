import axios, { AxiosResponse } from 'axios';
import getDataFromResp from '@/lib/util/getDataFromResp';
import { API_ADDR } from '../../../config/server';

export default async (formData: FormData): Promise<string[]> => {
  const URL = `${API_ADDR}/upload`;
  const resp: AxiosResponse = await axios.post(URL, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    }
  });

  const { files }: { files: string[] } = getDataFromResp(resp);
  return files;
}
