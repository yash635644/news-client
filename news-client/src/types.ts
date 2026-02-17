
export type Category = 'India' | 'Originals' | 'World' | 'Sports' | 'Technology' | 'Education' | 'Environment' | 'Business';

export interface NewsItem {
  id: string;
  title: string;
  summary: string[]; // Array of bullet points
  content: string;
  category: Category;
  tags: string[];
  imageUrl: string;
  videoUrl?: string;
  source?: string;
  sourceLogo?: string; // URL to source logo or favicon
  url?: string; // Link to original article
  author: string;
  publishedAt: string;
  isBreaking: boolean;
  isFeatured: boolean;
  isAiGenerated: boolean;
}

export interface UserProfile {
  id: string;
  email: string;
  role: 'admin' | 'user';
}

export interface Stats {
  totalNews: number;
  aiGeneratedCount: number;
  categoryBreakdown: Record<string, number>;
}
