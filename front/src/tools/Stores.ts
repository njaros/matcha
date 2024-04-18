import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { Room, Me, RoomList } from "./interface";


interface IstoreTimeout {
	refreshTokenTimeoutId: NodeJS.Timeout | undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => void
}

interface IstoreSocket {
	socket: Socket | null,
	updateSocket: (newSocket: Socket) => void
}

interface IstoreRoom {
	room: Room | undefined, 
	updateRoom: (newRoom: Room) => void
}

interface IstoreMe{
	me: Me | undefined,
	updateMe: (newMe: Me) => void
}

interface IstoreRoomList{
	roomList: RoomList[] | undefined,
	updateRoomList: (newRoomList: RoomList[]) => void
}

export const storeRoomList = create<IstoreRoomList>()((set) => ({
	roomList: undefined,
	updateRoomList: (newRoomList: RoomList[]) => set({roomList: newRoomList})
}))

export const storeMe = create<IstoreMe>()((set) => ({
	me: undefined,
	updateMe: (newMe: Me) => set({me: newMe})
}))

export const storeRoom = create<IstoreRoom>()((set) => ({
	room: undefined,
	updateRoom: (newRoom: Room) => set({room: newRoom})
}))

export const storeTimeout = create<IstoreTimeout>()((set) => ({
	refreshTokenTimeoutId: undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => set({ refreshTokenTimeoutId: id })
}))

export const storeSocket = create<IstoreSocket>()((set) => ({
	socket: null,
	updateSocket: (newSocket: Socket) => set({socket: newSocket})
}))