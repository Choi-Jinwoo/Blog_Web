import axios, { AxiosResponse } from 'axios';
import { API_ADDR } from '../../../config/server';
import IPostWrite from '@/interface/IPostWrite';

export default async (token: string | null, idx: number, post: IPostWrite) => {
  try {
    const resp: AxiosResponse = await axios.put(`${API_ADDR}/post/${idx}`,
      post,
      {
        headers: {
          'x-access-token': token,
        },
      });
  } catch (err) {
    let message = '오류가 발생하였습니다.';

    switch (err.response.message) {
      case 400:
        message = '양식을 확인하세요'
      case 403:
        message = '관리자만 접근가능합니다'
      case 404:
        message = '카테고리가 삭제되었습니다'
    }

    throw new Error(message);
  }
}