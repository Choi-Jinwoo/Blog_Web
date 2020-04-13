export default interface IPost {
  idx: number;
  title: string;
  content?: string;
  view: boolean;
  is_deleted?: boolean;
  is_private?: boolean;
  is_temp: boolean;
  fk_category_idx: number | null;
  thumbnail: string | null;
  released_at: Date | null;
  updated_at: Date | null;
}