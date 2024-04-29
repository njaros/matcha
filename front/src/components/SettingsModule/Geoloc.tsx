import { useCallback, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css"
import L, { Map as LeafLetMap } from "leaflet";
import { Box, Button } from "@chakra-ui/react";
import Axios from "../../tools/Caller";

const Geoloc = (props: {focus: boolean}) => {
    const [ mapCtx, setMap ] = useState<LeafLetMap | null>(null);
    const [ hideMap, setHideMap ] = useState<boolean>(true);
    const [ posClicked, setPosClicked ] = useState<[number, number] | null>(null)
    const [ registeredPos, setRegisteredPos ] = useState<[number, number] | null>(null);
    var popup = L.popup();
    
    function sendPosToServer() {
        alert("pouet" + posClicked);
        Axios.post("profile/set_pos", posClicked)
        .then((response) => {
            console.log(response);
            setRegisteredPos(posClicked);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        setPosClicked([e.latlng.lat, e.latlng.lng]);
        popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString() + 
        "\nClick on this popup to register this position")
        .openOn(e.target)
        .addEventListener("click", sendPosToServer);
    };

    const mapRef = useCallback((node: HTMLDivElement | null) => {
        if (props.focus == true)
        {
            if (mapCtx != null)
                mapCtx.invalidateSize();
            else if (node != null && !hideMap)
            {
                    const map = new LeafLetMap(node);
                    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                }).addTo(map);
                map.on("click", handleMapClick);
                var corner1 = L.latLng(40.712, -74.227),
                corner2 = L.latLng(40.774, -74.125),
                bounds = L.latLngBounds(corner1, corner2)
                map.fitBounds(bounds, {padding: [500, 500], maxZoom: 21})
                map.setView([51.505, -0.09], 13);
                setMap(map);
            }
        }
    }, [hideMap, props.focus])

    useEffect(() => {
        return () => {
            mapCtx?.remove();
        }
    }, [])

    const triggerMap = () => {
        setHideMap(!hideMap);
    }

    return (
        <Box    width="100%"
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="flex-start">
            <Button height="10%" onClick={triggerMap}>set pos manually</Button>
            <Box ref={mapRef} hidden={hideMap} height="50vh" width="67vw" />    
        </Box>
    )
   
}

export default Geoloc;