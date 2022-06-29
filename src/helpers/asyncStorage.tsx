import { IMovie } from "../interfaces/IMovie";
import AsyncStorage from '@react-native-async-storage/async-storage';


//add to favorite
export const addToFavorites = async(movie: IMovie) => {
  const favorites = await AsyncStorage.getItem('favorites');
  if (favorites) {
    const favoritesArray = JSON.parse(favorites);
    favoritesArray.push(movie);
    AsyncStorage.setItem('favorites', JSON.stringify(favoritesArray));
  } else {
    AsyncStorage.setItem('favorites', JSON.stringify([movie]));
  }
}

//remove from favorites
export const removeFromFavorites = async(movie: IMovie) => {
  const favorites = await AsyncStorage.getItem('favorites');
  if (favorites) {
    const favoritesArray = JSON.parse(favorites);
    const newFavoritesArray = favoritesArray.filter((fav: IMovie) => fav.id !== movie.id);
    AsyncStorage.setItem('favorites', JSON.stringify(newFavoritesArray));
  }
}

//return true if the movie is in the favorites
export const isFavorite = async(movie: IMovie) => {
  const favorites = await AsyncStorage.getItem('favorites');
  if (favorites) {
    const favoritesArray = JSON.parse(favorites);
    return favoritesArray.some((fav: IMovie) => fav.id === movie.id);
  }
  return false;
}

//get the favorites from AsyncStorage
export const getFavorites = async () => {
  const favorites = await AsyncStorage.getItem('favorites');
  if (favorites) {
    return JSON.parse(favorites);
  }
  return [];
}