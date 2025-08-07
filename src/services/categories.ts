import { http } from "@/services/api";
import { searchProducts } from "./products";

export async function getCategories(): Promise<string[]> {
  try {
    return await http<string[]>(`/api/categories`);
  } catch {
    // Derivar de productos mock
    const res = await searchProducts({ limit: 100, page: 1 });
    const set = new Set<string>();
    res.docs.forEach((p) => p.categories.forEach((c) => set.add(c)));
    return Array.from(set);
  }
}
