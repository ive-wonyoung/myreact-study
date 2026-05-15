import { useSearchParams } from "react-router-dom";

export default function useURL() {
  const [searchParmas, setSearchParmas] = useSearchParams();
  const lat = searchParmas.get("lat");
  const lng = searchParmas.get("lng");
  return { lat, lng };
}
