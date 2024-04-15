import { useEffect, useState } from "react";
import Axios from "../../tools/Caller";
import { IPhoto , IUser} from "../../Interfaces";
import { Box, Textarea, List, ListItem, Image, Button, FormControl, Input, Text, Center } from "@chakra-ui/react"
import { useForm } from "react-hook-form";

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
    const [readOnly, setReadOnly] = useState<boolean>(true);
    const { register, handleSubmit, setValue } = useForm<IUser>();

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
                setValue("username", response.data.username);
                setValue("email", response.data.email);
                setValue("birthDate", response.data.birthDate);
                setValue("biography", response.data.biography);
                setValue("gender", response.data.gender);
                setValue("preference", response.data.preference);
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

    const toggleReadonly = () =>
    {
        setReadOnly(!readOnly);
        if(user)
        {
            setValue("username", user.username);
            setValue("email", user.email);
            setValue("birthDate", user.birthDate);
            setValue("biography", user.biography);
            setValue("gender", user.gender);
            setValue("preference", user.preference);
        }
    }

    function displayListPhotos(props: IPhoto[])
    {
        const list = props.map((photo: IPhoto) => {
            return <ListItem display="flex" flexDirection="row" margin="5%" className="photoCell" key={photo.id}>
                <Image src={photo.htmlSrcImg} width="100" height="100" alt={`Photo ${photo.id}`} />
                <Box display="flex" flexDirection="column">
                    <Button margin="4px" className="delButton" onClick={delPhotoHandler} value={photo.id}>X</Button>
                    {!photo.main ? <Button margin="4px" className="mainButton" onClick={changeMainPhotoHandler} value={photo.id}>define to main photo</Button> : null}
                </Box>
            </ListItem>
        });
        return (<List className="photosList">{list}</List>);
    }

    const InputUser = (props: {readonly: boolean, val: string, title: "email" | "username" | "birthDate" | "gender" | "biography" | "preference"}) => {
        return (
            <Box display="flex" flexDirection="row" justifyContent="flex-start" alignItems="center">
                <Text width="30%" marginRight="5%" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">Your {props.title}</Text>
                {props.readonly ?
                <Input margin="4px" readOnly value={props.val}/> :
                <Input margin="4px" {...register(props.title)} />
                }
            </Box>
        )
    }

    const InputUserBiography = (props: {readonly: boolean, val: string}) => {
        return (
            <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center">
                <Text width="30%" marginRight="5%" textOverflow="ellipsis" overflow="hidden" whiteSpace="nowrap">Your Biography</Text>
                {props.readonly ?
                <Textarea readOnly defaultValue={props.val}/> :
                <Textarea {...register("biography")}/>
                }
            </Box>
        )
    }

    const profileSubmit = (data: IUser) => {
        console.log("data = ", data);
        const form = new FormData();
        if (data.username != user?.username)
            form.append("username", data.username);
        if (data.email != user?.email)
            form.append("email", data.email);
        if (data.birthDate != user?.birthDate)
            form.append("birthDate", data.birthDate);
        if (data.biography != user?.biography)
            form.append("biography", data.biography);
        if (data.gender != user?.gender)
            form.append("gender", data.gender);
        if (data.preference != user?.preference)
            form.append("preference", data.preference);
        Axios.post("update_user", form).then(
            response => {
                console.log(response);
                setUser(response.data.updated_user)
            }
        ).catch(
            error => {
                console.log(error);
            }
        ).finally(
            () => {
                toggleReadonly();
            }
        )
    }

    return (
        <Box    display="flex" flexDirection="column"
                width="100%" height="100%">
            <Center fontSize="xxx-large">PROFILE PAGE</Center>
            {user?
            <form onSubmit={handleSubmit(profileSubmit)}>
                <FormControl    display="flex" flexDirection="column">
                    <Box display="flex" flexDirection="column" margin = "5%">
                        <Center marginBottom="5%">ACCOUNT INFO</Center>
                        <InputUser readonly={readOnly} val={user.username} title="username"/>
                        <InputUser readonly={readOnly} val={user.email} title="email"/>
                        <InputUser readonly={readOnly} val={user.birthDate} title="birthDate"/>
                        <InputUser readonly={readOnly} val={user.gender} title="gender"/>
                        <InputUser readonly={readOnly} val={user.preference} title="preference"/>
                        <InputUserBiography readonly={readOnly} val={user.biography}/>
                    </Box>
                    {readOnly?
                    <Button onClick={toggleReadonly}>Modify profile</Button> :
                    <Box display="flex" >
                        <Button width="80%" onClick={toggleReadonly}>Cancel</Button>
                        <Button marginLeft="5%" width="15%" type="submit">Send</Button>
                    </Box>
                    }
                </FormControl>
            </form>
            : null}
            <Box margin="5%">
                <h1>PHOTOS SECTION</h1>
                <Box margin="5%">
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
        </Box>
    );
}

export default Profile;
