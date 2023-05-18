import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { auth, db } from '../../App';
import { doc, updateDoc, onSnapshot } from 'firebase/firestore';

export default function ToDoList() {
    const [todos, setTodos] = useState([]);
    const [isEnabled, setIsEnabled] = useState(false);
    const [write, setWrite] = useState('');

    const toggleSwitch = () => setIsEnabled((previousState) => !previousState);

    const setFinished = async (index) => {
        const updatedTodos = todos.map((todo, todoIndex) => {
            if (todoIndex === index) {
                return {
                    ...todo,
                    alreadyFinished: !todo.alreadyFinished,
                };
            }
            return todo;
        });

        setTodos(updatedTodos);

        const userRef = doc(db, "users", auth.currentUser.uid);
        await updateDoc(userRef, {
            tasks: updatedTodos,
        });
    };

    useEffect(() => {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const unsubscribe = onSnapshot(userRef, (doc) => {
            if (doc.exists()) {
                const userData = doc.data();
                if (userData.tasks) {
                    const tasksArray = Object.values(userData.tasks);
                    setTodos(tasksArray);
                }
            }
        });

        return () => unsubscribe();
    }, []);

    const addTodo = async () => {
        const userRef = doc(db, 'users', auth.currentUser.uid);
        const updatedTodos = [...todos, { name: write, alreadyFinished: false }];
        setTodos(updatedTodos);

        await updateDoc(userRef, {
            tasks: updatedTodos,
        });

        setWrite('');
    };

    const deleteTodo = async (index) => {
        const updatedTodos = todos.filter((_, todoIndex) => todoIndex !== index);

        setTodos(updatedTodos);

        const userRef = doc(db, 'users', auth.currentUser.uid);
        await updateDoc(userRef, {
            tasks: updatedTodos,
        });
    };

    const filteredTodos = todos.filter((todo) => (isEnabled ? !todo.alreadyFinished : true));

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>Lista de Compras</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        value={write}
                        onChangeText={setWrite}
                        style={styles.textInput}
                        placeholder="Adicionar item"
                    />
                    <TouchableOpacity style={styles.addButton} onPress={addTodo}>
                        <Text style={styles.buttonText}>Adicionar</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.todosContainer}>
                {filteredTodos.map((todo, index) => (
                    <View key={index} style={styles.todoItem}>
                        <View style={styles.todoInfo}>
                            <Switch
                                trackColor={{ false: '#767577', true: '#81b0ff' }}
                                thumbColor={todo.alreadyFinished ? '#f5dd4b' : '#f4f3f4'}
                                ios_backgroundColor="#3e3e3e"
                                onValueChange={() => setFinished(index)}
                                value={todo.alreadyFinished}
                            />
                            <Text style={styles.todoText}>{todo.name}</Text>
                        </View>
                        <TouchableOpacity style={styles.deleteButton} onPress={() => deleteTodo(index)}>
                            <Text style={styles.deleteText}>Excluir</Text>
                        </TouchableOpacity>
                    </View>
                ))}
            </View>

            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Mostrar não concluídos</Text>
                <Switch
                    trackColor={{ false: '#767577', true: '#81b0ff' }}
                    thumbColor={isEnabled ? '#f5dd4b' : '#f4f3f4'}
                    ios_backgroundColor="#3e3e3e"
                    onValueChange={toggleSwitch}
                    value={isEnabled}
                />
            </View>

            <StatusBar style="auto" />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#222',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
    },
    header: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 10,
        color: 'white',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    textInput: {
        borderWidth: 1,
        borderColor: 'black',
        padding: 8,
        marginRight: 10,
        flex: 1,
        color: 'white',
    },
    addButton: {
        backgroundColor: '#0088cc',
        padding: 10,
        borderRadius: 5,
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    deleteText: {
        color: 'red',
        fontWeight: 'bold',
    },
    todosContainer: {
        width: '70%',
        paddingHorizontal: 20,
    },
    todoItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
    },
    todoInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    todoText: {
        marginLeft: 10,
        fontSize: 16,
        color: 'white',
    },
    deleteButton: {
        paddingHorizontal: 10,
    },
    switchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20,
    },
    switchLabel: {
        marginRight: 10,
        fontSize: 16,
        color: 'white',
    },
});
