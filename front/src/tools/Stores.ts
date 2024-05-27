import { Socket, io } from "socket.io-client";
import { create } from "zustand";
import { Room, Me, RoomList, MessageData, msgCount } from "./interface";
import { LatLng } from "leaflet";
import { ISwipeFilter } from "../Interfaces"
import { DateTools } from "./DateTools";


interface IFocus {
	focus: string;
	updateFocus: (newFocus: string) => void
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

interface IstoreMessageList{
	messageList: MessageData[],
	updateMessageList: (newMessageList: MessageData[]) => void
}

interface IFilter{
	filter: ISwipeFilter,
	updateFilter: (newFilter: ISwipeFilter) => void
}

interface IConvBool {
	convBool: boolean;
	updateConvBool: (updateConvBool: boolean) => void
}

interface ImsgCount {
	msgCount: msgCount[];
	updateMsgCount: (updateMsgCount: msgCount[]) => void
}

export const storeMsgCount = create<ImsgCount>()((set) => ({
	msgCount: [],
	updateMsgCount: (newMsgCount: msgCount[]) => set({msgCount: newMsgCount})
}))

export const storeConvBool = create<IConvBool>()((set) => ({
	convBool: false,
	updateConvBool: (newConvBool: boolean) => set({convBool: newConvBool})
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
