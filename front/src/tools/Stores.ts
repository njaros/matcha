import { create } from "zustand";

interface IstoreTimeout {
	refreshTokenTimeoutId: NodeJS.Timeout | undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => void
}

interface IstoreRefresh {
	refreshToken: string,
	updateRefreshToken: (newToken: string) => void
}

export const storeRefresh = create<IstoreRefresh>()((set) => ({
	refreshToken: "",
	updateRefreshToken: (newToken: string) => set({ refreshToken: newToken }),
}))

export const storeTimeout = create<IstoreTimeout>()((set) => ({
	refreshTokenTimeoutId: undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => set({ refreshTokenTimeoutId: id })
}))