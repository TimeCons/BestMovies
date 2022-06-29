
import { MOVIES_BASE_URL, IMAGES_BASE_URL, API_KEY } from "../config";

export const getMovies = async (page = 1) => {
  const url = `${MOVIES_BASE_URL}popular?${API_KEY}&page=${page}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export const getMovieDetails = async (id : number) => {
  const url = `${MOVIES_BASE_URL}${id}?${API_KEY}`;
  const response = await fetch(url);
  const data = await response.json();
  return data;
}

export const getMovieImage = (path : string) => {
  return `${IMAGES_BASE_URL}${path}`;
}