import React, { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Maximize2, Minimize2 } from "lucide-react";
import { useThemeStore } from "@/stores/themeStore";

// Default Leaflet marker icon fix
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const LiveLocations = ({ devices }) => {
    const { theme } = useThemeStore();
  const [isExpanded, setIsExpanded] = useState(false);
  const [systemTheme, setSystemTheme] = useState("light");
  
    useEffect(() => {
      const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
      const handleChange = (e) => {
        setSystemTheme(e.matches ? "dark" : "light");
      };

      handleChange(mediaQuery);
      mediaQuery.addEventListener("change", handleChange);

      return () => mediaQuery.removeEventListener("change", handleChange);
    }, []);

    const effectiveTheme = useMemo(() => {
      return theme === "system" ? systemTheme : theme;
    }, [theme, systemTheme]);

    const tileLayerUrl = useMemo(() => {
      return effectiveTheme === "dark"
        ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
    }, [effectiveTheme]);

    const attribution =
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>';
  

  // Helper function to parse latLon strings
  const parseLatLon = (latLonStr) => {
    if (!latLonStr) return null;
    const [lat, lon] = latLonStr.split(",");
    const latitude = parseFloat(lat.trim());
    const longitude = parseFloat(lon.trim());
    if (isNaN(latitude) || isNaN(longitude)) return null;
    return { latitude, longitude };
  };

  // Filter out devices with invalid coordinates
  const validDevices = devices
    .map((device) => ({
      ...device,
      coordinates: parseLatLon(device.latLon),
    }))
    .filter((device) => device.coordinates);

  const toggleExpand = () => {
    setIsExpanded(!isExpanded);
  };

  // Create custom marker icons
  const onlineIcon = L.divIcon({
    className: "custom-marker-icon",
    html: '<div class="bg-emerald-500 text-emerald-500 ring-emerald-500/30 rounded-full w-4 h-4 flex items-center justify-center shadow-md"></div>',
  });

  const offlineIcon = L.divIcon({
    className: "custom-marker-icon",
    html: '<div class="bg-rose-500 text-rose-500 ring-rose-500/30 rounded-full w-4 h-4 flex items-center justify-center shadow-md"></div>',
  });

  return (
    <div
      className="bg-card p-2 rounded-xl relative"
      style={{
        height: isExpanded ? "75vh" : "40vh",
        width: "100%",
        borderRadius: "12px",
        transition: "height 0.3s ease-in-out",
      }}
    >
      <MapContainer
        center={[20.5937, 78.9629]}
        zoom={5}
        style={{
          height: "100%",
          width: "100%",
          borderRadius: "12px",
          transition: "height 0.3s ease-in-out",
        }}
        className="-z-0"
      >
        <TileLayer url={tileLayerUrl} attribution={attribution} />
        {validDevices.map((device) => (
          <Marker
            key={device.meterId}
            position={[
              device.coordinates.latitude,
              device.coordinates.longitude,
            ]}
            icon={device.status === "online" ? onlineIcon : offlineIcon}
          >
            <Popup>
              <div>
                <strong>Device ID:</strong> {device.meterId}
                <br />
                <strong>Status:</strong> {device.status}
                <br />
                <strong>Location:</strong> {device.location}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
      <button
        onClick={toggleExpand}
        className="absolute top-4 right-4 z-50 bg-card p-2 rounded-full shadow-md hover:bg-accent transition-colors duration-200"
      >
        {isExpanded ? <Minimize2 size={24} /> : <Maximize2 size={24} />}
      </button>
    </div>
  );
};

export default LiveLocations;
