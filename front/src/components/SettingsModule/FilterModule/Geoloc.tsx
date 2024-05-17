import { useCallback, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css"
import L, { Map as LeafLetMap } from "leaflet";
import { Box, Button, Text, Icon } from "@chakra-ui/react";
import Axios from "../../../tools/Caller";
import { storeGps } from "../../../tools/Stores";
import { lngModulo } from "../../../tools/Thingy";
import { FaLock, FaLockOpen } from "react-icons/fa";
import { ChevronDownIcon } from "@chakra-ui/icons";

const geolocFontSize = { base: '12px', sm: '14px', md: '16px', lg: '20px', xl: '24px' };
const commentaryFontSize = { base: '15px', sm: '18px', md: '21px', lg: '25px', xl: '30px' };
const heigthSizes = { base: '40px', sm: '50px', md: '60px', lg: '70px', xl: '80px' }

const Geoloc = (props: {focus: boolean}) => {
    const [ mapCtx, setMap ] = useState<LeafLetMap | null>(null);
    const [ hideMap, setHideMap ] = useState<boolean>(true);
    const [ posInfo, setPosInfo ] = useState<{country: string, city: string}>({country: "", city: ""})
    const { gps, updateGpsLatLng } = storeGps();
    const { fixed, updateGpsFixed } = storeGps();
    var popup = L.popup();
    
    function getGps() {
        Axios.get("user/get_gps").then(
            response => {
                console.log(response);
                updateGpsLatLng(response.data);
            }
        )
        .catch(
            err => {
                console.log(err);
            }
        )
    }

    function getCountryAndCity(lat: number, lon: number) {
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`)
        .then(response => response.json().then(
            data => {
                setPosInfo({
                    country:    data.address.country != undefined ?
                                data.address.country : "Where did you clicked ?",
                    city:   data.address.city != undefined ?
                            data.address.city :
                            data.address.village != undefined ?
                            data.address.village :
                            data.address.town != undefined ?
                            data.address.town :
                            data.address.county != undefined ?
                            data.address.county :
                            data.address.state != undefined ?
                            data.address.state : ""
                })
            }
        ))
        .catch(error => console.warn(error))
    }

    function sendPosToServer(e: any) {
        const posAsStr: string = e.target.value;
        const posClicked = {
            latitude: parseFloat(posAsStr.substring(posAsStr.indexOf("(") + 1, posAsStr.indexOf(","))),
            longitude: lngModulo(parseFloat(posAsStr.substring(posAsStr.indexOf(",") + 2, posAsStr.indexOf(")"))))
        }
        console.log(posAsStr);
        console.log(posClicked);
        Axios.post("profile/set_pos", posClicked)
        .then((response) => {
            console.log(response);
            updateGpsLatLng(posClicked);
        })
        .catch((error) => {
            console.log(error);
        })
    }

    const handleMapClick = (e: L.LeafletMouseEvent) => {
        const popupContent = document.createElement("div");
        popupContent.innerText = "click validate to register this localisation\n";
        const buttonValidate = document.createElement("button");
        buttonValidate.innerHTML = "validate";
        buttonValidate.value = e.latlng.toString();
        buttonValidate.onclick = sendPosToServer;
        popupContent.appendChild(buttonValidate);
        popup.setLatLng(e.latlng).setContent(popupContent)
        .openOn(e.target)
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
                if (gps)
                    map.setView([gps.latitude, gps.longitude], 10);
                else
                    map.setView([51.505, -0.09], 10);
                setMap(map);
            }
        }
    }, [hideMap, props.focus])

    useEffect(() => {
        if (gps == undefined)
            getGps()
        return () => {
            mapCtx?.remove();
        }
    }, [])

    useEffect(() => {
        if (gps)
            getCountryAndCity(gps.latitude, gps.longitude)
    }, [gps])

    const triggerMap = () => {
        setHideMap(!hideMap);
    }

    const fixedGpsHandler = () => {
        if (fixed)
        {
            Axios.get("profile/unlock_gps")
            .then(() => {
                updateGpsFixed(!fixed);
            })
            .catch((error) => {
                console.warn(error);
            })
        }
        else
        {
            Axios.get("profile/lock_gps")
            .then(() => {
                updateGpsFixed(!fixed);
            })
            .catch((error) => {
                console.warn(error);
            })
        }
    }

    return (
        <Box    width="100%"
                display="flex"
                flexDirection="column"
                >
            <Box display="flex" marginBottom="10px">
                <Button
                    display="flex"
                    justifyContent="space-between"
                    flex={1}
                    borderRadius="15px"
                    fontSize={commentaryFontSize}
                    color="pink.100"
                    colorScheme="matchaPink"
                    onClick={triggerMap}>
                    <Text display="flex" height={heigthSizes} alignItems="center">
                        Position: {posInfo.city}, {posInfo.country}
                    </Text>
                    <Icon   as={ChevronDownIcon}
                            boxSize={5}
                            transition="transform 0.3s"
                            transform={hideMap? 'rotate(0deg)' : 'rotate(180deg)'} />
                </Button>
                <Button marginLeft="15px" borderRadius="15px" colorScheme="matchaPink" height={heigthSizes} width={heigthSizes} onClick={fixedGpsHandler}><Icon color="pink.100" as={fixed ? FaLock : FaLockOpen}/></Button>
            </Box>
            <Box ref={mapRef} hidden={hideMap} border="solid 2px #FED7E2" borderRadius="10px" height="50vh" width="100%" />
        </Box>
    )
   
}

export default Geoloc;