// src/components/LocationSearchBar.jsx
import { useState, useRef } from "react";
import { MdLocationOn, MdMyLocation } from "react-icons/md";
import LocationService from "../../services/locationService";

export default function LocationSearchBar({ onLocationChange }) {
  const [address, setAddress] = useState("");
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState(false);
  const timeoutRef = useRef(null);
  const inputRef = useRef(null);

  // Handle input change with debounce
  const handleAddressChange = (e) => {
    const value = e.target.value;
    setAddress(value);

    // Clear any existing timeout
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (value.length > 2) {
      setLoading(true);

      // Set a new timeout to fetch predictions after user stops typing
      timeoutRef.current = setTimeout(async () => {
        try {
          const predictions = await LocationService.getAutocompletePredictions(
            value
          );
          setPredictions(predictions);
        } catch (error) {
          console.error("Error fetching address suggestions:", error);
        } finally {
          setLoading(false);
        }
      }, 300); // 300ms debounce
    } else {
      setPredictions([]);
      setLoading(false);
    }
  };

  const handleSelectLocation = async (prediction) => {
    setAddress(prediction.description);
    setPredictions([]);

    try {
      const locationData = await LocationService.geocodeAddress({
        address: prediction.description,
        placeId: prediction.place_id,
      });

      onLocationChange(locationData);
    } catch (error) {
      console.error("Error getting location details:", error);
    }
  };

  // Get current location
  const handleGetCurrentLocation = async () => {
    setLoading(true);
    try {
      const locationData = await LocationService.getCurrentLocation();

      setAddress(locationData.address);
      onLocationChange(locationData);
    } catch (error) {
      console.error("Geolocation error:", error);
      alert(
        "Could not access your location. Please check your device permissions."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative w-full max-w-md">
      <div className="flex items-center border rounded-full px-4 py-2 bg-white shadow-sm">
        <MdLocationOn className="text-green-600 text-xl mr-2 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder="Enter your delivery address"
          className="w-full focus:outline-none text-gray-700"
          value={address}
          onChange={handleAddressChange}
        />
        <button
          onClick={handleGetCurrentLocation}
          className="text-green-600 hover:bg-green-50 p-1 rounded-full ml-1 flex-shrink-0"
          title="Use current location"
        >
          <MdMyLocation className="text-xl" />
        </button>
      </div>

      {/* Predictions dropdown */}
      {predictions.length > 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg max-h-60 overflow-y-auto">
          {predictions.map((prediction) => (
            <div
              key={prediction.place_id}
              className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-start"
              onClick={() => handleSelectLocation(prediction)}
            >
              <MdLocationOn className="text-gray-400 mr-2 mt-1 flex-shrink-0" />
              <div>
                <div className="font-medium">
                  {prediction.structured_formatting?.main_text}
                </div>
                <div className="text-sm text-gray-500">
                  {prediction.structured_formatting?.secondary_text}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Loading indicator */}
      {loading && predictions.length === 0 && (
        <div className="absolute z-20 mt-1 w-full bg-white rounded-md shadow-lg p-4 text-center">
          <div className="animate-pulse text-gray-600">
            Finding locations...
          </div>
        </div>
      )}
    </div>
  );
}
