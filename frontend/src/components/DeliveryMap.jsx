import { useEffect, useRef } from "react";
import { useLoadGoogleMaps } from "../hooks/useLoadGoogleMaps.js"; // <-- import hook

const DeliveryMap = ({ origin, destination }) => {
  const mapRef = useRef(null);
  const apiKey = "AIzaSyARZhNOnz7q9wPgG4NTkYW1x5ZsCC_2jIo"; // Replace properly
  const isLoaded = useLoadGoogleMaps(apiKey);

  useEffect(() => {
    if (!isLoaded) return;  // ✅ Wait until Google Maps script is fully loaded
    if (
      !origin || !destination ||
      origin.length !== 2 || destination.length !== 2
    ) return;

    const originObj = { lat: origin[1], lng: origin[0] };
    const destinationObj = { lat: destination[1], lng: destination[0] };

    const map = new window.google.maps.Map(mapRef.current, {
      zoom: 13,
      center: originObj,
    });

    const directionsService = new window.google.maps.DirectionsService();
    const directionsRenderer = new window.google.maps.DirectionsRenderer();
    directionsRenderer.setMap(map);

    directionsService.route(
      {
        origin: originObj,
        destination: destinationObj,
        travelMode: window.google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRenderer.setDirections(result);
        } else {
          console.error("Directions request failed:", status);
        }
      }
    );
  }, [isLoaded, origin, destination]);

  return <div ref={mapRef} style={{ height: '400px', width: '100%' }} />;
};

export default DeliveryMap;
