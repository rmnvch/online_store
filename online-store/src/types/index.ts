export interface IProductCard {
    brand: string;
    model: string;
    year: string;
    color: string;
    price: number;
    overview: string;
    img: string;
    id: number;
    type: string;
    availability: number;
    name: string;
}

export type TCallback = {
    (data: IProductCard[]): void;
};

export interface IStoredFilterOptions {
    search?: string;
    brand?: string[];
    type?: string[];
    year?: number[];
    price?: number[];
    sortOption: string;
    stock?: string;
}

export enum SortTypes {
    'a-z' = 'a-z',
    'z-a' = 'z-a',
    'old-new' = 'old-new',
    'new-old' = 'new-old',
    'high-low' = 'high-low',
    'low-high' = 'low-high',
}

export interface ICart {
    id: number;
    qty: number;
}
