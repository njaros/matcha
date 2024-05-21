export interface ILoginInForm
{
    username: string,
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
	love: boolean
}

export interface ISwipeFilter
{
	date_min: string,
	date_max: string,
	distance_max: number,
	hobby_ids: number[],
	ranking_gap: number
}
