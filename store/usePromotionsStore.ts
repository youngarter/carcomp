import { create } from 'zustand';
import { Promotion } from '@/types/promotion';
import { getPromotions, deletePromotion } from '@/lib/actions/promotion.actions';

interface PromotionsState {
    promotions: Promotion[];
    isLoading: boolean;
    error: string | null;
    fetchPromotions: () => Promise<void>;
    removePromotion: (id: string) => Promise<boolean>;
}

export const usePromotionsStore = create<PromotionsState>((set) => ({
    promotions: [],
    isLoading: false,
    error: null,

    fetchPromotions: async () => {
        set({ isLoading: true, error: null });
        try {
            const data = await getPromotions();
            set({ promotions: data, isLoading: false });
        } catch (err: any) {
            set({ error: err.message || 'Failed to fetch promotions', isLoading: false });
        }
    },

    removePromotion: async (id: string) => {
        try {
            await deletePromotion(id);
            set((state) => ({
                promotions: state.promotions.filter((p) => p.id !== id),
            }));
            return true;
        } catch (err: any) {
            set({ error: err.message || 'Failed to delete promotion' });
            return false;
        }
    },
}));
