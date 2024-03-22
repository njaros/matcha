import { existsSync, mkdirSync, readFileSync, writeFile } from "fs";

export default class TmpMan
{
	private static instance: TmpMan;
	private static TmpPath: string;

	private constructor(userId: string) {
		TmpMan.TmpPath = "/tmp/Matcha/" + userId;
		if (!existsSync(TmpMan.TmpPath))
			mkdirSync(TmpMan.TmpPath, { recursive: true });
	}

	public static getInstance(userId?:string): TmpMan
	{
		if (!TmpMan.instance)
		{
			if (userId != undefined)
				return TmpMan.instance = new TmpMan(userId);
			throw ("Can't initialize a TmpMan instance without userId");
		}
		return TmpMan.instance;
	}

	public static async createKeyVal(key: string, val: string): Promise<void>
	{
		await writeFile(this.TmpPath + '/' + key, val, (err) => {
			console.log(err);
		});
	}

	public static readVal(key: string): string
	{
		return readFileSync(this.TmpPath + '/' + key).toString();
	}
}
