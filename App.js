import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { Ionicons } from '@expo/vector-icons';

// Importer skjermene
import HomeScreen from './screens/HomeScreen';
import CalendarScreen from './screens/CalendarScreen';
import AddEventScreen from './screens/AddEventScreen';
import ShoppingListScreen from './screens/ShoppingListScreen';
import FridgeScreen from './screens/FridgeScreen';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Stack-navigator for Kalender
function CalendarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Calendar" component={CalendarScreen} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
    </Stack.Navigator>
  );
}

// Hovednavigasjon med bunnmeny
export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: false,
          tabBarIcon: ({ color, size }) => {
            let iconName;
            if (route.name === 'Hjem') iconName = 'home';
            else if (route.name === 'Kjøleskap') iconName = 'snow-outline'; // Endret til gyldig ikon
            else if (route.name === 'Handleliste') iconName = 'cart';
            else if (route.name === 'Kalender') iconName = 'calendar';
            return <Ionicons name={iconName} size={size} color={color} />;
          },
        })}
      >
        <Tab.Screen name="Hjem" component={HomeScreen} />
        <Tab.Screen name="Kjøleskap" component={FridgeScreen} />
        <Tab.Screen name="Handleliste" component={ShoppingListScreen} />
        <Tab.Screen name="Kalender" component={CalendarStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
