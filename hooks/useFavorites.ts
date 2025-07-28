import AsyncStorage from '@react-native-async-storage/async-storage';
import { useState, useEffect } from 'react';

const FAVORITES_KEY = 'FAVORITE_MEALS';

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    const data = await AsyncStorage.getItem(FAVORITES_KEY);
    if (data) {
      setFavorites(JSON.parse(data));
    }
  };

  const toggleFavorite = async (mealId: string) => {
    const isFav = favorites.includes(mealId);
    const updated = isFav
      ? favorites.filter(id => id !== mealId)
      : [...favorites, mealId];
    setFavorites(updated);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const isFavorite = (mealId: string) => {
    return favorites.includes(mealId);
  };

  return { favorites, toggleFavorite, isFavorite };
}
