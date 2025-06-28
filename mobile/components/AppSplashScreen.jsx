// components/AppSplash.js
import COLORS from '@/constants/colors';
import React from 'react';
import { View, Text, ActivityIndicator, StyleSheet, Image } from 'react-native';

export default function AppSplashScreen() {
    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/i.png')} 
                style={styles.image}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: COLORS.background,
    },
    image: {
        width: 350,
        height: 350,
        marginBottom: 20,
        resizeMode: 'contain',
    },
   
});
