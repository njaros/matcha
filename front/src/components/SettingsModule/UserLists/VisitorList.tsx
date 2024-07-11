import { useEffect, useState } from "react";
import { IListUser } from "../../../Interfaces";
import Axios from "../../../tools/Caller";
import { parsePhotoFromBack } from "../../../tools/Thingy";
import DisplayList from "./DisplayList";

export default function VisitorList() {
    const [ userList, setUserList ] = useState<IListUser[]>([])

    useEffect(() => {
        Axios.get("user/get_visits_history").then(
            response => {
                let newList: IListUser[] = [];
                response.data.map((elt: any) => {
                    newList.push({
                        id: elt.id,
                        username: elt.username,
                        at: elt.at,
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

    return <DisplayList list={userList} enableDate={true} name="Visitors"/>
}