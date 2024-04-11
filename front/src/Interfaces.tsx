export interface ILoginInForm
{
    username: string,
    password: string
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
	birthDate: string,
	gender: string,
	biography: string,
	preference: string
}