import { http } from "@/services/api";
import { Product } from "@/types/product";

type Paginated<T> = {
  docs: T[];
  totalDocs: number;
  limit: number;
  totalPages: number;
  page: number;
  pagingCounter: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  prevPage: number | null;
  nextPage: number | null;
};

export type SearchFilters = {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  order?: "ASC" | "DESC";
  page?: number;
  limit?: number;
};

const sampleProducts: Product[] = [
  {
    _id: "p1",
    name: "Set de vasos de cristal",
    description: "Juego de 6 vasos de cristal transparente de alta calidad.",
    price: 24.5,
    images: [
      "https://images.pexels.com/photos/1395308/pexels-photo-1395308.jpeg",
      "https://images.pexels.com/photos/2789328/pexels-photo-2789328.jpeg",
    ],
    active: true,
    categories: ["hogar", "cocina"],
    featured: true,
    sizes: ["200ml", "300ml"],
    seller: "defaultSeller",
  },
  {
    _id: "p2",
    name: "Lámpara de mesa vintage",
    description: "Lámpara de mesa con diseño vintage y base de madera.",
    price: 49.99,
    images: ["https://images.pexels.com/photos/1125137/pexels-photo-1125137.jpeg"],
    active: true,
    categories: ["hogar", "decoración"],
    featured: false,
    sizes: [],
    seller: "defaultSeller",
  },
  {
    _id: "p3",
    name: "Cojín decorativo",
    description: "Cojín decorativo con funda removible y lavable.",
    price: 15.75,
    images: ["https://images.pexels.com/photos/6492397/pexels-photo-6492397.jpeg"],
    active: true,
    categories: ["hogar", "textil"],
    featured: true,
    sizes: ["40x40cm", "50x50cm"],
    seller: "defaultSeller",
  },
  {
    _id: "p4",
    name: "Vaso térmico acero",
    description: "Vaso térmico de acero inoxidable 500ml.",
    price: 19.99,
    images: ["https://images.pexels.com/photos/4041392/pexels-photo-4041392.jpeg"],
    active: true,
    categories: ["outdoor"],
    featured: false,
    sizes: ["500ml"],
  },
  {
    _id: "p5",
    name: "Remera básica unisex",
    description: "Remera de algodón peinado.",
    price: 12.99,
    images: ["https://images.pexels.com/photos/10026491/pexels-photo-10026491.jpeg"],
    active: true,
    categories: ["moda", "remera"],
    featured: false,
    sizes: ["S", "M", "L"],
  },
];

export async function fetchFeatured(limit = 8): Promise<Product[]> {
  try {
    const pageRes = await http<Paginated<Product>>(`/api/product?limit=${limit}&page=1&order=DESC`);
    return pageRes.docs.filter((p) => (p as any).featured);
  } catch {
    return sampleProducts.filter((p) => p.featured).slice(0, limit);
  }
}

export async function fetchRandom(count = 4): Promise<Product[]> {
  try {
    return await http<Product[]>(`/api/product/random/${count}`);
  } catch {
    // simple shuffle from mocks
    return [...sampleProducts].sort(() => 0.5 - Math.random()).slice(0, count);
  }
}

export async function searchProducts(filters: SearchFilters): Promise<Paginated<Product>> {
  const { q, category, minPrice, maxPrice, order = "ASC", page = 1, limit = 8 } = filters;
  const params = new URLSearchParams();
  params.set("limit", String(limit));
  params.set("page", String(page));
  params.set("order", order);
  if (q) params.set("q", q);
  if (category) params.set("category", category);
  if (minPrice != null) params.set("minPrice", String(minPrice));
  if (maxPrice != null) params.set("maxPrice", String(maxPrice));

  try {
    return await http<Paginated<Product>>(`/api/product?${params.toString()}`);
  } catch {
    // Filter mocks
    let docs = sampleProducts.filter((p) => p.active);
    if (q) docs = docs.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
    if (category) docs = docs.filter((p) => p.categories.includes(category));
    if (minPrice != null) docs = docs.filter((p) => p.price >= minPrice);
    if (maxPrice != null) docs = docs.filter((p) => p.price <= maxPrice);
    docs = docs.sort((a, b) => (order === "ASC" ? a.price - b.price : b.price - a.price));
    const totalDocs = docs.length;
    const start = (page - 1) * limit;
    const pageDocs = docs.slice(start, start + limit);
    const totalPages = Math.max(1, Math.ceil(totalDocs / limit));
    return {
      docs: pageDocs,
      totalDocs,
      limit,
      totalPages,
      page,
      pagingCounter: start + 1,
      hasPrevPage: page > 1,
      hasNextPage: page < totalPages,
      prevPage: page > 1 ? page - 1 : null,
      nextPage: page < totalPages ? page + 1 : null,
    };
  }
}

export async function getProductById(id: string): Promise<Product> {
  try {
    return await http<Product>(`/api/product/${id}`);
  } catch {
    const found = sampleProducts.find((p) => p._id === id) || sampleProducts[0];
    return found;
  }
}

export async function createProduct(input: Partial<Product> & { categories?: string[] }): Promise<Product> {
  try {
    return await http<Product>(`/api/product`, {
      method: 'POST',
      body: JSON.stringify(input),
    });
  } catch {
    const mock: Product = {
      _id: Math.random().toString(36).slice(2),
      name: input.name || "Nuevo producto",
      description: input.description || "",
      price: input.price || 0,
      images: input.images || [],
      active: input.hasOwnProperty('active') ? Boolean(input.active) : true,
      categories: input.categories || [],
      featured: Boolean((input as any).featured),
      sizes: (input as any).sizes || [],
      seller: 'defaultSeller',
      createdAt: new Date().toISOString(),
    };
    sampleProducts.push(mock);
    return mock;
  }
}

export async function updateProduct(id: string, input: Partial<Product>): Promise<Product> {
  try {
    return await http<Product>(`/api/product/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(input),
    });
  } catch {
    const idx = sampleProducts.findIndex((p) => p._id === id);
    if (idx >= 0) sampleProducts[idx] = { ...sampleProducts[idx], ...input } as Product;
    return sampleProducts[idx];
  }
}

export async function deleteProduct(id: string): Promise<void> {
  try {
    await http<void>(`/api/product/${id}`, { method: 'DELETE' });
  } catch {
    const idx = sampleProducts.findIndex((p) => p._id === id);
    if (idx >= 0) sampleProducts.splice(idx, 1);
  }
}

export async function getStats(): Promise<{ active: number; total: number; inactive: number }> {
  try {
    return await http(`/api/product/stats`);
  } catch {
    const active = sampleProducts.filter((p) => p.active).length;
    const total = sampleProducts.length;
    return { active, total, inactive: total - active };
  }
}
