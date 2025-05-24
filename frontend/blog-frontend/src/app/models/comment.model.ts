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

export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface CommentStats {
  total_comments: number;
  top_commented_posts: Array<{
    post_id: number;
    post_title: string;
    comment_count: number;
  }>;
}
