export type ProductWithCategory = {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription: string | null;
  price: number;
  compareAtPrice: number | null;
  images: string;
  photos: string;
  categoryId: string;
  category: { id: string; name: string; slug: string; group: string; icon: string | null };
  customizable: boolean;
  stock: number;
  isFeatured: boolean;
  isNew: boolean;
  isBestSeller: boolean;
  minQuantity: number;
  rating: number;
  reviewsCount: number;
};

export type CartLine = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string;
  categoryIcon: string;
  quantity: number;
  personalization: string;
  minQuantity: number;
};

export type CategoryGroup = {
  group: string;
  categories: {
    name: string;
    slug: string;
    icon: string;
    description: string;
  }[];
};
