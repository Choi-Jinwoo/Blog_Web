import Vue from 'vue';
import axios, { AxiosResponse } from 'axios';
import getDataFromResp from '@/lib/util/getDataFromResp';
import { API_ADDR } from '../../../config/server';

import IPost from '@/interface/IPost';

/**
 * category, order, page ,limit 
 */
export default async (token: string | null, idx: number): Promise<IPost | undefined> => {
  let URL = `${API_ADDR}/post/${idx}`;
  const headers: any = {}

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
      case 403:
        message = '비공개 글입니다'
        break;
      case 404:
        message = '새로고침 후 이용해주세요'
        break;
    }

    Vue.toasted.error(message).goAway(800);
  }
}