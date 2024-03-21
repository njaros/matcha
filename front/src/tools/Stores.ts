import { create } from "zustand";
import TmpMan from "./TmpMan";

interface IstoreTimeout {
	refreshTokenTimeoutId: NodeJS.Timeout | undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => void
}

interface IstoreRefresh {
	refreshToken: string,
	updateRefreshToken: (newToken: string) => void
}

interface IstoreTmpMan {
	tmp: TmpMan | undefined,
	setTmp: (userId: string) => void;
}

export const storeRefresh = create<IstoreRefresh>()((set) => ({
	refreshToken: "",
	updateRefreshToken: (newToken: string) => set({ refreshToken: newToken }),
}));

export const storeTimeout = create<IstoreTimeout>()((set) => ({
	refreshTokenTimeoutId: undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => set({ refreshTokenTimeoutId: id })
}));

export const storeTmp = create<IstoreTmpMan>()((set) => ({
	tmp: undefined,
	setTmp: (userId: string) => set({ tmp: new TmpMan(userId) })
}));