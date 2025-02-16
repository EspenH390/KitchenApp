import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { getDatabase, ref, push, onValue, remove } from 'firebase/database';
import { db } from '../firebaseConfig'; // 🔹 Importer Firebase-konfigurasjonen

// 🔹 Kategorier for matvarer
const foodCategories = {
  Meieri: ['melk', 'ost', 'yoghurt'],
  Brødvarer: ['brød', 'knekkebrød', 'baguette'],
  Frukt: ['eple', 'banan', 'appelsin'],
  Grønnsaker: ['gulrot', 'brokkoli', 'tomat'],
  Kjøtt: ['kylling', 'biff', 'svin'],
  Fisk: ['laks', 'torsk', 'makrell'],
  Kornvarer: ['ris', 'pasta', 'havregryn']
};

// 🔹 Emoji-funksjon for matvarer
const getEmojiForItem = (item) => {
  const foodEmojis = {
    melk: '🥛', brød: '🍞', eple: '🍏', banan: '🍌', ost: '🧀',
    kylling: '🍗', fisk: '🐟', ris: '🍚', pasta: '🍝', gulrot: '🥕',
    brokkoli: '🥦', tomat: '🍅'
  };
  return foodEmojis[item.toLowerCase()] || '🛒';
};

// 🔹 Handleliste-komponent
const ShoppingListScreen = () => {
  const [item, setItem] = useState('');
  const [shoppingList, setShoppingList] = useState([]);

  // 🔹 Hent handleliste fra Firebase
  useEffect(() => {
    const dbRef = ref(getDatabase(db), 'shoppingList');
    const unsubscribe = onValue(dbRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const formattedList = Object.keys(data).map((key) => ({
          id: key,
          name: data[key].name
        }));
        setShoppingList(formattedList);
      } else {
        setShoppingList([]);
      }
    });

    return () => unsubscribe(); // Rens opp lytter når komponenten unmountes
  }, []);

  // 🔹 Legg til vare i Firebase
  const addItem = () => {
    if (item.trim() !== '') {
      const dbRef = ref(getDatabase(db), 'shoppingList');
      push(dbRef, { name: item.trim() });
      setItem('');
    }
  };

  // 🔹 Slett vare fra handlelisten
  const removeItem = (id) => {
    const itemRef = ref(getDatabase(db), `shoppingList/${id}`);
    remove(itemRef);
  };

  // 🔹 Kategoriser handlelisten
  const categorizedList = {};
  shoppingList.forEach((item) => {
    const category = Object.keys(foodCategories).find((cat) =>
      foodCategories[cat].includes(item.name.toLowerCase())
    ) || 'Annet';

    if (!categorizedList[category]) {
      categorizedList[category] = [];
    }
    categorizedList[category].push(item);
  });

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Handleliste</Text>

      {/* 🔹 Input-felt for å legge til varer */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Legg til vare..."
          value={item}
          onChangeText={setItem}
        />
        <TouchableOpacity style={styles.addButton} onPress={addItem}>
          <Text style={styles.addButtonText}>+</Text>
        </TouchableOpacity>
      </View>

      {/* 🔹 Vis handlelisten kategorisert */}
      <FlatList
        data={Object.keys(categorizedList)}
        keyExtractor={(category) => category}
        renderItem={({ item: category }) => (
          <View>
            <Text style={styles.categoryHeader}>{category}</Text>
            {categorizedList[category].map((item) => (
              <View key={item.id} style={styles.listItem}>
                <Text style={styles.itemText}>{getEmojiForItem(item.name)} {item.name}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Text style={styles.removeButton}>🗑️</Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}
      />
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    backgroundColor: '#fff',
  },
  addButton: {
    marginLeft: 10,
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  categoryHeader: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 15,
    marginBottom: 5,
  },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 5,
    marginVertical: 5,
  },
  itemText: {
    fontSize: 18,
  },
  removeButton: {
    fontSize: 18,
    color: '#dc3545',
  },
});

export default ShoppingListScreen;