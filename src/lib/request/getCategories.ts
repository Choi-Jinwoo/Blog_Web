import Vue from 'vue';
import axios, { AxiosResponse } from 'axios';
import getDataFromResp from '@/lib/util/getDataFromResp';
import { API_ADDR } from '../../../config/server';

import ICategoryResp from '@/interface/ICategoryResp';

export default async (): Promise<ICategoryResp[] | undefined> => {
  try {
    const resp: AxiosResponse = await axios.get(`${API_ADDR}/category`);
    const { categories }: { categories: ICategoryResp[] } = getDataFromResp(resp);
    return categories;
  } catch (err) {
    let message = '오류가 발생하였습니다';
    throw new Error(message);
  }
}