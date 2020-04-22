import Vue from 'vue';
import axios, { AxiosResponse } from 'axios';
import getDataFromResp from '@/lib/util/getDataFromResp';
import { API_ADDR } from '../../../config/server';

import IPost from '@/interface/IPost';

type GetPostsArgs = {
  category?: number;
  order?: string;
  page: number;
  limit: number
}

/**
 * category, order, page ,limit 
 */
export default async (token: string | null, args: GetPostsArgs): Promise<IPost[] | undefined> => {
  const { category, order, page, limit } = args;

  let URL = `${API_ADDR}/post?page=${page}&limit=${limit}`;
  const headers: any = {}

  if (Number.isInteger(category as number))
    URL.concat(`&category=${category}`);

  if (order)
    URL.concat(`&order=${order}`);


  if (token)
    headers['x-access-token'] = token;

  try {
    const resp: AxiosResponse = await axios.get(URL, {
      headers,
    });

    const { posts }: { posts: IPost[] } = getDataFromResp(resp);
    return posts;
  } catch (err) {
    // FIXME: throw Error
    let message = '오류가 발생하였습니다';

    switch (err.response.status) {
      case 404:
        message = '새로고침 후 이용해주세요'
        break;
    }

    Vue.toasted.error(message).goAway(800);
  }
}