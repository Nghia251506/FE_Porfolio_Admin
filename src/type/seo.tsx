export interface SeoMetadata {
  pageUrl: string;
  title: string;
  description: string;
  keywords: string;
  ogImage: string;
  canonicalUrl: string;
  h1Override: string;
}

export interface SeoState {
  currentSeo: SeoMetadata | null;
  isLoading: boolean;
  error: string | null;
}