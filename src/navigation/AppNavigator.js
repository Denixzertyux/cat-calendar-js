import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import CalendarScreen from '../screens/CalendarScreen';
import EventFormScreen from '../screens/EventFormScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Calendar">
        <Stack.Screen 
          name="Calendar" 
          component={CalendarScreen} 
          options={{ 
            title: "Cat Calendar",
            headerStyle: {
              backgroundColor: '#ccc7b3',
            },
            headerTintColor: '#fff',
          }}
        />
        <Stack.Screen 
          name="EventForm" 
          component={EventFormScreen} 
          options={({ route }) => ({ 
            title: route.params?.event ? "Edit Event" : "Add Event",
            headerStyle: {
              backgroundColor: '#ccc7b3',
            },
            headerTintColor: '#fff',
          })}
        />
        <Stack.Screen 
          name="EventDetails" 
          component={EventDetailsScreen} 
          options={{ 
            title: "Event Details",
            headerStyle: {
              backgroundColor: '#ccc7b3',
            },
            headerTintColor: '#fff',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
