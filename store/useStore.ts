import { create } from 'zustand';
import { Car } from '../types/car';

interface AppState {
    comparingTrims: Car[];
    selectedTrim: Car | null;
    isMenuOpen: boolean;
    searchQuery: string;

    setSelectedTrim: (trim: Car | null) => void;
    setIsMenuOpen: (isOpen: boolean) => void;
    setSearchQuery: (query: string) => void;

    addTrimToCompare: (trim: Car) => void;
    removeTrimFromCompare: (id: string) => void;
    clearComparison: () => void;
}

export const useStore = create<AppState>((set) => ({
    comparingTrims: [],
    selectedTrim: null,
    isMenuOpen: false,
    searchQuery: '',

    setSelectedTrim: (trim: Car | null) => set({ selectedTrim: trim }),
    setIsMenuOpen: (isOpen: boolean) => set({ isMenuOpen: isOpen }),
    setSearchQuery: (query: string) => set({ searchQuery: query }),

    addTrimToCompare: (trim: Car) => set((state: AppState) => {
        if (!state.comparingTrims.find((t: Car) => t.id === trim.id)) {
            return { comparingTrims: [...state.comparingTrims, trim] };
        }
        return state;
    }),

    removeTrimFromCompare: (id: string) => set((state: AppState) => ({
        comparingTrims: state.comparingTrims.filter((t: Car) => t.id !== id)
    })),

    clearComparison: () => set({ comparingTrims: [] }),
}));
