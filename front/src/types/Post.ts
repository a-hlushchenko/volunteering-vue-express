//тип для об'єкту поста

export interface Post {
  id: number;
  title: string;
  description: string;
  phone: string;
  phone2: string;
  email: string;
  post_end: Date;
  type_id: number;
  city: { id: number; name: string; post_city: Object }[];
  category: { id: number; name: string; post_city: Object }[];
}
