import { useEffect, useState } from "react";
import { IListUser } from "../../../Interfaces";
import Axios from "../../../tools/Caller";
import { parsePhotoFromBack } from "../../../tools/Thingy";
import DisplayList from "./DisplayList";

export default function MatchList() {
    const [ userList, setUserList ] = useState<IListUser[]>([])
    const [loading, setLoading] = useState<boolean>(true)

    useEffect(() => {
        setLoading(true)
        Axios.get("relationship/get_matches").then(
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
        ).finally(
            () => {
                setLoading(false);
            }
        )
    }, [])

    return <DisplayList list={userList} enableDate={false} name="Matches" loading={loading}/>
}