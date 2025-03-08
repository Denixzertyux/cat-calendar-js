import AsyncStorage from '@react-native-async-storage/async-storage';

const EVENTS_STORE = 'calendar-events';

export const getEvents = async () => {
  try {
    const eventsJson = await AsyncStorage.getItem(EVENTS_STORE);
    return eventsJson ? JSON.parse(eventsJson) : [];
  } catch (error) {
    console.error('Error fetching events:', error);
    return [];
  }
};

export const saveEvent = async (event) => {
  try {
    const events = await getEvents();
    const newEvent = {
      ...event,
      id: event.id || Date.now().toString(),
    };
    
    const updatedEvents = event.id 
      ? events.map(e => e.id === event.id ? newEvent : e)
      : [...events, newEvent];
      
    await AsyncStorage.setItem(EVENTS_STORE, JSON.stringify(updatedEvents));
    return newEvent;
  } catch (error) {
    console.error('Error saving event:', error);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const events = await getEvents();
    const updatedEvents = events.filter(e => e.id !== eventId);
    await AsyncStorage.setItem(EVENTS_STORE, JSON.stringify(updatedEvents));
    return true;
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};
