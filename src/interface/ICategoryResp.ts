import ICategory from './ICategory';

/**
 * Response is ICategoryResp[]
 */
export default interface ICategoryResp extends ICategory {
  categories: ICategory[];
}