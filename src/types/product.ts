export type Product = {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  active: boolean;
  categories: string[];
  featured: boolean;
  sizes: string[];
  seller?: string;
  createdAt?: string;
};
