import { useEffect, useState } from "react";
import { IListUser } from "../../../Interfaces";
import Axios from "../../../tools/Caller";
import { parsePhotoFromBack } from "../../../tools/Thingy";
import DisplayList from "./DisplayList";

export default function LikeList() {
    const [ userList, setUserList ] = useState<IListUser[]>([])

    useEffect(() => {
        Axios.get("relationship/get_liked_not_matched").then(
            response => {
                let newList: IListUser[] = [];
                response.data.map((elt: any) => {
                    newList.push({
                        id: elt.id,
                        username: elt.username,
                        at: "",
                        photo: parsePhotoFromBack(elt)})
                })
                setUserList(newList);
            }
        ).catch(
            err => {
                console.warn(err);
            }
        )
    }, [])

    return <DisplayList list={userList} enableDate={false} name={"Liked"}/>
}