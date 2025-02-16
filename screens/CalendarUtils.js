import * as Calendar from 'expo-calendar';
import { Alert, Platform } from 'react-native';

// Be om tillatelser for å bruke kalenderen
async function requestCalendarPermissions() {
  const { status } = await Calendar.requestCalendarPermissionsAsync();
  if (status !== 'granted') {
    Alert.alert('Tillatelse kreves', 'Gi tilgang til kalenderen i innstillinger.');
    return false;
  }
  return true;
}

// Finn eller opprett en kalender for appen
async function getOrCreateCalendar() {
  const granted = await requestCalendarPermissions();
  if (!granted) return null;

  const calendars = await Calendar.getCalendarsAsync(Calendar.EntityTypes.EVENT);
  const existingCalendar = calendars.find(cal => cal.title === 'Måltidsplan');

  if (existingCalendar) {
    return existingCalendar.id;
  }

  const newCalendar = await Calendar.createCalendarAsync({
    title: 'Måltidsplan',
    color: 'blue',
    entityType: Calendar.EntityTypes.EVENT,
    source: Platform.OS === 'ios' ? { name: 'iCloud', type: 'caldav' } : { isLocalAccount: true },
    ownerAccount: 'personal',
    accessLevel: Calendar.CalendarAccessLevel.OWNER,
  });

  return newCalendar;
}

// Legg til en hendelse (måltid) i kalenderen
async function addMealToCalendar(mealName, date) {
  const calendarId = await getOrCreateCalendar();
  if (!calendarId) return;

  await Calendar.createEventAsync(calendarId, {
    title: `Middag: ${mealName}`,
    startDate: new Date(date),
    endDate: new Date(new Date(date).getTime() + 60 * 60 * 1000), // 1 time
    timeZone: 'Europe/Oslo',
  });

  Alert.alert('Lagt til i kalender', `${mealName} er lagt til i kalenderen!`);
}

export { addMealToCalendar };
