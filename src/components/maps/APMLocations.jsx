"use client";

import { useState, useEffect, useMemo } from "react";
import { MapContainer, TileLayer, Marker, Tooltip } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useThemeStore } from "@/stores/themeStore";

// Updated dummy data for Indian locations with device IDs and online status
const locations = {
  APM1: [
    {
      name: "Delhi",
      lat: 28.6139,
      lon: 77.209,
      deviceId: "100001",
      online: true,
    },
    {
      name: "Mumbai",
      lat: 19.076,
      lon: 72.8777,
      deviceId: "100002",
      online: false,
    },
    {
      name: "Bengaluru",
      lat: 12.9716,
      lon: 77.5946,
      deviceId: "100003",
      online: true,
    },
  ],
  APM2: [
    {
      name: "Chennai",
      lat: 13.0827,
      lon: 80.2707,
      deviceId: "200001",
      online: true,
    },
    {
      name: "Hyderabad",
      lat: 17.385,
      lon: 78.4867,
      deviceId: "200002",
      online: false,
    },
    {
      name: "Kolkata",
      lat: 22.5726,
      lon: 88.3639,
      deviceId: "200003",
      online: true,
    },
  ],
  APM3: [
    {
      name: "Pune",
      lat: 18.5204,
      lon: 73.8567,
      deviceId: "300001",
      online: false,
    },
    {
      name: "Ahmedabad",
      lat: 23.0225,
      lon: 72.5714,
      deviceId: "300002",
      online: true,
    },
    {
      name: "Jaipur",
      lat: 26.9124,
      lon: 75.7873,
      deviceId: "300003",
      online: true,
    },
  ],
};

// SVG strings for custom icons with APM indicators
const createSvgIcon = (online, apm) => {
  const mainColor = online ? "#22c55e" : "#ef4444";
  const apmColor =
    apm === "APM1" ? "#28B7C4" : apm === "APM2" ? "#9F5BC1" : "#FFA500";
  const pinPath = online
    ? "M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z M9 11l3 3l3-3"
    : "M5.43 5.43A8.06 8.06 0 0 0 4 10c0 6 8 12 8 12a29.94 29.94 0 0 0 5-5 M19.18 13.52A8.66 8.66 0 0 0 20 10a8 8 0 0 0-8-8 7.88 7.88 0 0 0-3.52.82 M9.13 9.13A2.78 2.78 0 0 0 9 10a3 3 0 0 0 3 3 2.78 2.78 0 0 0 .87-.13 M14.9 9.25a3 3 0 0 0-2.15-2.16 M2 2l20 20";

  return `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="${mainColor}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="${pinPath}"/>
      <circle cx="12" cy="22" r="4" fill="${apmColor}" stroke="none"/>
    </svg>
  `;
};

// Custom marker icons using SVG strings
const createCustomIcon = (online, apm) => {
  const svgString = createSvgIcon(online, apm);

  return L.divIcon({
    className: "custom-div-icon",
    html: svgString,
    iconSize: [24, 24],
    iconAnchor: [12, 24],
  });
};

