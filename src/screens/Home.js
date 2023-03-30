import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { auth, storage } from '../../App';
import { getAuth, sendPasswordResetEmail } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';

export default function Home({ navigation }) {
    const firebaseAuth = getAuth();
    const [imageURL, setImageURL] = useState(null);
    const user = firebaseAuth.currentUser;

    useEffect(() => {
        const storageRef = ref(storage, `${auth.currentUser.uid}.png`);
        getDownloadURL(storageRef)
            .then((url) => {
                setImageURL(url);
            })
            .catch((error) => {
                console.log(error);
            });
    }, []);

    const signOut = async () => {
        await firebaseAuth.signOut();
    };

    const handlePasswordReset = () => {
        if (auth.currentUser) {
            const email = auth.currentUser.email;
            sendPasswordResetEmail( auth, email)
                .then(() => {
                    Alert.alert(
                        'E-mail de redefinição de senha enviado.',
                        [{ text: 'OK', onPress: () => console.log('OK Pressed') }],
                        { cancelable: false }
                      );
                })
                .catch((error) => {
                    console.error(error);
                });
        } else {
            console.log('Usuário não está autenticado.');
        }
    };

    const handleFileUpload = async (event) => {
        event.preventDefault();
        const file = event.target.files[0];

        if (!file) return;

        const storageRef = ref(storage, `${auth.currentUser.uid}.png`);
        await uploadBytes(storageRef, file);

        const url = await getDownloadURL(storageRef);
        setImageURL(url);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Seja bem-vindo {user.displayName}!</Text>
            {imageURL && <Image source={{ uri: imageURL }} style={{ width: 200, height: 200 }} />}
            <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Profile')}>
                <Text style={styles.buttonText}>Perfil</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={signOut}>
                <Text style={styles.buttonText}>Sair</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
                <Text style={styles.buttonText}>Redefinir senha</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={() => {
                document.getElementById('upload').click();
            }}>
                <Text style={styles.buttonText}>Carregar foto</Text>
            </TouchableOpacity>
            <input
                id="upload"
                type="file"
                style={{ display: 'none' }}
                onChange={handleFileUpload}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#222',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#fff',
    },
    button: {
        alignItems: 'center',
        justifyContent: 'center',
        width: '20%',
        marginTop: 8,
        backgroundColor: '#0088cc',
        padding: 12,
        borderRadius: 4,
        marginBottom: 8,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
});