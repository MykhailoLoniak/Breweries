import axios from "axios";
import type { Brewery } from "./types";

const BASE_URL = "https://api.openbrewerydb.org/v1/breweries";

export async function fetchBreweries(
  page: number = 1,
  perPage: number = 15
): Promise<Brewery[]> {
  const url = `${BASE_URL}?per_page=${perPage}&page=${page}`;
  const res = await axios.get<Brewery[]>(url);

  return res?.data;
}

export async function fetchBreweryById(id: string) {
  const url = `${BASE_URL}/${id}`;
  const res = await axios.get<Brewery>(url);

  return res?.data;
}
