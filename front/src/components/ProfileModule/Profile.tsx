import { useEffect, useState } from "react";
import Axios from "../../tools/Caller";
import { IPhoto , IUser} from "../../Interfaces";
import { Box, Textarea } from "@chakra-ui/react"

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
    const [errorMsg, setErrorMsg] = useState<{"section": string, "message": string}>({"section": "", "message": ""});
    const [photos, setPhotos] = useState<IPhoto[]>([]);
    const [onMount, setOnMount] = useState<boolean>(true);
    const [boolReactBug, setBoolReactBug] = useState<boolean>(true);
    const [user, setUser] = useState<IUser>();

    function getPhotos()
    {
        Axios.get("get_photos").then(
            response => {
                let newPhotos: IPhoto[] = [];
                response.data.photos.map((photo: any) => {
                    newPhotos.push({
                        "id": photo.id,
                        "htmlSrcImg": "data:".concat(photo.mimetype)
                    .concat(";base64,")
                    .concat(photo.binaries),
                        "main": photo.main
                })
            })
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
                if (error.response.data.message != undefined)
                    setErrorMsg({   "section": "photos", 
                                    "message": error.response.data.message});
                else
                    setErrorMsg({   "section": "photos",
                                    "message": "unhandled error "
                                                    .concat(error.response.status.toString())});
                console.log(error);
            }
        )
    }

    function getUserProfile()
    {
        Axios.get("get_user_by_id").then(
            response => {
                setUser(response.data);
            }
        ).catch(
            error => {
                if (error.response.data.message != undefined)
                    setErrorMsg({   "section": "getUserProfile", 
                                    "message": error.response.data.message});
                else
                    setErrorMsg({   "section": "getUserProfile",
                                    "message": "unhandled error "
                                                    .concat(error.response.status.toString())});
                console.log(error);
            }
        )
    }

    useEffect(() => {
        if (onMount == true)
        {
            getPhotos();
            getUserProfile();
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
                    setErrorMsg({"message": "", "section": ""});
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
        setAccepted([]);
        setDenied([]);
        form.append("photo_id", photoId);
        Axios.post("delete_photo", form)
        .then(response => {
            const newPhotos = photos.filter(
                photo => photo.id != photoId);
            if (response.data.mainId != "")
            {
                newPhotos.forEach(
                    photo => {
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

    const changeMainPhotoHandler = (e:any) => {
        const form = new FormData();
        const photoId = e.currentTarget.value;
        form.append("photo_id", photoId);
        Axios.post("change_main_photo", form)
        .then(response => {
            const newPhotos = photos;
            newPhotos.forEach(photo => {
                if (photo.main == true)
                photo.main = false;
                if (photo.id == photoId)
                photo.main = true;
            })
            newPhotos.sort((a, b) => {
                if (a.main == true)
                    return -1;
                if (b.main == true)
                    return 1;
                return 0;
            });
            setPhotos(newPhotos);
            setBoolReactBug(!boolReactBug);
        })
        .catch(error => {
            console.log(error);
        })
        setAccepted([]);
        setDenied([]);
    }

    function displayListPhotos(props: IPhoto[])
    {
        const list = props.map((photo: IPhoto) => {
            return <li className="photoCell" key={photo.id}>
                <img src={photo.htmlSrcImg} width="100" height="100" alt={`Photo ${photo.id}`} />
                <div>
                    <button className="delButton" onClick={delPhotoHandler} value={photo.id}>X</button>
                    {!photo.main ? <button className="mainButton" onClick={changeMainPhotoHandler} value={photo.id}>define to main photo</button> : null}
                </div>
            </li>
        });
        return (<ul className="photosList">{list}</ul>);
    }

    return (
        <Box    display="flex" flexDirection="column"
                width="100%" height="100%">
            <h1>PROFILE PAGE</h1>
            {user?
            <Box>
                <h1>BIOGRAPHY SECTION</h1>
                <Textarea>{user.biography}</Textarea>
            </Box> : null}
            <Box>
                <h1>PHOTOS SECTION</h1>
                <form onSubmit={onSubmit}>
                    <input type="file" name="file[]" onChange={onChangeFile} multiple required/>
                    <button type="submit">Envoi</button>
                    {errorMsg.section == "photos" ? <div className="errorMsg">{errorMsg.message}</div> : null}
                    {accepted.length ? <div className="acceptedFiles">succesfully upload : {displayListAccepted(accepted)}</div> : null}
                    {denied.length ? <div className="deniedFiles">failed to upload : {displayListDenied(denied)}</div> : null}
                </form>
                {displayListPhotos(photos)}
            </Box>
        </Box>
    );
}

export default Profile;
