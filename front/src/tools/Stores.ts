import { create } from "zustand";

export const store = create((set) => ({
	refreshToken: "",
	updateRefreshToken: (newToken: string) => set({ refreshToken: newToken })
}))