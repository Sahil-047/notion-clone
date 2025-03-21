import { create } from "zustand";


type CoverImageStore = {
    isOpen: boolean;
    url?: string;
    onOpen: () => void;
    onClose: () => void;
    onReplace: (url: string) => void;
}

export const useCoverImage = create<CoverImageStore>((set) => ({
    url: undefined,
    isOpen: false,
    onOpen: () => set({isOpen: true}),
    onClose: () => set({isOpen: false}),
    onReplace: (url: string) => set ({isOpen: true, url })
    
}))
