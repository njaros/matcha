import { existsSync, mkdirSync, open, readFile, readFileSync, writeFile } from "fs";

export default class TmpMan
{
	private TmpPath: string;

	constructor(userId: string) {
		this.TmpPath = "/tmp/Matcha/" + userId;
		if (!existsSync(this.TmpPath))
			mkdirSync(this.TmpPath, { recursive: true });
	}

	public async createKeyVal(key: string, val: string): Promise<void>
	{
		await writeFile(this.TmpPath + '/' + key, val, (err) => {
			console.log(err);
		});
	}

	public readVal(key: string): string
	{
		return readFileSync(this.TmpPath).toString();
	}
}