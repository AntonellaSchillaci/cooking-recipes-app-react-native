import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity, ActivityIndicator, TextInput } from 'react-native';
import { useRouter } from 'expo-router';

type Meal = {
  idMeal: string;
  strMeal: string;
  strMealThumb: string;
};

export default function HomeScreen() {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const [searchText, setSearchText] = useState('');

  useEffect(() => {
    const fetchMeals = async () => {
      try {
        const res = await fetch('https://www.themealdb.com/api/json/v1/1/search.php?s=');
        const data = await res.json();
        setMeals(data.meals);
      } catch (error) {
        console.error('Errore nel fetch:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeals();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  const renderItem = ({ item }: { item: Meal }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => router.push(`/recipe/${item.idMeal}`)}
    >
      <Image source={{ uri: item.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{item.strMeal}</Text>
    </TouchableOpacity>
  );

  const filteredMeals = meals.filter((meal) =>
    meal.strMeal.toLowerCase().includes(searchText.toLowerCase())
  );

  return (
    <>
      <TextInput 
      placeholder="Cerca una ricetta..."
      value={searchText}
      onChangeText={setSearchText}
      style={styles.searchInput}
    />
    <FlatList
      data={filteredMeals}
      renderItem={renderItem}
      keyExtractor={(item) => item.idMeal}
      contentContainerStyle={styles.list} />
      </>
  );
}

const styles = StyleSheet.create({
  list: {
    padding: 16,
    backgroundColor: '#fffec7',
    paddingBottom: 100,
    paddingTop: 50,
  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    overflow: 'hidden',
    backgroundColor: '#bb5948',
    elevation: 2,
  },
  image: {
    height: 200,
    width: '100%',
  },
  title: {
    padding: 10,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#bb5948',
    borderWidth: 3,
    borderRadius: 8,
    paddingHorizontal: 12,
    backgroundColor: '#fff',
    marginTop: 60,
  },
  
});
