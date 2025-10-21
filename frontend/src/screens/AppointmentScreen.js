import { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Modal,
    TextInput,
    Alert,
    Platform,
    ScrollView
} from 'react-native';
import { MaskedTextInput } from "react-native-mask-text";
import axios from 'axios';

// Ajusta la URL base según la plataforma
const BASE_URL = Platform.OS === 'android' ? 'http://10.175.160.103:5000' : 'http://localhost:5000';

const AppointmentScreen = () => {
    const [appointments, setAppointments] = useState([]);
    const [patients, setPatients] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [loadingPatients, setLoadingPatients] = useState(false);

    // Campos del formulario
    const [selectedPatientId, setSelectedPatientId] = useState('');
    const [profesional, setProfesional] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');
    const [motivo, setMotivo] = useState('');
    const [estado, setEstado] = useState('confirmada');
    const [notas, setNotas] = useState('');

    // Estado para el select de pacientes
    const [showPatientDropdown, setShowPatientDropdown] = useState(false);

    // Cargar citas y pacientes al iniciar
    useEffect(() => {
        loadAppointments();
        loadPatients();
    }, []);

    const loadAppointments = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/citas`);
            setAppointments(response.data);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar las citas");
        } finally {
            setLoading(false);
        }
    };

    const loadPatients = async () => {
        setLoadingPatients(true);
        try {
            const response = await axios.get(`${BASE_URL}/api/pacientes`);
            setPatients(response.data);
        } catch (error) {
            Alert.alert("Error", "No se pudieron cargar los pacientes");
        } finally {
            setLoadingPatients(false);
        }
    };

    const addAppointment = async () => {
        if (!selectedPatientId || !profesional || !fecha || !hora || !motivo) {
            Alert.alert('Error', 'Por favor, complete todos los campos obligatorios');
            return;
        }

        try {
            const fechaCompleta = `${fecha}T${hora}:00Z`;
            const nuevaCita = {
                pacienteId: selectedPatientId,
                profesional: profesional,
                fecha: fechaCompleta,
                motivo: motivo,
                estado: estado,
                notas: notas
            };

            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                }
            };

            let response;
            if (editingId) {
                response = await axios.put(`${BASE_URL}/api/citas/${editingId}`, nuevaCita, config);
            } else {
                response = await axios.post(`${BASE_URL}/api/citas`, nuevaCita, config);
            }

            Alert.alert("Éxito", editingId ? "Cita actualizada correctamente" : "Cita creada correctamente");
            setEditingId(null);
            clearForm();
            setModalVisible(false);
            loadAppointments();

        } catch (error) {
            let errorMessage = "No se pudo guardar la cita";
            if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            } else if (error.response?.data?.errors) {
                errorMessage = JSON.stringify(error.response.data.errors);
            }

            Alert.alert("Error", errorMessage);
        }
    };

    const editAppointment = (appointment) => {
        // Separar fecha y hora del formato ISO
        const fechaHora = new Date(appointment.fecha);
        const fechaStr = fechaHora.toISOString().split('T')[0];
        const horaStr = fechaHora.toTimeString().split(':').slice(0, 2).join(':');

        setSelectedPatientId(appointment.pacienteId || '');
        setProfesional(appointment.profesional);
        setFecha(fechaStr);
        setHora(horaStr);
        setMotivo(appointment.motivo);
        setEstado(appointment.estado);
        setNotas(appointment.notas || '');
        setEditingId(appointment._id);
        setModalVisible(true);
    };

    const deleteAppointment = async (id) => {
        Alert.alert(
            "Confirmar Eliminación",
            "¿Estás seguro de que quieres eliminar esta cita?",
            [
                { text: "Cancelar", style: "cancel" },
                {
                    text: "Eliminar",
                    style: "destructive",
                    onPress: async () => {
                        try {
                            await axios.delete(`${BASE_URL}/api/citas/${id}`);
                            Alert.alert("Éxito", "Cita eliminada correctamente");
                            loadAppointments();
                        } catch (error) {
                            Alert.alert("Error", "No se pudo eliminar la cita");
                            console.error('Error deleting appointment:', error);
                        }
                    }
                }
            ]
        );
    };

    const clearForm = () => {
        setSelectedPatientId('');
        setProfesional('');
        setFecha('');
        setHora('');
        setMotivo('');
        setEstado('confirmada');
        setNotas('');
        setEditingId(null);
        setShowPatientDropdown(false);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleDateString('es-ES');
    };

    const formatTime = (isoString) => {
        const date = new Date(isoString);
        return date.toLocaleTimeString('es-ES', {
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getPatientName = (patientId) => {
        if (!patientId) {
            return 'Paciente no seleccionado';
        }
        
        return patientId ? patientId.nombre : 'Paciente no encontrado';
    };

    const getSelectedPatientName = () => {
        if (!selectedPatientId) {
            return 'Seleccione un paciente *';
        }

        const patient = patients.find(p => p._id === selectedPatientId);
        return patient ? patient.nombre : 'Paciente no encontrado';
    };

    const handlePatientSelect = (patientId, patientName) => {
        setSelectedPatientId(patientId);
        setShowPatientDropdown(false);
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.container}>
                <Text style={styles.title}>Citas Programadas</Text>

                {loading ? (
                    <Text style={styles.loadingText}>Cargando citas...</Text>
                ) : appointments.length === 0 ? (
                    <Text style={styles.emptyText}>No hay citas programadas</Text>
                ) : (
                    <FlatList
                        data={appointments}
                        keyExtractor={(item) => item._id}
                        scrollEnabled={false}
                        contentContainerStyle={styles.listContainer}
                        ItemSeparatorComponent={() => <View style={styles.separator} />}
                        renderItem={({ item }) => (
                            <View style={styles.card}>
                                <Text style={styles.cardText}>
                                    <Text style={styles.bold}>Paciente:</Text> {getPatientName(item.pacienteId)}
                                </Text>
                                <Text style={styles.cardText}>
                                    <Text style={styles.bold}>Profesional:</Text> {item.profesional}
                                </Text>
                                <Text style={styles.cardText}>
                                    <Text style={styles.bold}>Fecha:</Text> {formatDate(item.fecha)}
                                </Text>
                                <Text style={styles.cardText}>
                                    <Text style={styles.bold}>Hora:</Text> {formatTime(item.fecha)}
                                </Text>
                                <Text style={styles.cardText}>
                                    <Text style={styles.bold}>Motivo:</Text> {item.motivo}
                                </Text>
                                <Text style={styles.cardText}>
                                    <Text style={styles.bold}>Estado:</Text> {item.estado}
                                </Text>
                                {item.notas && (
                                    <Text style={styles.cardText}>
                                        <Text style={styles.bold}>Notas:</Text> {item.notas}
                                    </Text>
                                )}

                                <View style={styles.buttonGroup}>
                                    <TouchableOpacity
                                        style={styles.editButton}
                                        onPress={() => editAppointment(item)}
                                    >
                                        <Text style={styles.buttonText}>Editar</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity
                                        style={styles.deleteButton}
                                        onPress={() => deleteAppointment(item._id)}
                                    >
                                        <Text style={styles.buttonText}>Eliminar</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        )}
                    />
                )}

                <TouchableOpacity
                    style={styles.addButton}
                    onPress={() => {
                        clearForm();
                        setModalVisible(true);
                    }}
                >
                    <Text style={styles.addButtonText}>Nueva Cita</Text>
                </TouchableOpacity>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        setModalVisible(false);
                        clearForm();
                    }}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>
                                {editingId ? "Editar Cita" : "Agregar Nueva Cita"}
                            </Text>

                            <ScrollView style={styles.modalScroll} showsVerticalScrollIndicator={false}>
                                <View style={styles.selectContainer}>
                                    <Text style={styles.selectLabel}>Seleccionar Paciente *</Text>
                                    {loadingPatients ? (
                                        <Text style={styles.loadingText}>Cargando pacientes...</Text>
                                    ) : (
                                        <View>
                                            <TouchableOpacity
                                                style={styles.selectButton}
                                                onPress={() => setShowPatientDropdown(!showPatientDropdown)}
                                            >
                                                <Text style={[
                                                    styles.selectButtonText,
                                                    !selectedPatientId && styles.placeholderText
                                                ]}>
                                                    {getSelectedPatientName()}
                                                </Text>
                                                <Text style={styles.selectArrow}>▼</Text>
                                            </TouchableOpacity>

                                            {showPatientDropdown && (
                                                <View style={styles.dropdown}>
                                                    <ScrollView style={styles.dropdownScroll} nestedScrollEnabled={true}>
                                                        {patients.map((patient) => (
                                                            <TouchableOpacity
                                                                key={patient._id}
                                                                style={[
                                                                    styles.dropdownItem,
                                                                    selectedPatientId === patient._id && styles.selectedItem
                                                                ]}
                                                                onPress={() => handlePatientSelect(patient._id, patient.nombre)}
                                                            >
                                                                <Text style={styles.dropdownItemText}>
                                                                    {patient.nombre}
                                                                </Text>
                                                                <Text style={styles.dropdownItemId}>
                                                                    {patient._id}
                                                                </Text>
                                                            </TouchableOpacity>
                                                        ))}
                                                    </ScrollView>
                                                </View>
                                            )}
                                        </View>
                                    )}
                                </View>

                                <TextInput
                                    style={styles.input}
                                    placeholder="Profesional *"
                                    value={profesional}
                                    onChangeText={setProfesional}
                                />

                                <MaskedTextInput
                                    mask="9999-99-99"
                                    placeholder="YYYY-MM-DD *"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    value={fecha}
                                    onChangeText={setFecha}
                                />

                                <MaskedTextInput
                                    mask="99:99"
                                    placeholder="HH:MM *"
                                    keyboardType="numeric"
                                    style={styles.input}
                                    value={hora}
                                    onChangeText={setHora}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Motivo *"
                                    value={motivo}
                                    onChangeText={setMotivo}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Estado (confirmada, pendiente, cancelada)"
                                    value={estado}
                                    onChangeText={setEstado}
                                />

                                <TextInput
                                    style={[styles.input, styles.textArea]}
                                    placeholder="Notas adicionales"
                                    value={notas}
                                    onChangeText={setNotas}
                                    multiline
                                    numberOfLines={3}
                                />

                                <View style={styles.modalButtons}>
                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.cancelButton]}
                                        onPress={() => {
                                            setModalVisible(false);
                                            clearForm();
                                        }}
                                    >
                                        <Text style={styles.modalButtonText}>Cancelar</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        style={[styles.modalButton, styles.saveButton]}
                                        onPress={addAppointment}
                                    >
                                        <Text style={styles.modalButtonText}>
                                            {editingId ? "Actualizar" : "Agregar"}
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>
                        </View>
                    </View>
                </Modal>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollView: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    container: {
        flex: 1,
        padding: 20,
        paddingTop: 50,
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
    emptyText: {
        textAlign: 'center',
        fontSize: 16,
        color: '#666',
        marginTop: 50,
        fontStyle: 'italic',
    },
    loadingText: {
        textAlign: 'center',
        fontSize: 14,
        color: '#666',
        fontStyle: 'italic',
        padding: 10,
    },
    card: {
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 2,
    },
    cardText: {
        fontSize: 14,
        marginBottom: 4,
        color: '#333',
    },
    bold: {
        fontWeight: 'bold',
        color: '#005187',
    },
    separator: {
        height: 10,
    },
    buttonGroup: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
    },
    editButton: {
        backgroundColor: '#e4ab02',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginRight: 5,
        alignItems: 'center',
    },
    deleteButton: {
        backgroundColor: '#dc3545',
        padding: 10,
        borderRadius: 5,
        flex: 1,
        marginLeft: 5,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 14,
        fontWeight: 'bold',
    },
    addButton: {
        width: '100%',
        backgroundColor: '#6a0dad',
        borderRadius: 10,
        height: 50,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20,
        marginBottom: 20,
    },
    addButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
        padding: 20,
    },
    modalContent: {
        backgroundColor: 'white',
        borderRadius: 10,
        padding: 20,
        maxHeight: '90%',
    },
    modalScroll: {
        maxHeight: 520,
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 15,
        textAlign: 'center',
        color: '#6a0dad',
    },
    selectContainer: {
        marginBottom: 15,
    },
    selectLabel: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
        color: '#333',
    },
    selectButton: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        backgroundColor: '#fff',
    },
    selectButtonText: {
        fontSize: 16,
        color: '#333',
    },
    placeholderText: {
        color: '#999',
    },
    selectArrow: {
        fontSize: 12,
        color: '#666',
    },
    dropdown: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        backgroundColor: '#fff',
        marginTop: 5,
        maxHeight: 150,
    },
    dropdownScroll: {
        maxHeight: 150,
    },
    dropdownItem: {
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: '#f0f0f0',
    },
    selectedItem: {
        backgroundColor: '#e6f7ff',
    },
    dropdownItemText: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
    },
    dropdownItemId: {
        fontSize: 10,
        color: '#666',
        marginTop: 2,
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        padding: 12,
        marginVertical: 5,
        fontSize: 16,
        backgroundColor: '#fff',
    },
    textArea: {
        height: 80,
        textAlignVertical: 'top',
    },
    modalButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
    },
    modalButton: {
        flex: 1,
        padding: 15,
        borderRadius: 5,
        alignItems: 'center',
        marginHorizontal: 5,
    },
    cancelButton: {
        backgroundColor: '#6c757d',
    },
    saveButton: {
        backgroundColor: '#6a0dad',
    },
    modalButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default AppointmentScreen;