import { View, Text } from 'react-native'
import React from 'react'
import { useAuthStore } from '../store/authStore'
import styles from '../assets/styles/profile.style';
import { Image } from 'expo-image';
import { formatPublichDate } from '../lib/utils';

export default function ProfileHeader() {
    const {user} = useAuthStore();
    if(!user) return null;
  return (
    <View style={styles.profileHeader}>
     <Image source={{uri: user.profileImage}} style={styles.profileImage}/>
     <View style={styles.profileInfo}>
        <Text style={styles.username}>{user.username}</Text>
         <Text style={styles.email}>{user.email}</Text>
          <Text style={styles.memberSince}>Joined {formatPublichDate(user.createdAt)}</Text>
     </View>
    </View>
  )
}