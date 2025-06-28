import { View, Text, KeyboardAvoidingView,TouchableOpacity, Platform, TextInput,Alert,ActivityIndicator  } from 'react-native'
import { useReducer, useState } from 'react'
import styles from '../../assets/styles/signup.style'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { Link ,useRouter} from "expo-router"
import { routePatternToRegex } from 'expo-router/build/fork/getStateFromPath-forks'
import { useRoute } from '@react-navigation/native'
import { useAuthStore } from '../../store/authStore'

export default function Signup() {

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
   
    const{user,isLoading,register,token} = useAuthStore();

    
    const router = useRouter();
    
const handleSignUp = async () => {
     
    const result = await register(username,email,password);
    
    if(!result.success) Alert.alert("Error", result.error);
    
 };

    return (
        <KeyboardAvoidingView style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
            <View style={styles.container}>
                <View style={styles.card}>
                    {/* Header */}
                    <View style={styles.header}>
                        <Text style={styles.title}>BookWorm 🐛</Text>
                        <Text style={styles.subtitle}>Share your favorite reads</Text>
                    </View>

                    <View style={styles.formContainer}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Username</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="person-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput style={styles.input}
                                    placeholder="anubhavpatel"
                                    value={username}
                                    onChangeText={setUsername}
                                    placeholderTextColor={COLORS.placeholderText}

                                    autoCapitalize="none"
                                />
                            </View>
                        </View>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <View style={styles.inputContainer}>
                                <Ionicons name="mail-outline" size={20} color={COLORS.primary} style={styles.inputIcon} />
                                <TextInput style={styles.input}
                                    placeholder="anubhavpatel6391@gmail.com"
                                    value={email}
                                    onChangeText={setEmail}
                                    placeholderTextColor={COLORS.placeholderText}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                />
                            </View>

                        </View>
   

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
                    <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={isLoading}>
                        {isLoading ? (
                            <ActivityIndicator color="#fff" />
                        ) : (
                            <Text style={styles.buttonText}>SignUp</Text>
                        )}
                    </TouchableOpacity>

                    <View style={styles.footer}>
                            <Text style={styles.footerText}>Already have an account?</Text>
                             
                                <TouchableOpacity onPress={()=> router.back()} >
                                    <Text style={styles.link}>Login</Text>
                                </TouchableOpacity>
                        
                        </View>
                    </View>
                </View>
            </View>
        </KeyboardAvoidingView>
    )
}