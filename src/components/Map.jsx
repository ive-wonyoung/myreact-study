import { useNavigate } from "react-router-dom";
import styles from "./Map.module.css";
import useURL from "../hooks/useURL";
import useGaoDe from "../hooks/useGaoDe";
import Button from "./Button";

function Map() {
  const { lat, lng } = useURL();
  const { mapRef: GaoDe, getUserLocation, isLoading } = useGaoDe(lng, lat);
  return (
    <div className={styles.mapContainer}>
      <div className={styles.map} ref={GaoDe} />
      <Button type="position" onClick={getUserLocation}>
        {isLoading ? "Loading....." : "Use your own position"}
      </Button>

      {/* <MapContainer
        center={[51.505, -0.09]}
        zoom={13}
        scrollWheelZoom={true}
        className={styles.map}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png"
        />
        <Marker position={[51.505, -0.09]}>
          <Popup>
            A pretty CSS3 popup. <br /> Easily customizable.
          </Popup>
        </Marker>
      </MapContainer> */}
    </div>
  );
}

export default Map;
