import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { deleteEvent } from '../services/eventStorage';

const EventDetailsScreen = ({ route, navigation }) => {
  const { event } = route.params;

  const handleEdit = () => {
    navigation.navigate('EventForm', { event });
  };

  const handleDelete = () => {
    Alert.alert(
      "Delete Event",
      "Are you sure you want to delete this event?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        { 
          text: "Delete", 
          onPress: async () => {
            try {
              await deleteEvent(event.id);
              navigation.goBack();
            } catch (error) {
              console.error('Error deleting event:', error);
              // You could add an error alert here
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const formatDateTime = (dateString) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  };

  return (
    <View style={styles.container}>
      <View style={[styles.eventHeader, { backgroundColor: event.color || '#ccc7b3' }]}>
        <Text style={styles.eventTitle}>{event.title}</Text>
      </View>
      
      <View style={styles.eventDetails}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Start:</Text>
          <Text style={styles.detailValue}>{formatDateTime(event.start)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>End:</Text>
          <Text style={styles.detailValue}>{formatDateTime(event.end)}</Text>
        </View>
        
        {event.location && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Location:</Text>
            <Text style={styles.detailValue}>{event.location}</Text>
          </View>
        )}
        
        {event.description && (
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Description:</Text>
            <Text style={styles.detailValue}>{event.description}</Text>
          </View>
        )}
      </View>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.editButton]}
          onPress={handleEdit}
        >
          <Text style={styles.buttonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={[styles.button, styles.deleteButton]}
          onPress={handleDelete}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  eventHeader: {
    padding: 20,
    alignItems: 'center',
  },
  eventTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: 'white',
  },
  eventDetails: {
    padding: 20,
  },
  detailRow: {
    marginBottom: 15,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  detailValue: {
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    minWidth: 100,
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: '#ccc7b3',
  },
  deleteButton: {
    backgroundColor: '#dc3545',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  }
});

export default EventDetailsScreen;
