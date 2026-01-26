export interface IBanner {
  _id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  linkUrl?: string; // Optional link when banner is clicked
  linkText?: string; // Text for the link button
  isActive: boolean;
  order: number; // For ordering banners
  startDate?: Date; // When banner should start showing
  endDate?: Date; // When banner should stop showing
  clicks?: number; // Track clicks for analytics
  createdAt?: Date;
  updatedAt?: Date;
}

