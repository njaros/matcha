export interface ILoginInForm
{
    email: string,
    password: string,
	latitude?: number,
	longitude?: number
}

export interface ISignUpForm
{
	username: string,
	email: string,
	password: string,
	gender: string,
	preference: string
}

export interface IChangePass
{
	currentPassword: string,
	newPassword: string,
	newPasswordRepeat: string
}

export interface IPhoto
{
	id: string,
	htmlSrcImg: string,
	main: boolean
}

export interface IUser
{
	id: string,
	username: string,
	email: string,
	rank: number,
	birthdate: string,
	gender: string,
	biography: string,
	preference: string
}

export interface ISwipeUser
{
	id: string,
	username: string,
	age: number,
	gender: string,
	rank: number,
	biography: string,
	location: string,
	photos: IPhoto[],
	hobbies: string[],
	love: boolean,
	loved: boolean,
}

export interface IListUser
{
	id: string,
	username: string,
	at: string,
	photo: string
}

export interface ISwipeFilter
{
	date_min: string,
	date_max: string,
	distance_max: number,
	hobby_ids: number[],
	ranking_gap: number
}
