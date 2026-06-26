import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";

const position = [18.5204, 73.8567]; // Pune

function Map() {
  return (
    <MapContainer
      center={position}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; OpenStreetMap contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      <Marker position={position}>
        <Popup>
          Bus Location
        </Popup>
      </Marker>
    </MapContainer>
  );
}

export default Map;