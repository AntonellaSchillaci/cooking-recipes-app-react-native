import React, { useEffect, useState } from 'react';
import { useLocalSearchParams, Stack } from 'expo-router';
import { View, Text, StyleSheet, Image, ScrollView, ActivityIndicator, 
         Linking, TouchableOpacity } from 'react-native';

type MealDetail = {
  idMeal: string;
  strMeal: string;
  strInstructions: string;
  strMealThumb: string;
  strYoutube?: string;
  [key: string]: any; 
};

export default function RecipeDetail() {
  const { id } = useLocalSearchParams();
  const [meal, setMeal] = useState<MealDetail | null>(null);
  const [loading, setLoading] = useState(true);
 



  useEffect(() => {
    if (!id) return;
    const fetchMealDetail = async () => {
      try {
        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        setMeal(data.meals[0]);
      } catch (error) {
        console.error('Errore fetch dettaglio:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMealDetail();
  }, [id]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!meal) {
    return (
      <View style={styles.centered}>
        <Text>Ricetta non trovata.</Text>
      </View>
    );
  }

  const ingredients = [];
  for (let i = 1; i <= 20; i++) {
    const ingredient = meal[`strIngredient${i}`];
    const measure = meal[`strMeasure${i}`];
    if (ingredient && ingredient.trim() !== '') {
      ingredients.push(`${measure ? measure : ''} ${ingredient}`.trim());
    }
  }

  return (
    <>
        <Stack.Screen options={{ 
            title: meal.strMeal,
            headerBackTitle: 'Home',
        }} />
        <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 40 }}>
          <Text style={styles.title}>{meal.strMeal}</Text>
          <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
          <Text style={styles.sectionTitle}>Ingredienti</Text>
          {ingredients.map((item, idx) => (
              <Text key={idx} style={styles.ingredient}>🍳{item}</Text>
          ))}
          <Text style={styles.sectionTitle}>Istruzioni</Text>
          <Text style={styles.instructions}>{meal.strInstructions}</Text>

          {meal.strYoutube ? (
              <>
                  <Text style={styles.sectionTitle}>Video YouTube</Text>
                  <TouchableOpacity onPress={() => meal.strYoutube && Linking.openURL(meal.strYoutube)}>
                      <Text style={styles.youtubeLink}>{meal.strYoutube}</Text>
                  </TouchableOpacity>
              </>
          ) : null}
      </ScrollView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fffec7',
    flex: 1,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 12,
    textAlign: 'center',
    color: '#bb5948',
  },
  image: {
    width: '100%',
    height: 250,
    borderRadius: 12,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '800',
    marginTop: 12,
    marginBottom: 6,
    color: '#bb5948',
  },
  ingredient: {
    fontSize: 16,
    marginBottom: 4,
    fontWeight: '500',
  },
  instructions: {
    fontSize: 16,
    lineHeight: 22,
    fontWeight: '500',
  },
  youtubeLink: {
    fontSize: 16,
    color: 'blue',
    textDecorationLine: 'underline',
  },
});
