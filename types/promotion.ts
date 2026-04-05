export type Promotion = {
    id: string;
    finitionId: string;
    price: number;
    isPromotion: boolean;
    promotionalPrice?: number;
    startDate?: string; // ISO date string
    endDate?: string; // ISO date string, optional
    finition?: {
        id: string;
        name: string;
        image?: string | null;
        carModel?: {
            name: string;
            image?: string | null;
            brand?: {
                name: string;
            } | null;
        } | null;
    };
};
