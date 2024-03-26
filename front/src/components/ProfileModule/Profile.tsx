import { useState } from "react";
import Axios from "../../tools/Caller";;

const Profile = () => {
    const [file, setFile] = useState<File | null>(null);
    const [fileName, setFileName] = useState<string>("");

    const onChangeFileName = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFileName(e.target.value);
    }

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFile(e.target.files[0]);
        }
    }

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData();
        form.append("fileName", fileName);
        if (!file)
            return;
        form.append("file", file);

        try {
            const response = await Axios.post("upload", form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            });
            console.log(response);
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>PROFILE PAGE</h1>
            <form onSubmit={onSubmit}>
                <input
                    type="text"
                    name="fileName"
                    onChange={onChangeFileName}
                    value={fileName}
                />
                <input type="file" name="file" onChange={onChangeFile} />
                <button type="submit">Envoi</button>
            </form>
        </div>
    );
}

export default Profile;
