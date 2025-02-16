import React, { useState, useEffect } from 'react';
import { View, Text, Modal, TextInput, FlatList, TouchableOpacity, StyleSheet, Animated } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';

const CalendarScreen = () => {
  const [selectedDate, setSelectedDate] = useState('');
  const [events, setEvents] = useState({});
  const [modalVisible, setModalVisible] = useState(false);
  const [eventText, setEventText] = useState('');
  const [editingEvent, setEditingEvent] = useState(null);
  const fadeAnim = new Animated.Value(0);

  useEffect(() => {
    loadEvents();
  }, []);

  const saveEvents = async (newEvents) => {
    try {
      await AsyncStorage.setItem('events', JSON.stringify(newEvents));
      setEvents(newEvents);
    } catch (error) {
      console.log('Feil ved lagring av hendelser:', error);
    }
  };

  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('events');
      if (storedEvents) {
        setEvents(JSON.parse(storedEvents));
      }
    } catch (error) {
      console.log('Feil ved henting av hendelser:', error);
    }
  };

  const addEvent = () => {
    if (!eventText.trim()) return;
    const updatedEvents = { ...events };
    if (!updatedEvents[selectedDate]) {
      updatedEvents[selectedDate] = [];
    }
    if (editingEvent !== null) {
      updatedEvents[selectedDate][editingEvent] = eventText;
      setEditingEvent(null);
    } else {
      updatedEvents[selectedDate].push(eventText);
    }
    saveEvents(updatedEvents);
    setEventText('');
    setModalVisible(false);
  };

  const deleteEvent = (index) => {
    const updatedEvents = { ...events };
    updatedEvents[selectedDate].splice(index, 1);
    if (updatedEvents[selectedDate].length === 0) {
      delete updatedEvents[selectedDate];
    }
    saveEvents(updatedEvents);
  };

  const markedDates = Object.keys(events).reduce((acc, date) => {
    acc[date] = { marked: true, dotColor: 'blue' };
    return acc;
  }, {});

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={(day) => setSelectedDate(day.dateString)}
        markedDates={{
          ...markedDates,
          [selectedDate]: { selected: true, selectedColor: '#ff6347' },
        }}
        theme={{
          backgroundColor: '#ffffff',
          calendarBackground: '#f8f8f8',
          todayTextColor: '#ff6347',
          arrowColor: '#ff6347',
        }}
      />
      {selectedDate && (
        <View style={styles.eventContainer}>
          <Text style={styles.eventTitle}>Hendelser for {selectedDate}:</Text>
          <FlatList
            data={events[selectedDate] || []}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item, index }) => (
              <View style={styles.eventItem}>
                <Text style={styles.eventText}>{item}</Text>
                <TouchableOpacity onPress={() => deleteEvent(index)}>
                  <Ionicons name="trash" size={20} color="red" />
                </TouchableOpacity>
              </View>
            )}
          />
        </View>
      )}
      <TouchableOpacity style={styles.addButton} onPress={() => setModalVisible(true)}>
        <Ionicons name="add-circle" size={60} color="#ff6347" />
      </TouchableOpacity>
      <Modal visible={modalVisible} animationType="fade" transparent={true}>
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Ny hendelse</Text>
            <TextInput
              style={styles.input}
              placeholder="Skriv inn hendelse"
              value={eventText}
              onChangeText={setEventText}
            />
            <TouchableOpacity style={styles.saveButton} onPress={addEvent}>
              <Text style={styles.saveButtonText}>Lagre</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelButton}>Avbryt</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#fff' },
  eventContainer: { marginTop: 20 },
  eventTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  eventItem: { flexDirection: 'row', justifyContent: 'space-between', padding: 15, backgroundColor: '#f8f8f8', marginBottom: 5, borderRadius: 10 },
  eventText: { fontSize: 16 },
  addButton: { position: 'absolute', bottom: 20, right: 20 },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { width: 300, backgroundColor: 'white', padding: 20, borderRadius: 10, alignItems: 'center' },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginBottom: 10, width: '100%' },
  saveButton: { backgroundColor: '#ff6347', padding: 10, borderRadius: 5, width: '100%', alignItems: 'center' },
  saveButtonText: { color: 'white', fontWeight: 'bold' },
  cancelButton: { color: 'red', marginTop: 10 },
});

export default CalendarScreen;