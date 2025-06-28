import { View, Text, Alert, FlatList, TouchableOpacity, ActivityIndicator, RefreshControl } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAuthStore } from '../../store/authStore'
import { API_URL } from '../../constants/api';
import { useRouter } from 'expo-router'
import ProfileHeader from '../../components/ProfileHeader';
import LogoutBtn from '../../components/LogoutBtn';
import styles from '../../assets/styles/profile.style';
import { Ionicons } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { Image } from 'expo-image';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { sleep } from '.';
import Loader from '../../components/Loader';

export default function Profile() {
  const { user, logout, token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
   const [deleteBookId, setDeleteBookId] = useState(null);


  const router = useRouter();

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      setIsLoading(true);
      const response = await fetch(`${API_URL}/api/book/user`, {
        headers: {
          Authorization: `Bearer ${token}`
        },
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.message || "failed to fetch books");
      setBooks(data);

    } catch (error) {
      console.error("Error fetching the books", error);
      Alert.alert("Error", "Failed to load the data.")
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchBooks();
  }, [])

const confirmDelete = (bookId) =>{
    Alert.alert("Delete Recommendation", "Are you want to delete this recommendation",[
        {text: "Cancel", style: "cancel"},
         {text: "Delete", onPress: () => handleDeleteBook(bookId), style: "destructive"}
    ])
    }

    const handleDeleteBook = async (bookId)=>{
      try {
        setDeleteBookId(bookId);
         const response = await fetch(`${API_URL}/api/book/${bookId}`, {
        method: "DELETE",
          headers: {
          Authorization: `Bearer ${token}`
        },
      });

        const data = await response.json();

      if (!response.ok) throw new Error(data.message || "failed to delete book");
      setBooks(books.filter((book) => book._id !== bookId));
  Alert.alert("Success", "Book deleted successfully.")
      } catch (error) {
      
      Alert.alert("Error", error.message || "Failed to delete the books.")
      } finally{
        setDeleteBookId(null);
      }
    }
  const renderBookItem = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderRatingStars(item.rating)}</View>
      <Text style={styles.bookCaption} numberOfLines={2}>{item.caption}</Text>
            <Text style={styles.bookDate} >{new Date(item.createdAt).toLocaleDateString()}</Text>
      </View>

       <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
             {deleteBookId === item._id ? (
              <ActivityIndicator size="small" color={COLORS.primary} />
             ): (
               <Ionicons name='trash-outline' size={20} color={COLORS.primary} />
             )}
            </TouchableOpacity>
    </View>
  );

  const renderRatingStars = (rating) => {
    const stars = [];

    for (let i = 1; i <= 5; i++) {
      stars.push(

        <Ionicons
          key={i}
          name={i <= rating ? 'star' : 'star-outline'}
          size={16}
          color={i <= rating ? '#f4b400' : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />

      );
    }

    return stars;
  };


  const handleRefresh = async() =>{
     setRefreshing(true);
     await fetchBooks();
     await sleep(500);
     setRefreshing(false)
  }

  if(isLoading && !refreshing) return <Loader/>
  return (
    <View style={styles.container}>
      <ProfileHeader />
      <LogoutBtn />

      <View style={styles.booksHeader}>
        <Text style={styles.booksTitle}>Your Recommendations 📚</Text>
        <Text style={styles.booksCount}>{books.length}</Text>
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item._id}
        renderItem={renderBookItem}
        contentContainerStyle={styles.booksList}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
             refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={[COLORS.primary]}
              tintColor={COLORS.primary}
          />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name='book-outline' size={20} color={COLORS.textSecondary} />
            <Text style={styles.emptyContainer} >No recommendation yet</Text>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
              <Text style={styles.addButtonText}>Add your first book</Text>

            </TouchableOpacity>
          </View>

        }

      />
    </View>
  )
}

