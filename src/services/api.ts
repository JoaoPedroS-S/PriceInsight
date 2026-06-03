import { Product, Market, PriceRecord } from '../types';

const API_BASE_URL = 'https://priceinsight-backend.onrender.com';

const fetchJson = async (url: string, options?: RequestInit) => {
  const res = await fetch(`${API_BASE_URL}${url}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
  });
  
  if (!res.ok) throw new Error(`API Error: ${res.statusText}`);
  if (res.status === 204) return null;
  return res.json();
};

export const api = {
  products: {
    list: () => fetchJson('/api/products'),
    create: (data: Omit<Product, 'id' | 'createdAt'>) => 
      fetchJson('/api/products', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Product>) => 
      fetchJson(`/api/products/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/api/products/${id}`, { method: 'DELETE' }),
  },
  markets: {
    list: () => fetchJson('/api/markets'),
    create: (data: Omit<Market, 'id'>) => 
      fetchJson('/api/markets', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<Market>) => 
      fetchJson(`/api/markets/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/api/markets/${id}`, { method: 'DELETE' }),
  },
  prices: {
    list: () => fetchJson('/api/prices'),
    byProduct: (productId: string) => fetchJson(`/api/prices/product/${productId}`),
    create: (data: Omit<PriceRecord, 'id' | 'date' | 'history'>) => 
      fetchJson('/api/prices', { method: 'POST', body: JSON.stringify(data) }),
    update: (id: string, data: Partial<PriceRecord>) => 
      fetchJson(`/api/prices/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => fetchJson(`/api/prices/${id}`, { method: 'DELETE' }),
  }
};
