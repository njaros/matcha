import { useState } from "react";
import Axios from "../../tools/Caller";

function displayList(props: string[])
{
    const list = props.map((elt => {
        return <li>{elt}</li>
    }))
    return (<ul>{list}</ul>);
}

const Profile = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [accepted, setAccepted] = useState<string[]>([]);
    const [denied, setDenied] = useState<string[]>([]);

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            console.log("target :", e.target.files);
            setFiles(e.target.files);
        }
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(files);
        const form = new FormData();
        if (!files)
            return;
        for (let i = 0; i < files.length; ++i)
            form.append("file[]", files[i]);
        console.log(form.getAll("file[]"));
        try {
            Axios.post("upload", form, {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }).then(
                response => {
                    console.log(response);
                    setAccepted(response.data.accepted);
                    setDenied(response.data.denied);
                }
            ).catch(
                error => {
                    console.log(error);
                    if (error.response != undefined)
                        setDenied(error.response.data);
                }
            )
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            <h1>PROFILE PAGE</h1>
            <form onSubmit={onSubmit}>
                <input type="file" name="file[]" onChange={onChangeFile} multiple required/>
                <button type="submit">Envoi</button>
                {accepted.length ? <div className="acceptedFiles">succesfully upload : {displayList(accepted)}</div> : null}
                {denied.length ? <div className="deniedFiles">failed to upload : {displayList(denied)}</div> : null}
            </form>
        </div>
    );
}

export default Profile;
