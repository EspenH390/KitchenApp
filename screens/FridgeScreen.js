import React, { useState, useEffect } from 'react';
import { View, Text, Button, FlatList, TouchableOpacity, Alert, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera, useCameraPermission } from 'react-native-vision-camera';

const FridgeScreen = () => {
  const [items, setItems] = useState([]);
  const [scanning, setScanning] = useState(false);
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    loadItems();
  }, []);

  const loadItems = async () => {
    try {
      const storedItems = await AsyncStorage.getItem('fridgeItems');
      if (storedItems) {
        setItems(JSON.parse(storedItems));
      }
    } catch (error) {
      console.log('Feil ved lasting av varer:', error);
    }
  };

  const saveItems = async (newItems) => {
    try {
      await AsyncStorage.setItem('fridgeItems', JSON.stringify(newItems));
      setItems(newItems);
    } catch (error) {
      console.log('Feil ved lagring av varer:', error);
    }
  };

  const handleBarCodeScanned = (barcode) => {
    setScanning(false);
    const newItem = { id: barcode.value, name: `Produkt ${barcode.value}` };
    setItems((prevItems) => {
      const updatedItems = [...prevItems, newItem];
      saveItems(updatedItems);
      return updatedItems;
    });
    Alert.alert('Vare lagt til', `Lagt til: ${newItem.name}`);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kjøleskap</Text>

      {!hasPermission ? (
        <Button title="Gi kamera-tilgang" onPress={requestPermission} />
      ) : scanning ? (
        <Camera
          style={styles.camera}
          device="back"
          isActive={scanning}
          onBarcodeScanned={handleBarCodeScanned}
        />
      ) : (
        <Button title="Skann strekkode" onPress={() => setScanning(true)} />
      )}

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onLongPress={() => saveItems(items.filter(i => i.id !== item.id))}>
            <Text>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10 },
  camera: { height: 300, width: '100%', marginBottom: 20 },
  item: { padding: 15, backgroundColor: '#f8f8f8', marginBottom: 10, borderRadius: 10 },
});

export default FridgeScreen;
