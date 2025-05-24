// src/app/models/post.model.ts
export interface Post {
  category: any;
is_published: any;
  id: number;
  title: string;
  content: string;
  is_favorite: boolean;
  created_at: string;
  updated_at: string;
  comments_count: number;
  comments?: Comment[];
}

export interface PostCreate {
  title: string;
  content: string;
  is_favorite: boolean;
}

// src/app/models/comment.model.ts
export interface Comment {
  id: number;
  post: number;
  post_title?: string;
  author: string;
  content: string;
  created_at: string;
  updated_at: string;
}

export interface CommentCreate {
  post: number;
  author: string;
  content: string;
}

// src/app/models/pagination.model.ts
export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

// src/app/models/stats.model.ts
export interface PostStats {
  total_posts: number;
  favorite_posts: number;
  recent_posts: Post[];
}

export interface CommentStats {
  total_comments: number;
  top_commented_posts: Array<{
    post_id: number;
    post_title: string;
    comment_count: number;
  }>;
}