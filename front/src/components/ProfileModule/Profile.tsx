import { useEffect, useState } from "react";
import Axios from "../../tools/Caller";

function displayListAccepted(props: string[])
{
    const list = props.map((elt, key) => {
        return <li key={key}>{elt}</li>
    })
    return (<ul>{list}</ul>);
}

function displayListDenied(props: {"filename": string, "reason": string}[])
{
    const list = props.map((elt, key) => {
        return <li key={key}>{elt.filename}: {elt.reason}</li>
    })
    return (<ul>{list}</ul>);
}

const Profile = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [accepted, setAccepted] = useState<string[]>([]);
    const [denied, setDenied] = useState<{"filename": string, "reason": string}[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [photos, setPhotos] = useState<{"id": string, "mimetype": string, "imageUrl": string}[]>([])

    useEffect(() => {
        Axios.get("get_photos").then(
            response => {
                let newPhotos: {"id": string, "mimetype": string, "imageUrl": string}[] = [];
                for (let i = 0; i < response.data.photos.length; ++i)
                {
                    let photo = response.data.photos[i];
                    console.log(photo);
                    newPhotos.push({
                        "id": photo.id,
                        "mimetype": photo.mimetype,
                        "imageUrl": URL.createObjectURL(new Blob([atob(photo.binaries)], {type: photo.mimetype}))
                    })
                }
                setPhotos(newPhotos);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }, [])

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
                    setErrorMsg("");
                    setAccepted(response.data.accepted);
                    setDenied(response.data.denied);
                }
            ).catch(
                error => {
                    console.log(error);
                    if (error.response != undefined)
                    {
                        setErrorMsg(error.response.data.message)
                        setAccepted([]);
                        setDenied([]);
                    }
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
                {errorMsg ? <div className="errorMsg">{errorMsg}</div> : null}
                {accepted.length ? <div className="acceptedFiles">succesfully upload : {displayListAccepted(accepted)}</div> : null}
                {denied.length ? <div className="deniedFiles">failed to upload : {displayListDenied(denied)}</div> : null}
            </form>
            {photos.map(photo => (
                <div key={photo.id} className="photo">
                    <img src={photo.imageUrl} alt={`Photo ${photo.id}`} />
                </div>
            ))}
        </div>
    );
}

export default Profile;
