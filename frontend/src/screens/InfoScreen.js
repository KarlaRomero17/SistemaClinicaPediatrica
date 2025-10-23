// src/screens/EnhancedLoginScreen.js
import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ScrollView
} from 'react-native';

const InfoScreen = ({ navigation }) => {
    return (
        <SafeAreaView style={styles.container}>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.keyboardView}
            >
                <ScrollView contentContainerStyle={styles.scrollContent}>
                    <View style={styles.header}>
                        <View style={styles.titleContainer}>
                            <Text style={styles.title}>Native Base</Text>
                        </View>
                        
                    </View>


                    <View style={styles.infoCard}>
                        <Text style={styles.infoText}>
                            Native-Base es una biblioteca de componentes que permite a los desarrolladores crear sistemas de diseño universal. Está construido sobre React Native, lo que le permite desarrollar aplicaciones para Android, iOS y la Web.
                        </Text>
                        
                    </View>

                    <View style={styles.separatorContainer}>
                        <View style={styles.separatorLine} />
                    </View>

                    <TouchableOpacity 
                        style={styles.loginButton} 
                        onPress={() => navigation.navigate('Login')}
                        activeOpacity={0.8}
                    >
                        <Text style={styles.loginButtonText}>Ingresar</Text>
                    </TouchableOpacity>

                </ScrollView>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f8fafc',
    },
    keyboardView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingHorizontal: 24,
        paddingVertical: 20,
    },
    header: {
        alignItems: 'center',
        paddingVertical: 40,
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    titleContainer: {
        alignItems: 'center',
        marginBottom: 8,
    },
    title: {
        color: '#3f51b5',
        fontSize: 48,
        fontWeight: 'bold',
        textAlign: 'center',
        letterSpacing: -0.5,
        marginBottom: 8,
    },
    infoCard: {
        borderRadius: 20,
        padding: 24,
        marginBottom: 30,
        borderWidth: 0,
    },
    infoText: {
        fontSize: 30,
        lineHeight: 24,
        color: '#475569',
        textAlign: 'left',
        marginBottom: 20,
    },

    separatorContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 30,
    },
    separatorLine: {
        flex: 1,
        height: 2,
        backgroundColor: '#000000ff',
        borderRadius: 5,
    },

    loginButton: {
        backgroundColor: '#3f51b5',
        borderRadius: 16,
        paddingVertical: 20,
        paddingHorizontal: 24,
        alignItems: 'center',
        marginBottom: 30,
        shadowColor: '#3f51b5',
        shadowOffset: {
            width: 0,
            height: 8,
        },
        shadowOpacity: 0.3,
        shadowRadius: 16,
        elevation: 12,
        borderWidth: 2,
    },
    loginButtonText: {
        color: 'white',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 0.5,
        marginBottom: 4,
    },

});

export default InfoScreen;