export default interface ICategory {
  idx: number;
  name: string;
  is_wrapper: boolean;
  fk_category_idx: number | null;
};