export default function APMLocations() {
  const { theme } = useThemeStore();
  const [selectedAPM, setSelectedAPM] = useState("ALL");
  const [mapKey, setMapKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [systemTheme, setSystemTheme] = useState("light");

  useEffect(() => {
    setMapKey((prevKey) => prevKey + 1);
  }, [selectedAPM]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

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

  const getLocations = useMemo(() => {
    let filteredLocations = [];

    if (searchQuery) {
      filteredLocations = Object.entries(locations).flatMap(([apm, locs]) =>
        locs
          .filter((loc) =>
            loc.deviceId.toLowerCase().includes(searchQuery.toLowerCase())
          )
          .map((loc) => ({ ...loc, apm }))
      );
    } else if (selectedAPM === "ALL") {
      filteredLocations = Object.entries(locations).flatMap(([apm, locs]) =>
        locs.map((loc) => ({ ...loc, apm }))
      );
    } else {
      filteredLocations =
        locations[selectedAPM]?.map((loc) => ({ ...loc, apm: selectedAPM })) ||
        [];
    }

    return filteredLocations;
  }, [searchQuery, selectedAPM]);

  const center = useMemo(() => {
    return getLocations.length > 0
      ? [getLocations[0].lat, getLocations[0].lon]
      : [20.5937, 78.9629]; // Center of India
  }, [getLocations]);

  const renderMap = () => (
    <MapContainer
      key={mapKey}
      center={center}
      zoom={5}
      style={{ height: "100%", width: "100%" }}
      className="z-0 rounded-xl"
    >
      <TileLayer url={tileLayerUrl} attribution={attribution} />
      {getLocations.map((location, index) => (
        <Marker
          key={index}
          position={[location.lat, location.lon]}
          icon={createCustomIcon(location.online, location.apm)}
        >
          <Tooltip
            direction="top"
            offset={[0, -10]}
            className="bg-card p-2 rounded-xl shadow-lg text-foreground"
          >
            <div className="text-center">
              <h3 className="font-semibold text-lg">{location.name}</h3>
              <p className="text-sm text-muted-foreground">{location.apm}</p>
              <p className="text-sm text-muted-foreground">
                Device ID: {location.deviceId}
              </p>
              <p className="text-xs text-muted-foreground">
                Lat: {location.lat.toFixed(4)}, Lon: {location.lon.toFixed(4)}
              </p>
              <p
                className={`text-sm font-semibold ${
                  location.online ? "text-green-500" : "text-red-500"
                }`}
              >
                {location.online ? "Online" : "Offline"}
              </p>
            </div>
          </Tooltip>
        </Marker>
      ))}
    </MapContainer>
  );

  const renderSkeleton = () => (
    <div className="w-full h-full rounded-xl bg-card animate-pulse">
      <div className="h-full flex items-center justify-center">
        <Skeleton className="w-16 h-16 rounded-full" />
      </div>
    </div>
  );

  return (
    <div className="relative w-full bg-card rounded-2xl h-full p-2">
      {isLoading ? renderSkeleton() : renderMap()}
      <div className="absolute top-4 left-4 right-4 z-10">
        <div className="flex flex-col sm:flex-row w-full justify-between gap-4">
          <div className="flex w-full rounded-full shadow-md overflow-hidden bg-background">
            <input
              className="w-full h-9 px-3 rounded-full bg-background text-foreground"
              placeholder="Search Device ID"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Search Device ID"
            />
            <button className="px-3 text-foreground" aria-label="Search">
              <Search />
            </button>
          </div>
          <div className="flex gap-2 w-full justify-center sm:justify-end">
            {["ALL", "APM1", "APM2", "APM3"].map((apm) => {
              const bgColor =
                apm === "APM1"
                  ? "bg-[#28B7C4]"
                  : apm === "APM2"
                  ? "bg-[#9F5BC1]"
                  : apm === "APM3"
                  ? "bg-[#FFA500]"
                  : "bg-accent";

              const circleColor =
                apm === "APM1"
                  ? "bg-[#28B7C4]"
                  : apm === "APM2"
                  ? "bg-[#9F5BC1]"
                  : apm === "APM3"
                  ? "bg-[#FFA500]"
                  : "bg-gray-600";

              return (
                <button
                  key={apm}
                  onClick={() => {
                    setSelectedAPM(apm);
                    setSearchQuery("");
                  }}
                  className={`flex items-center justify-center rounded-full px-4 py-0 ${
                    selectedAPM === apm
                      ? `border-2 border-foreground ${bgColor} `
                      : `${bgColor}/25`
                  } `}
                  aria-pressed={selectedAPM === apm}
                  aria-label={`Filter by ${apm}`}
                >
                  <div
                    className={`w-3 h-3 rounded-full mr-2 ${circleColor}`}
                  ></div>
                  <div className="text-start">
                    <p className="text-sm font-semibold text-foreground">
                      {apm}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
