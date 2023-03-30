import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert } from 'react-native';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from '../../App';
import * as SecureStore from 'expo-secure-store';
import validator from "validator";

export default function Login({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [buttonDisabled, setButtonDisabled] = useState(true);

  const doLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
        SecureStore.setItemAsync("user", JSON.stringify(user));
        navigation.navigate('Home');
      })
      .catch((error) => {
        console.error(error);
        Alert.alert('Aplicativo', 'Não foi possível fazer o login!', [
          { text: 'OK', onPress: () => { } },
        ]);
      })
  }

  useEffect(() => {
    if (validator.isEmail(email) && validator.isLength(password, 6)) {
      setButtonDisabled(false);
    } else {
      setButtonDisabled(true);
    }
  }, [email, password]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        placeholderTextColor="#d9d9d9"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        placeholderTextColor="#d9d9d9"
      />
      <TouchableOpacity style={styles.button} onPress={doLogin} disabled={buttonDisabled}>
        <Text style={styles.buttonText}>Entrar</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Ainda não tem uma conta? Crie aqui</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1c1c1c',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#fff',
  },
  input: {
    width: '80%',
    height: 48,
    padding: 8,
    borderWidth: 1,
    borderColor: '#808080',
    marginBottom: 16,
    color: '#fff',
  },
  button: {
    backgroundColor: '#0088cc',
    padding: 12,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  link: {
    color: '#0088cc',
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});