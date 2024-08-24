export type ErrorResponse = {
  response: {
    data : {
      error: string
    }
  };
}

export type User = {
  id: number;
  email: string;
  name: string;
  surname: string;
  thumbnail: string;
  is_admin: boolean;
  special_apps: boolean;
  is_active: boolean;
  verified: boolean;
  pc: string;
  os: string;
  created_at: string;
};

export type UserResponse = {
  data: User[];
  totalCount: number;
  previousId: number | null;
  nextId: number | null;
}

export type SearchParam = {
  searchParam: string;
  pageParam: number;
  active: number | string;
  admin: number | string;
  special: number | string;
  verified: number | string;
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
  allowed: boolean;
  created_at: string;
};
