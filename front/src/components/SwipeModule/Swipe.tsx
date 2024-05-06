import { useEffect, useRef, useState } from "react";
import { ISwipeUser } from "../../Interfaces";
import Axios from "../../tools/Caller";

const Swipe = () => {
    const swipeList = useRef<ISwipeUser[] | null>(null)

    function get_ten_randoms() {
        Axios.get("swipe/get_ten_randoms").then(
            response => {
                console.log(response);
            }
        ).catch(
            error => {
                console.log(error);
            }
        )
    }

    useEffect(() => {
        get_ten_randoms();
    })

    return (<h1>SWIPE PAGE</h1>);
}

export default Swipe;