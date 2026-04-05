import { create } from 'zustand';
import { FinitionCard } from '../types/car.types';

interface AppState {
    comparingTrims: FinitionCard[];
    selectedTrim: FinitionCard | null;
    isMenuOpen: boolean;
    searchQuery: string;

    setSelectedTrim: (trim: FinitionCard | null) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
    setSearchQuery: (query: string) => void;

    addTrimToCompare: (trim: FinitionCard) => void;
    removeTrimFromCompare: (id: string) => void;
    clearComparison: () => void;
}

export const useStore = create<AppState>((set) => ({
    comparingTrims: [],
    selectedTrim: null,
    isMenuOpen: false,
    searchQuery: '',

    setSelectedTrim: (trim: FinitionCard | null) => set({ selectedTrim: trim }),
    setIsMenuOpen: (isOpen: boolean) => set({ isMenuOpen: isOpen }),
    setSearchQuery: (query: string) => set({ searchQuery: query }),

    addTrimToCompare: (trim: FinitionCard) => set((state: AppState) => {
        if (!state.comparingTrims.find((t: FinitionCard) => t.id === trim.id)) {
            return { comparingTrims: [...state.comparingTrims, trim] };
        }
        return state;
    }),

    removeTrimFromCompare: (id: string) => set((state: AppState) => ({
        comparingTrims: state.comparingTrims.filter((t: FinitionCard) => t.id !== id)
    })),

    clearComparison: () => set({ comparingTrims: [] }),
}));
