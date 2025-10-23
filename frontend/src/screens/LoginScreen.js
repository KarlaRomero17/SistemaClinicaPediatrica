// src/screens/EnhancedLoginScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator
} from 'react-native';

const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleLogin = async () => {
        if (!email || !password) {
            Alert.alert('Error', 'Por favor completa todos los campos');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Error', 'Por favor ingresa un email válido');
            return;
        }

        setLoading(true);

        // Simular proceso de login
        setTimeout(() => {
            setLoading(false);
            Alert.alert('Éxito', `Bienvenido ${email}`);
            // Aquí iría tu lógica real de autenticación
        }, 2000);
    };

    const isValidEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                {/* Header más compacto */}
                <View style={styles.header}>
                    <Text style={styles.title}>Bienvenido</Text>
                    <Text style={styles.subtitle}>Identifíquese para continuar!</Text>
                </View>

                {/* Formulario con menos margen superior */}
                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Correo electrónico</Text>
                        <TextInput
                            style={styles.input}
                            placeholder="tu.email@ejemplo.com"
                            placeholderTextColor="#999"
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoComplete="email"
                        />
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Contraseña</Text>
                        <View style={styles.passwordContainer}>
                            <TextInput
                                style={styles.passwordInput}
                                placeholder="••••••••"
                                placeholderTextColor="#999"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry={!showPassword}
                            />
                            <TouchableOpacity
                                style={styles.showPasswordButton}
                                onPress={() => setShowPassword(!showPassword)}
                            >
                                <Text style={styles.showPasswordText}>
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Olvidó contraseña */}
                    <TouchableOpacity style={styles.forgotPassword}>
                        <Text style={styles.forgotPasswordText}>Olvidó su contraseña?</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[
                            styles.loginButton,
                            (!email || !password) && styles.loginButtonDisabled
                        ]}
                        onPress={handleLogin}
                        disabled={!email || !password || loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="white" />
                        ) : (
                            <Text style={styles.loginButtonText}>Ingresar</Text>
                        )}
                    </TouchableOpacity>


                    {/* Registro */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>Nuevo usuario? </Text>
                        <TouchableOpacity>
                            <Text style={styles.registerLink}>Regístrese aquí</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#ffffff',
    },
    keyboardView: {
        flex: 1,
    },
    header: {
        paddingHorizontal: 30,
        paddingTop: 40,      
        paddingBottom: 20,    
        alignItems: 'flex-start', 
    },
    title: {
        color: '#3f51b5',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 8,    
    },
    subtitle: {
        color: '#b8b8b8',
        fontSize: 16,
    },
    form: {
        flex: 1,
        paddingHorizontal: 30,
        paddingTop: 10,  
        // justifyContent: 'center' removido para evitar centrado vertical
    },
    inputContainer: {
        marginBottom: 20,   
    },
    label: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,     
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        backgroundColor: '#f8f9fa',
    },
    passwordContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 12,
        backgroundColor: '#f8f9fa',
    },
    passwordInput: {
        flex: 1,
        padding: 16,
        fontSize: 16,
    },
    showPasswordButton: {
        padding: 16,
    },
    showPasswordText: {
        color: '#666',
        fontSize: 16,
    },
    forgotPassword: {
        alignSelf: 'flex-end',
        marginBottom: 25,   
    },
    forgotPasswordText: {
        color: '#3f51b5',
        fontSize: 14,
        fontWeight: '500',
    },
    loginButton: {
        backgroundColor: '#3f51b5',
        padding: 16,          
        borderRadius: 12,
        alignItems: 'center',
        marginBottom: 20,    
        shadowColor: '#3f51b5',
        shadowOffset: {
            width: 0,
            height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 8,
        borderWidth: 2,
    },
    loginButtonDisabled: {
        backgroundColor: '#9fa8da',
        shadowOpacity: 0.1,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 16,       
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    registerContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40,
    },
    registerText: {
        color: '#666',
        fontSize: 14,
    },
    registerLink: {
        color: '#3f51b5',
        fontSize: 14,
        fontWeight: 'bold',
    },
});

export default LoginScreen;