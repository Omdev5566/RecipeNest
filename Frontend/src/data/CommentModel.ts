export interface Comment {
  id: number;
  author: string;
  avatar?: string;
  created_at: string;
  rating: number;
  text: string;
  likes: number;
  liked_by_me?: number;
}