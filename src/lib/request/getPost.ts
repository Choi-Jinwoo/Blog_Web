import axios, { AxiosResponse } from 'axios';
import getDataFromResp from '@/lib/util/getDataFromResp';
import { API_ADDR } from '../../../config/server';

import IPost from '@/interface/IPost';

/**
 * category, order, page ,limit 
 */
export default async (token: string | null, idx: number, isImageRaw?: boolean): Promise<IPost | undefined> => {
  let URL = `${API_ADDR}/post/${idx}`;
  const headers: any = {}

  if (isImageRaw)
    URL = URL.concat('?image=raw');

  if (token)
    headers['x-access-token'] = token;

  try {
    const resp: AxiosResponse = await axios.get(URL, {
      headers,
    });

    const { post }: { post: IPost } = getDataFromResp(resp);
    return post;
  } catch (err) {
    let message = '오류가 발생하였습니다';

    switch (err.response.status) {
      case 400:
        message = '존재하지 않는 글입니다'
        break;
      case 403:
        message = '비공개 글입니다'
        break;
      case 404:
        message = '삭제된 글입니다'
        break;
    }

    throw new Error(message);
  }
}