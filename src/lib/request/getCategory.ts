import Vue from 'vue';
import axios, { AxiosResponse } from 'axios';
import getDataFromResp from '@/lib/util/getDataFromResp';
import { API_ADDR } from '../../../config/server';

import ICategory from '@/interface/ICategory';

export default async (idx: number): Promise<ICategory | undefined | null> => {
  try {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/category/${idx}`);
    const { category }: { category: ICategory } = getDataFromResp(resp);
    return category;
  } catch (err) {
    let message = '오류가 발생하였습니다';

    switch (err.response.status) {
      case 404:
        return null;
    }

    throw new Error(message);
  }
}