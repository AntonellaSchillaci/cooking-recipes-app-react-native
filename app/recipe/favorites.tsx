import React from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { useFavorites } from '@/hooks/useFavorites';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const router = useRouter();

  // Per mostrare le info dettagliate delle ricette preferite,
  // devi fetchare i dettagli o averli salvati da qualche parte.
  // Qui ipotizziamo di avere solo gli id, quindi potresti fare fetch per ogni id,
  // oppure salvare l'intero oggetto meal quando si aggiunge ai preferiti.
  // Per semplicità, facciamo un fetch per ogni preferito qui (non ottimale, ma didattico).

  const [favMeals, setFavMeals] = React.useState<Meal[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchFavMeals = async () => {
      setLoading(true);
      try {
        const mealsData = await Promise.all(
          favorites.map(async (id) => {
            const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
            const data = await res.json();
            return data.meals[0];
          })
        );
        setFavMeals(mealsData);
      } catch (error) {
        console.error('Errore fetch preferiti:', error);
      } finally {
        setLoading(false);
      }
    };

    if (favorites.length > 0) {
      fetchFavMeals();
    } else {
      setFavMeals([]);
      setLoading(false);
    }
  }, [favorites]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <Text>Caricamento preferiti...</Text>
      </View>
    );
  }

  return (
    <><Stack.Screen options={{ title: 'Preferiti', headerBackTitle: 'Back' }} />
        <View style={styles.container}>
          {favMeals.length === 0 ? (
              <View style={styles.centered}>
                  <Text style={styles.emptyText}>Nessuna ricetta aggiunta ai preferiti.</Text>
              </View>
          ) : (
              <FlatList
                  data={favMeals}
                  keyExtractor={(item) => item.idMeal}
                  renderItem={({ item }) => (
                      <TouchableOpacity
                          style={styles.card}
                          onPress={() => router.push(`/recipe/${item.idMeal}`)}
                      >
                          <Image source={{ uri: item.strMealThumb }} style={styles.image} />
                          <Text style={styles.title}>{item.strMeal}</Text>
                      </TouchableOpacity>
                  )}
                  contentContainerStyle={styles.list} />
          )}
      </View></>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fffec7',
    paddingTop: 50,
  },
  backButton: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 10,
    backgroundColor: '#bb5948',
    alignSelf: 'flex-start',
    borderRadius: 8,
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 18,
    color: '#bb5948',
  },
  list: {
    paddingHorizontal: 16,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    backgroundColor: '#bb5948',
    overflow: 'hidden',
    elevation: 2,
  },
  image: {
    width: '100%',
    height: 200,
  },
  title: {
    padding: 10,
    fontWeight: 'bold',
    fontSize: 18,
    color: '#fff',
  },
});
