import React, { useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { auth, storage, db } from '../../App';
import { createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";
import { ref, uploadBytes } from "firebase/storage";
import { doc, setDoc } from 'firebase/firestore';

export default function RegisterScreen({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then(async (userCredential) => {
                const actionCodeSettings = {
                    url: 'http://localhost:19006/Login',
                    handleCodeInApp: true
                };
                try {
                    const userRef = doc(db, "users", auth.currentUser.uid);
                    await setDoc(userRef, {});
                    await updateProfile(userCredential.user, {
                        displayName: username,
                    });

                    await sendEmailVerification(userCredential.user, actionCodeSettings);
                    const storageRef = ref(storage, auth.currentUser.uid + ".png");
                    await uploadBytes(storageRef);

                    navigation.navigate('Login');
                } catch (error) {
                    console.log(error);
                    alert(error);
                }
            })
            .catch((error) => {
                setError(error.message);
            });
    };



    return (
        <View style={styles.container}>
            <Text style={styles.title}>Register</Text>
            {error ? <Text style={styles.error}>{error}</Text> : null}
            <TextInput
                style={styles.input}
                placeholder="Email"
                onChangeText={(text) => setEmail(text)}
                value={email}
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                onChangeText={(text) => setPassword(text)}
                value={password}
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Username"
                onChangeText={(text) => setUsername(text)}
                value={username}
            />
            <TouchableOpacity style={styles.button} onPress={handleSignUp}>
                <Text style={styles.buttonText}>Register</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
                <Text style={styles.buttonText}>Back to Login</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        width: '100%',
        height: 50,
        borderWidth: 1,
        borderColor: '#fff',
        color: '#fff',
        borderRadius: 5,
        paddingLeft: 10,
        marginBottom: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#0066cc',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 10,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
});