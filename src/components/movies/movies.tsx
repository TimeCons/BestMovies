import { useState, useEffect, useLayoutEffect } from 'react';
import { Text, FlatList, View, StyleSheet, TouchableOpacity } from 'react-native';
import { getMovies, getMovieImage } from '../../api/movies';
import { IMovie } from '../../interfaces/IMovie';
import { getFavorites } from '../../helpers/asyncStorage';
import FastImage from 'react-native-fast-image';
import Ionicons from '@expo/vector-icons/Ionicons';


export function Movies({ navigation }: { navigation: any }) {

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const [movies, setMovies] = useState<IMovie[]>([]);

  const [showfavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState<IMovie[]>([]);

  //set page navigation options
  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => { setShowFavorites(!showfavorites) }}>
          <Text style={{ color: 'white' }}>{showfavorites ? 'Hide' : 'Show'} Favorites</Text>
        </TouchableOpacity>
      ),
      title: `${showfavorites ? 'Favorites' : 'Movies'}`,
    });
  }, [navigation, showfavorites]);

  useEffect(() => {
    fetchRemoteMovies();
    updateFavorites();
  }, [showfavorites]);

  //fetch movies from api
  const fetchRemoteMovies = () => {
    if (currentPage + 1 <= totalPages) {
      getMovies(currentPage + 1).then(({ page, results, total_pages }) => {
        setMovies(rendered => [...rendered, ...results]);
        setTotalPages(total_pages);
        setCurrentPage(page);
      });
    }
  }

  //update favorites list according to data in async storage
  const updateFavorites = async () => {
    let fav = await getFavorites();
    setFavorites(fav);
  }

  //navigate to movie details
  const navigateToMovieDetails = (movie: IMovie) => {
    navigation.navigate('MovieDetails', { movie: movie, onFavoriteUpdate: updateFavorites });
  }

  //sigle movie renderItem
  const MovieItem = ({ movie }: { movie: IMovie }) => {
    return (
      <TouchableOpacity
        style={styles.container}
        onPress={() => { navigateToMovieDetails(movie) }}>
        <FastImage style={styles.image} source={{ uri: getMovieImage(movie.poster_path) }} />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{movie.title}</Text>
          <View style={styles.detailsContainer}>
            <Text style={styles.subtitle}>
              <Ionicons name='calendar' size={20} color='#567' />
              {' ' + movie.release_date.slice(0, 4)}
            </Text>
            <Text style={styles.subtitle}>
              <Ionicons name='star' size={20} color='#289' />
              {' ' + movie.vote_average}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  }

  return (
    <>
      {/* show fetched movies */}
      {!showfavorites &&
        <FlatList
          data={movies}
          style={{ flex: 0 }}
          initialNumToRender={movies.length}
          renderItem={({ item }) => (<MovieItem movie={item}/>)}
          keyExtractor={item => 'mov_' + item.id.toString() + Math.random()}
          onEndReached={fetchRemoteMovies}
          onEndReachedThreshold={1}
        />
      }
      {/* show only favorites */}
      {showfavorites && favorites.length > 0 &&
        <FlatList
          data={favorites}
          style={{ flex: 0 }}
          initialNumToRender={favorites.length}
          renderItem={({ item }) => (<MovieItem movie={item}/>)}
          keyExtractor={item => 'fav_' + item.id.toString() + Math.random()}
        />
      }
      {/* no favorites available */}
      {showfavorites && favorites.length === 0 &&
        <Text style={styles.empty}>No favorites yet </Text>
      }
    </>
  );
}

/* stylesheet for the page */
const styles = StyleSheet.create({
  container: {

    flexDirection: 'row',
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 120,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd'
  },
  image: {
    width: 100,
    height: 100,
    margin: 10,
    borderRadius: 10,
  },
  textContainer: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'flex-start',
    margin: 10,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 10,
  },
  subtitle: {
    fontSize: 15,
    margin: 10,
  },
  detailsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  empty: {
    fontSize: 18,
    fontWeight: 'bold',
    margin: 50,

    textAlign: 'center',
  }
});
