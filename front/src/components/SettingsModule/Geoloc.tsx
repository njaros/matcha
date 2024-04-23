import { useCallback, useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css"
import L, { Map as LeafLetMap } from "leaflet";
import { Box } from "@chakra-ui/react";

const Geoloc = () => {
    const [ clickedPos, setClickedPos ] = useState<[number, number] | null>(null)
    const [ mapCtx, setMap ] = useState<LeafLetMap | null>(null)
    var popup = L.popup();
    
    const handleMapClick = (e: L.LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        popup.setLatLng(e.latlng).setContent("You clicked the map at " + e.latlng.toString())
        .openOn(e.target)
        const containerPoint = e.containerPoint
        setClickedPos([lat, lng]);

    };

    const mapRef = useCallback((node: HTMLDivElement | null) => {
        if (node != null && mapCtx == undefined)
        {
            const map = new LeafLetMap(node);
            L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
            {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            }).addTo(map);
            map.on("click", handleMapClick);
            map.setView([51.505, -0.09], 13);
            var corner1 = L.latLng(40.712, -74.227),
                corner2 = L.latLng(40.774, -74.125),
                bounds = L.latLngBounds(corner1, corner2)
            map.fitBounds(bounds, {padding: [500, 500], maxZoom: 21})
            setMap(map);
        }
    }, [])

    useEffect(() => {
        return () => {
            mapCtx?.remove();
        }
    }, [])

    const handleValidatePosition = () => {
        if (clickedPos) {
          console.log("Coordonnées sélectionnées :", clickedPos);
        }
      };

    return (
        <Box>
            <div ref={mapRef} style={{height: "536px"}}/>
        </Box>
    )
}

export default Geoloc;