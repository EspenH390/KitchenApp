import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { db } from '../firebaseConfig'; // ✅ Sjekk at denne peker til riktig fil
import { ref, push } from 'firebase/database';

const AddEventScreen = ({ navigation }) => {
  const [eventTitle, setEventTitle] = useState('');
  const [eventDate, setEventDate] = useState(new Date());
  const [showPicker, setShowPicker] = useState(false);

  // Håndter datoendring
  const onDateChange = (event, selectedDate) => {
    setShowPicker(false);
    if (selectedDate) setEventDate(selectedDate);
  };

  // Legg til arrangement i Firebase
  const addEvent = () => {
    if (eventTitle.trim() === '') {
      Alert.alert('Feil', 'Tittel kan ikke være tom.');
      return;
    }

    const eventsRef = ref(db, 'events');
    push(eventsRef, {
      title: eventTitle,
      date: eventDate.toISOString(),
    }).then(() => {
      Alert.alert('Suksess', 'Hendelse lagt til!');
      setEventTitle('');
      navigation.goBack(); // Tilbake til kalenderen
    }).catch((error) => {
      Alert.alert('Feil', 'Kunne ikke lagre hendelsen.');
      console.error(error);
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Legg til hendelse</Text>
      
      <TextInput
        style={styles.input}
        placeholder="Tittel på hendelsen"
        value={eventTitle}
        onChangeText={setEventTitle}
      />

      <Button title="Velg dato" onPress={() => setShowPicker(true)} />
      {showPicker && (
        <DateTimePicker
          value={eventDate}
          mode="date"
          display="default"
          onChange={onDateChange}
        />
      )}

      <Button title="Lagre" onPress={addEvent} color="green" />
    </View>
  );
};

// **🎨 STILSETTING**
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f8f9fa',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
});

export default AddEventScreen;
