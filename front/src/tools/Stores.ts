import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { Room, Me, RoomList, MessageData, msgCount, Room_info } from "./interface";
import { ISwipeFilter } from "../Interfaces"
import { DateTools } from "./DateTools";
import { isLogged } from "./TokenReader";


interface ILog {
	log: boolean;
	updateLog: (newLog: boolean) => void;
}

interface IFocus {
	focus: string;
	updateFocus: (newFocus: string) => void;
}

interface IstoreGps {
	gps: GeolocationCoordinates | undefined;
	fixed: boolean;
	updateGps: (newGps: GeolocationCoordinates | undefined) => void,
	updateGpsLatLng: (latLng: {latitude: number, longitude: number}) => void
	updateGpsFixed: (val: boolean) => void
}

interface IstoreTimeout {
	refreshTokenTimeoutId: NodeJS.Timeout | undefined,
	updateRefreshTimeout: (id: NodeJS.Timeout | undefined) => void
}

interface IstoreSocket {
	socket: Socket | null,
	updateSocket: (newSocket: Socket | null) => void
}

interface IstoreRoom {
	room: Room | undefined, 
	updateRoom: (newRoom: Room) => void
}

interface IstoreMe{
	me: Me | undefined,
	updateMe: (newMe: Me) => void
}

interface IstoreRoomInfo{
	roomInfo: Room_info,
	updateRoomInfo: (newRoomInfo: Room_info) => void
}

interface IstoreRoomList{
	roomList: RoomList[] | undefined,
	updateRoomList: (newRoomList: RoomList[] | undefined) => void
}

interface IstoreMessageList{
	messageList: MessageData[],
	updateMessageList: (newMessageList: MessageData[]) => void
}

interface IFilter{
	filter: ISwipeFilter,
	updateFilter: (newFilter: ISwipeFilter) => void
}

interface IDisplayNavBool {
	DisplayNavBool: boolean;
	updateDisplayNavBool: (updateDisplayNavBool: boolean) => void
}

interface ImsgCount {
	msgCount: {[room_id: string]: msgCount};
	updateMsgCount: (room_id: string, newCount: number) => void
}

export const storeLog = create<ILog>()((set) => ({
	log: isLogged(),
	updateLog: (newLog: boolean) => {
		console.log("change log state: ", newLog);
		set({log: newLog})
	}
}))

export const storeRoomInfo = create<IstoreRoomInfo>()((set) => ({
	roomInfo: {
		id: '',
		name: '',
		user_1: { user_id: '', photo: '', username: '' },
		user_2: { user_id: '', photo: '', username: '' }
	  },
	updateRoomInfo: (newRoomInfo: Room_info) => set({roomInfo: newRoomInfo})

}))

export const storeMsgCount = create<ImsgCount>()((set) => ({
	msgCount: {},
	updateMsgCount: (room_id: string, newCount: number) => set((state) => ({
		msgCount: {
			...state.msgCount,
			[room_id]: {count: newCount}
		}
	}))
}))

export const storeDisplayNavBool = create<IDisplayNavBool>()((set) => ({
	DisplayNavBool: false,
	updateDisplayNavBool: (newDisplayNavBool: boolean) => set({DisplayNavBool: newDisplayNavBool})
}))

export const storeMessageList = create<IstoreMessageList>()((set) => ({
	messageList: [],
	updateMessageList: (newMessageList: MessageData[]) => set({messageList: newMessageList})
}))

export const storeGeoFocus = create<IFocus>()((set) => ({
	focus: "",
	updateFocus: (newFocus: string) => set({focus: newFocus})
}))

export const storeRoomList = create<IstoreRoomList>()((set) => ({
	roomList: undefined,
	updateRoomList: (newRoomList: RoomList[] | undefined) => set({roomList: newRoomList})
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
	updateSocket: (newSocket: Socket | null) => set({socket: newSocket})
}))

export const storeGps = create<IstoreGps>()((set) => ({
	gps: undefined,
	fixed: false,
	updateGps: (newGps: GeolocationCoordinates | undefined) => set({gps: newGps}),
	updateGpsLatLng: (latLng: {latitude: number, longitude: number}) => set({
		gps: {
			accuracy: 0,
			altitude: null,
			altitudeAccuracy: null,
			speed: null,
			heading: null,
			latitude: latLng.latitude,
			longitude: latLng.longitude
		}
	}),
	updateGpsFixed: (val: boolean) => set({fixed: val})
}))

export const storeFilter = create<IFilter>()((set) => ({
	filter: {
		date_min: DateTools.dateFromAge(150),
		date_max: DateTools.dateFromAge(18),
		distance_max: 30,
		ranking_gap: 5,
		hobby_ids: []
	},
	updateFilter: (newFilter: ISwipeFilter) => set({filter: newFilter})
}))
