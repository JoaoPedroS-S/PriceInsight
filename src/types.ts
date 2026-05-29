export interface Product {
    id: string;
    name: string;
    brand: string;
    category: string;
    unit: string;
    description?: string;
    imageUrl?: string;
    createdAt: number;
}

export interface Market {
    id: string;
    name: string;
    location: string;
    region: string;
    deliveryAvailable: boolean;
}

export interface PriceHistory {
    id: string;
    oldPrice: number;
    newPrice: number;
    date: number;
}

export interface PriceRecord {
    id: string;
    productId: string;
    marketId: string;
    price: number;
    isPromotion: boolean;
    promotionDetails?: string;
    date: number;
    history: PriceHistory[];
}
