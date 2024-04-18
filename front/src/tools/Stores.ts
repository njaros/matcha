import { Socket, io } from "socket.io-client";
import { create } from "zustand";

interface IGps {
	latitude: number,
	longitude: number
}

interface IstoreGps {
	gps: IGps | undefined;
	updateGps: (newGps: IGps | undefined) => void
}

interface IstoreTimeout {
	refreshTokenTimeoutId: NodeJS.Timeout | undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => void
}

interface IstoreSocket {
	socket: Socket | null,
	updateSocket: (newSocket: Socket) => void
}

export const storeTimeout = create<IstoreTimeout>()((set) => ({
	refreshTokenTimeoutId: undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => set({ refreshTokenTimeoutId: id })
}))

export const storeSocket = create<IstoreSocket>()((set) => ({
	socket: null,
	updateSocket: (newSocket: Socket) => set({socket: newSocket})
}))

export const storeGps = create<IstoreGps>()((set) => ({
	gps: undefined,
	updateGps: (newGps: IGps | undefined) => set({gps: newGps})
}))
