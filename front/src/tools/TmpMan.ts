import fs from "fs/promises";

// sadly fs is forbidden by web browser. So this class is unusable
export default class TmpMan
{
	private static instance: TmpMan;
	private static TmpPath: string;

	private constructor(userId: string) {
		TmpMan.TmpPath = "/tmp/Matcha/" + userId;
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

	public async createKeyVal(key: string, val: string): Promise<void>
	{
		fs.access(TmpMan.TmpPath)
		.catch
		{
			await fs.mkdir(TmpMan.TmpPath, { recursive: true });
		}
		await fs.writeFile(TmpMan.TmpPath + '/' + key, val);
	}

	public async readVal(key: string): Promise<string>
	{
		return await fs.readFile(TmpMan.TmpPath + '/' + key).toString();
	}
}
