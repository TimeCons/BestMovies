import { useState, useEffect, useLayoutEffect } from 'react';
import { getMovieDetails, getMovieImage } from '../../api/movies';
import { addToFavorites, isFavorite, removeFromFavorites } from '../../helpers/asyncStorage';
import { IMovieDetails } from '../../interfaces/IMovie';
import { View, Image, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';

export function MovieDetails({ route, navigation }: { route: any, navigation: any }) {

  const { movie, onFavoriteUpdate : updateFavorite } = route.params;

  const [movieDetails, setMovieDetails] = useState<IMovieDetails | undefined>(undefined);
  const [inFavorite, setInFavorite] = useState(false);

  //set page navigation options
  useLayoutEffect(() => {
    navigation.setOptions({
      title: 'Movie Details',
      headerRight: () => (
        <TouchableOpacity onPress={handleFavoriteClick}>
          <Ionicons name={inFavorite ? 'ios-heart' : 'ios-heart-outline'} size={30} color='white' />
        </TouchableOpacity>
      )
    });
  }, [navigation, inFavorite, movie]);

  useEffect(() => {
    if (movie) {
      getMovieDetails(movie.id).then(setMovieDetails);
      isFavorite(movie).then(setInFavorite);
    }
  }, [movie]);

  //add or remove from favorites
  const handleFavoriteClick = () => {
    if (inFavorite) {
      removeFromFavorites(movie).then(updateFavorite);
    } else {
      addToFavorites(movie).then(updateFavorite);
    }
    setInFavorite(!inFavorite);
  }

  return (
    <>
      {movieDetails && (
        <ScrollView style={styles.container}>
          <Image source={{ uri: getMovieImage(movieDetails.backdrop_path) }} style={styles.imageHoriz} />
          <View style={styles.details}>
            <Text style={styles.title}>{movieDetails.title}</Text>
            <Text style={styles.overview}>{movieDetails.overview}</Text>
          </View>
          <Image source={{ uri: getMovieImage(movieDetails.poster_path) }} style={styles.imageVertical} />
        </ScrollView>
      )}
    </>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imageVertical: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
    margin: 5
  },
  imageHoriz: {
    width: '100%',
    height: 300,
    resizeMode: 'contain',
  },
  details: {
    padding: 20,
    width: '100%',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  overview: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    width: '50%',
    padding: 10,
    backgroundColor: '#ddd',
    borderRadius: 10,
  },
  buttonText: {
    textAlign: 'center',
    fontSize: 16,
    fontWeight: 'bold',
  }
});