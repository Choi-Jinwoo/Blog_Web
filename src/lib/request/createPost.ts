import axios, { AxiosResponse } from 'axios';
import { API_ADDR } from '../../../config/server';
import IPostWrite from '@/interface/IPostWrite';

export default async (token: string | null, post: IPostWrite) => {
  try {
    console.log(post);
    const resp: AxiosResponse = await axios.post(`${API_ADDR}/post`,
      post,
      {
        headers: {
          'x-access-token': token,
        },
      });
  } catch (err) {
    let message = '오류가 발생하였습니다.';

    switch (err.response.status) {
      case 400:
        message = '양식을 확인하세요'
        break;
      case 401:
        message = '관리자만 접근가능합니다'
        break;
      case 404:
        message = '카테고리가 삭제되었습니다'
        break;
      case 410:
        message = '로그인 정보가 만료되었습니다'
        break;
    }

    throw new Error(message);
  }
}