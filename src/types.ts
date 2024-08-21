export type ErrorResponse = {
  response: {
    data : {
      error: string
    }
  };
}


export type Course = {
  id: number;
  title: string;
  description: string;
  author: string;
  thumbnail: string;
  preview: string;
  rating: number;
  num_reviews: number;
  duration: string;
  is_active: boolean;
  sort_order: number;
  on: boolean;
  created_at: string;
};
