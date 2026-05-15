import { useCallback, useEffect, useRef, useState } from "react";
import AMapLoader from "@amap/amap-jsapi-loader";
import { useCities } from "../contexts/CitiesQuery";
import { useNavigate } from "react-router-dom";

export default function useGaoDe(mapLng = 10, mapLat = 40) {
  const { cities, setCurrentCity } = useCities();
  const mapRef = useRef(null);
  const Mymap = useRef(null);
  const navigate = useNavigate();
  const geolocationRef = useRef(null);
  const [isLoading, setIsLoading] = useState(false);
  const setView = useCallback(function (zoom, center) {
    if (Mymap.current) {
      Mymap.current.setZoomAndCenter(zoom, center);
    }
  }, []);
  useEffect(
    function () {
      setCurrentCity({});
      AMapLoader.load({
        key: "2749cde05380fe685b05cbf0c686a6a3",
        version: "2.0",
        plugins: ["AMap.Geolocation"],
      }) //创建一个地图
        .then((AMap) => {
          Mymap.current = new AMap.Map(mapRef.current, {
            center: [116.397428, 39.90923],
            zoom: 7,
          });
          const map = Mymap.current; //创建两个实例
          geolocationRef.current = new AMap.Geolocation();
          Mymap.current.add(
            new AMap.Marker({ position: [116.397428, 39.90923], map }),
          );
          cities.map((city) => {
            const { lng, lat } = city.position;
            Mymap.current.add(new AMap.Marker({ position: [lng, lat], map }));
          }); //给每个城市添加标记
          map.on("click", (e) => {
            const click_lat = e.lnglat.lat;
            const click_lng = e.lnglat.lng;
            if (click_lat && click_lng) {
              navigate(`form?lat=${click_lat}&lng=${click_lng}`);
            }
          });
        });
    },
    [cities],
  );
  useEffect(
    function () {
      if (Mymap.current) {
        const zoom = Mymap.current.getZoom() || 7;
        if (mapLat && mapLng) {
          setCurrentCity({});
          setView(zoom, [mapLng, mapLat]);
        }
      }
    },
    [mapLat, mapLng, setView, setCurrentCity],
  );

  function getUserLocation() {
    if (geolocationRef.current) {
      setIsLoading(true);
      geolocationRef.current.getCurrentPosition((status, result) => {
        if (status === "complete") {
          setCurrentCity({});
          setIsLoading(false);
          setView(15, [result.position.lng, result.position.lat]);
        }
      });
    }
  }
  return { mapRef, getUserLocation, isLoading };
}
