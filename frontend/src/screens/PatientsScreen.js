import { useEffect, useState } from 'react';
import { 
    View, 
    Text, 
    TextInput, 
    ScrollView, 
    StyleSheet, 
    FlatList, 
    TouchableOpacity, 
    Alert, 
    Platform 
} from 'react-native';
import axios from 'axios';

// Ajusta la URL base según la plataforma
const BASE_URL = Platform.OS === 'android' ? 'http://10.175.160.103:5000' : 'http://localhost:5000';

const PatientsScreen = () => {
    const [inputText, setInputText] = useState('');
    const [patients, setPatients] = useState([]);
    const [isFocused, setIsFocused] = useState(false);
    const [editingId, setEditingId] = useState(null);

    // Mostrar pacientes
    useEffect(() => {
        loadPatients();
    }, []);

    const loadPatients = async () => {
        try {
            const result = await axios.get(`${BASE_URL}/api/pacientes`);
            setPatients(result.data);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los pacientes");
        }
    }

    const addPatient = async () => {
        if (inputText.trim()) {
            try {
                if (editingId) {
                    // Editando
                    await axios.put(`${BASE_URL}/api/pacientes/${editingId}`, {
                        nombre: inputText
                    });
                    setEditingId(null);
                    Alert.alert("Éxito", "Paciente actualizado con éxito");
                } else {
                    // Agregando
                    await axios.post(`${BASE_URL}/api/pacientes`, {
                        nombre: inputText
                    });
                    Alert.alert("Éxito", "Paciente agregado con éxito");
                }

                // Limpiar campo
                setInputText('');
                loadPatients();
            } catch (error) {
                Alert.alert("Error", "Error al guardar el paciente");
            }
        } else {
            Alert.alert("Error", "El nombre del paciente es obligatorio");
        }
    };

    const editPatient = (id) => {
        const patientToEdit = patients.find(p => p._id === id);
        if (patientToEdit) {
            setInputText(patientToEdit.nombre || '');
            setEditingId(id);
        }
    };

    const deletePatient = async (_id) => {
        try {
            await axios.delete(`${BASE_URL}/api/pacientes/${_id}`);
            loadPatients();
            Alert.alert("Éxito", "Paciente eliminado con éxito");
        } catch (error) {
            Alert.alert("Error", "No se pudo eliminar el paciente");
        }
    }

    const clearForm = () => {
        setInputText('');
        setEditingId(null);
    }

    return (
        <ScrollView 
            style={styles.scrollView}
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Gestión de Pacientes</Text>
                
                {/* Formulario */}
                <View style={styles.formContainer}>
                    <TextInput
                        style={[styles.input, { borderWidth: isFocused ? 3 : 1 }]}
                        placeholder='Nombre del paciente'
                        value={inputText}
                        onChangeText={setInputText}
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                    />

                    <View style={styles.buttonRow}>
                        <TouchableOpacity 
                            style={[
                                styles.addButton, 
                                editingId && styles.addButtonEditing
                            ]} 
                            onPress={addPatient}
                        >
                            <Text style={styles.addButtonText}>
                                {editingId ? "Actualizar Paciente" : "Agregar Paciente"}
                            </Text>
                        </TouchableOpacity>
                        
                        {editingId && (
                            <TouchableOpacity style={styles.cancelButton} onPress={clearForm}>
                                <Text style={styles.cancelButtonText}>Cancelar</Text>
                            </TouchableOpacity>
                        )}
                    </View>

                    <Text style={styles.counter}>Pacientes registrados: {patients.length}</Text>
                </View>

                {/* Lista de pacientes */}
                <View style={styles.listContainer}>
                    <Text style={styles.sectionTitle}>Lista de Pacientes</Text>
                    
                    {patients.length === 0 ? (
                        <Text style={styles.emptyText}>No hay pacientes registrados</Text>
                    ) : (
                        <FlatList
                            data={patients}
                            keyExtractor={(item) => item._id.toString()}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View style={styles.itemContainer}>
                                    <Text style={styles.itemTitle}>{item.nombre}</Text>

                                    <View style={styles.buttonGroup}>
                                        <TouchableOpacity 
                                            style={styles.editButton} 
                                            onPress={() => editPatient(item._id)}
                                        >
                                            <Text style={styles.buttonText}>Editar</Text>
                                        </TouchableOpacity>
                                        <TouchableOpacity 
                                            style={styles.deleteButton} 
                                            onPress={() => deletePatient(item._id)}
                                        >
                                            <Text style={styles.buttonText}>Eliminar</Text>
                                        </TouchableOpacity>
                                    </View>
                                </View>
                            )}
                        />
                    )}
                </View>
            </View>
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#fcffff',
    },
    scrollViewContent: {
        flexGrow: 1,
    },
    container: {
        flex: 1,
        alignItems: 'center',
        padding: 20,
        paddingTop: 50,
    },
    formContainer: {
        width: '100%',
        marginBottom: 30,
    },
    listContainer: {
        width: '100%',
    },
    title: {
        fontSize: 30,
        marginBottom: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        color: '#005187',
    },
    sectionTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#005187',
        marginBottom: 15,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#005187',
        borderWidth: 1,
        borderRadius: 10,
        marginBottom: 15,
        padding: 10,
        width: '100%',
        fontSize: 16,
        backgroundColor: '#ffffff',
    },
    buttonRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        marginBottom: 15,
    },
    addButton: {
        flex: 1,
        backgroundColor: '#005187',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    addButtonEditing: {
        marginRight: 10,
    },
    cancelButton: {
        flex: 1,
        backgroundColor: '#6c757d',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginLeft: 10,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    cancelButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    counter: {
        marginVertical: 15,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#005187',
    },
    itemContainer: {
        padding: 15,
        marginBottom: 15,
        backgroundColor: '#f8f9fa',
        borderRadius: 10,
        width: '100%',
        borderLeftWidth: 4,
        borderLeftColor: '#005187',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    itemTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#005187',
        marginBottom: 10,
        textAlign: 'center',
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#e4ab02',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginRight: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 12,
        borderRadius: 8,
        flex: 1,
        marginLeft: 8,
        justifyContent: 'center',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#6c757d',
        fontStyle: 'italic',
        marginTop: 20,
    },
});

export default PatientsScreen;