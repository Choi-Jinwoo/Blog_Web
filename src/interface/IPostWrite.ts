export default interface IPostWrite {
  title: string;
  content: string;
  is_private: boolean;
  is_temp: boolean;
  category_idx: number;
  thumbnail: string | null;
}