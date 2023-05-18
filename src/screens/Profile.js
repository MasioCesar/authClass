import { View, Text, Button, TextInput, Alert, StyleSheet } from "react-native";
import { getAuth, updateProfile } from "firebase/auth";
import { useState } from "react";

const Profile = () => {
    const firebaseAuth = getAuth();
    const user = firebaseAuth.currentUser;
  
    const [name, setName] = useState(user.displayName);
  
    const updateUserProfile = () => {
      console.log('Updating...');
      updateProfile(user, {
        displayName: name,
      })
        .then(() => {
          Alert.alert('Aplicativo', 'Perfil atualizado!', [{ text: 'OK', onPress: () => {} }]);
        })
        .catch((error) => {
          console.error(error);
          Alert.alert('Aplicativo', 'Não foi possível atualizar o perfil!', [{ text: 'OK', onPress: () => {} }]);
        });
    };
  
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Perfil</Text>
        <View style={styles.formContainer}>
          <Text style={styles.label}>Nome</Text>
          <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="Digite seu nome" />
          <Button title="Salvar" onPress={updateUserProfile} />
        </View>
        {user.emailVerified ? (
          <Text style={styles.emailVerified}>Email verificado</Text>
        ) : (
          <Text style={styles.emailNotVerified}>Email não verificado</Text>
        )}
      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: '#191919',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 24,
    },
    formContainer: {
      width: '80%',
      marginBottom: 24,
    },
    label: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 8,
    },
    input: {
      height: 40,
      borderWidth: 1,
      borderColor: '#fff',
      borderRadius: 4,
      paddingHorizontal: 8,
      marginBottom: 16,
      color: '#fff',
    },
    emailVerified: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#0f0',
    },
    emailNotVerified: {
      fontSize: 16,
      fontWeight: 'bold',
      color: '#f00',
    },
  });
  
  export default Profile;