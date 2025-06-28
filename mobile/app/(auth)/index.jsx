import { View, Text, Image, TextInput, Platform, TouchableOpacity, ActivityIndicator, KeyboardAvoidingView,Alert ,ScrollView} from 'react-native'
import styles from '../../assets/styles/login.style'
import { useState } from 'react'
import { useSafeAreaFrame } from 'react-native-safe-area-context'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { Link } from "expo-router"
import { PlatformPressable } from '@react-navigation/elements'
import { useAuthStore } from '../../store/authStore'

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const {user,isLoading,login,isCheckingAuth} = useAuthStore();


    const handleLogin = async () => {
      const result= await login(email,password);
       if(!result.success) Alert.alert("Error",result.error);
      
     };
if(isCheckingAuth) return null;
    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
 
            <View style={styles.container}>
                <View style={styles.topIllustration}>
                    <Image
                        source={require('../../assets/images/i.png')}
                         style={[
    styles.illustrationImage,
    Platform.OS === 'web' && { width: 400, height:300 } // adjust as needed
  ]}
                        resizeMode="contain"
                    />
                </View>
                <View style={styles.card}>
                    <View style={styles.formContainer}>
                        {/* email Field */}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput style={styles.input}
                                    placeholder="Enter you email"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholderTextColor={COLORS.placeholderText}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                        </View>
                        {/* password Field */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="lock-closed-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput style={styles.input}
                                    placeholder="Enter you password"
                                    value={password}
                                    onChangeText={setPassword}
                                    placeholderTextColor={COLORS.placeholderText}
                                    secureTextEntry={!showPassword}
                                />
                                <TouchableOpacity style={styles.eyeIcon} onPress={() => setShowPassword(!showPassword)}>
                                    <Ionicons name={showPassword ? "eye-outline" : "eye-off-outline"} size={20} color={COLORS.primary} />

                                </TouchableOpacity>

                            </View>

                        </View>
                        <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
                            {isLoading ? (
                                <ActivityIndicator color="#fff" />
                            ) : (
                                <Text style={styles.buttonText}>Login</Text>
                            )}
                        </TouchableOpacity>
                        {/* Footer */}

                        <View style={styles.footer}>
                            <Text style={styles.footerText}>Don't have an account?</Text>
                            <Link href="/signup" asChild>
                                <TouchableOpacity>
                                    <Text style={styles.link}>SignUp</Text>
                                </TouchableOpacity>
                            </Link>
                        </View>
                    </View>
                </View>
            </View>
           
        </KeyboardAvoidingView>
    );
}