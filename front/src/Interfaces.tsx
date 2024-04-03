export interface ILoginInForm
{
    username: string,
    password: string
}

export interface ISignUpForm
{
	username: string,
	email: string,
	password: string
}

export interface IPhoto
{
	id: string,
	htmlSrcImg: string,
	main: boolean
}