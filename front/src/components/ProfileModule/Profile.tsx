import { useEffect, useState } from "react";
import Axios from "../../tools/Caller";
import { IPhoto } from "../../Interfaces";

function displayListAccepted(props: string[])
{
    const list = props.map((elt, key) => {
        return <li key={key}>{elt}</li>
    });
    return (<ul>{list}</ul>);
}

function displayListDenied(props: {"filename": string, "reason": string}[])
{
    const list = props.map((elt, key) => {
        return <li key={key}>{elt.filename}: {elt.reason}</li>
    });
    return (<ul>{list}</ul>);
}

const Profile = () => {
    const [files, setFiles] = useState<FileList | null>(null);
    const [accepted, setAccepted] = useState<string[]>([]);
    const [denied, setDenied] = useState<{"filename": string, "reason": string}[]>([]);
    const [errorMsg, setErrorMsg] = useState<string>("");
    const [photos, setPhotos] = useState<IPhoto[]>([]);
    const [onMount, setOnMount] = useState<boolean>(true);

    function getPhotos()
    {
        Axios.get("get_photos").then(
            response => {
                let newPhotos: IPhoto[] = [];
                response.data.photos.map(photo => {
                    newPhotos.push({
                        "id": photo.id,
                        "htmlSrcImg": "data:".concat(photo.mimetype)
                    .concat(";base64,")
                    .concat(photo.binaries),
                        "main": photo.main
                })
            })
            console.log("newtof", newPhotos);
            setPhotos(newPhotos.sort((a, b) => {
                if (a.main == true)
                    return -1;
                if (b.main == true)
                    return 1;
                return 0;
            }));
        }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
        if (onMount == true)
        {
            getPhotos();
            setOnMount(false);    
        }
        else
        {
            if (accepted.length >= 1)
            {
                getPhotos();
            }
        }
    }, [accepted])

    const onChangeFile = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files.length > 0) {
            setFiles(e.target.files);
        }
    }

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const form = new FormData();
        if (!files)
            return;
        for (let i = 0; i < files.length; ++i)
            form.append("file[]", files[i]);
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

    const delPhotoHandler = (e: any) => {
        const form = new FormData();
        const photoId = e.currentTarget.value;
        form.append("photo_id", photoId);
        Axios.post("delete_photo", form)
        .then(response => {
            const newPhotos = photos.filter(
                photo => photo.id != photoId);
            if (response.data.mainId != "")
            {
                newPhotos.forEach(
                    photo =>
                    {
                        if (photo.id == response.data.mainId)
                        photo.main = true;
                });
                newPhotos.sort((a, b) => {
                    if (a.main == true)
                        return -1;
                    if (b.main == true)
                        return 1;
                    return 0;
                });
            }
            setPhotos(newPhotos);
        })
        .catch(error => {
            console.log(error);
        });
    }

    function displayListPhotos(props: IPhoto[])
    {
        const list = props.map((photo: IPhoto) => {
            return <li key={photo.id}>
                <img src={photo.htmlSrcImg} alt={`Photo ${photo.id}`} />
                <button onClick={delPhotoHandler} value={photo.id}>X</button>
                {!photo.main ? <button>define to main photo</button> : null}
            </li>
        });
        return (<ul>{list}</ul>);
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
            {displayListPhotos(photos)}
        </div>
    );
}

export default Profile;
