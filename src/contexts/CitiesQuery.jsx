import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";
const BASE_URL = "http://localhost:8000";
const CitiesContext = createContext();

// 查询函数
async function fetchCities() {
  const res = await fetch(`${BASE_URL}/cities`);
  if (!res.ok) throw new Error("Failed to fetch cities");
  return res.json();
}

async function fetchCity(id) {
  const res = await fetch(`${BASE_URL}/cities/${id}`);
  if (!res.ok) throw new Error("Failed to fetch city");
  return res.json();
}

async function createCityRequest(newCity) {
  const res = await fetch(`${BASE_URL}/cities`, {
    method: "POST",
    body: JSON.stringify(newCity),
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!res.ok) throw new Error("Failed to create city");
  return res.json();
}

async function deleteCityRequest(id) {
  const res = await fetch(`${BASE_URL}/cities/${id}`, {
    method: "DELETE",
  });
  if (!res.ok) throw new Error("Failed to delete city");
  return res;
}

function CitiesProvider({ children }) {
  const [currentCity, setCurrentCity] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const queryClient = useQueryClient();
  // 获取所有城市（替代原来的 useEffect）
  const { data: cities = [], isLoading: Loadingfirst } = useQuery({
    queryKey: ["cities"],
    queryFn: fetchCities,
  });

  const getCity = useCallback(
    async (id) => {
      setCurrentCity({});
      setIsLoading(true);
      const data = await queryClient.fetchQuery({
        queryKey: ["city", id],
        queryFn: () => fetchCity(id),
      });
      setCurrentCity(data);
      setIsLoading(false);

      return data;
    },
    [queryClient],
  );

  const createCityMutation = useMutation({
    mutationFn: (newCity) => createCityRequest(newCity),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
  const createCity = useCallback(
    async (newCity) => {
      setIsLoading(true);
      await createCityMutation.mutateAsync(newCity);
      setIsLoading(false);
    },
    [createCityMutation],
  );

  const deleteCityMutation = useMutation({
    mutationFn: (id) => deleteCityRequest(id),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["cities"] });
    },
  });
  const deleteCity = useCallback(
    async (id) => {
      setIsLoading(true);
      await deleteCityMutation.mutateAsync(id);
      setIsLoading(false);
    },
    [deleteCityMutation],
  );
  const value = useMemo(
    () => ({
      cities,
      Loadingfirst,
      isLoading,
      currentCity,
      getCity,
      createCity,
      deleteCity,
      setCurrentCity,
    }),
    [
      cities,
      Loadingfirst,
      isLoading,
      currentCity,
      getCity,
      createCity,
      deleteCity,
      setCurrentCity,
    ],
  );
  return (
    <CitiesContext.Provider value={value}>{children}</CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside from CitiesProvider");
  return context;
}
export { CitiesProvider, useCities };
