import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  StyleSheet, 
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { saveEvent } from '../services/eventStorage';

const EventFormScreen = ({ route, navigation }) => {
  const initialEvent = route.params?.event || {
    title: '',
    start: new Date(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)),
    description: '',
    location: '',
    color: '#ccc7b3',
  };

  const [formData, setFormData] = useState(initialEvent);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showStartTimePicker, setShowStartTimePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showEndTimePicker, setShowEndTimePicker] = useState(false);

  const handleChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (name, selectedDate) => {
    if (selectedDate) {
      const currentDate = new Date(formData[name]);
      
      if (name === 'start') {
        setShowStartDatePicker(Platform.OS === 'ios');
        setShowStartTimePicker(Platform.OS === 'ios');
      } else {
        setShowEndDatePicker(Platform.OS === 'ios');
        setShowEndTimePicker(Platform.OS === 'ios');
      }
      
      // If we're setting just the date part
      if (!showStartTimePicker && !showEndTimePicker) {
        selectedDate.setHours(currentDate.getHours(), currentDate.getMinutes());
      }
      
      setFormData(prev => ({ ...prev, [name]: selectedDate }));
    }
  };

  const handleSave = async () => {
    try {
      await saveEvent(formData);
      navigation.goBack();
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString();
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formGroup}>
        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(value) => handleChange('title', value)}
          placeholder="Event title"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text>{formatDate(formData.start)}</Text>
        </TouchableOpacity>
        {showStartDatePicker && (
          <DateTimePicker
            value={new Date(formData.start)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              handleDateChange('start', selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Start Time</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowStartTimePicker(true)}
        >
          <Text>{formatTime(formData.start)}</Text>
        </TouchableOpacity>
        {showStartTimePicker && (
          <DateTimePicker
            value={new Date(formData.start)}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              handleDateChange('start', selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text>{formatDate(formData.end)}</Text>
        </TouchableOpacity>
        {showEndDatePicker && (
          <DateTimePicker
            value={new Date(formData.end)}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              handleDateChange('end', selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>End Time</Text>
        <TouchableOpacity 
          style={styles.dateButton}
          onPress={() => setShowEndTimePicker(true)}
        >
          <Text>{formatTime(formData.end)}</Text>
        </TouchableOpacity>
        {showEndTimePicker && (
          <DateTimePicker
            value={new Date(formData.end)}
            mode="time"
            display="default"
            onChange={(event, selectedDate) => {
              handleDateChange('end', selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Location</Text>
        <TextInput
          style={styles.input}
          value={formData.location}
          onChangeText={(value) => handleChange('location', value)}
          placeholder="Event location"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={formData.description}
          onChangeText={(value) => handleChange('description', value)}
          placeholder="Event description"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Color</Text>
        <View style={styles.colorOptions}>
          {['#D4A76A', '#A67B5B', '#3E2C1C', '#F5CBA7', '#4A3D8B'].map(color => (
            <TouchableOpacity
              key={color}
              style={[
                styles.colorOption,
                { backgroundColor: color },
                formData.color === color && styles.selectedColorOption
              ]}
              onPress={() => handleChange('color', color)}
            />
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, styles.saveButton]}
          onPress={handleSave}
        >
          <Text style={styles.buttonText}>Save Event</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.button, styles.cancelButton]}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  formGroup: {
    marginBottom: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
  },
  colorOptions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  colorOption: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  selectedColorOption: {
    borderWidth: 3,
    borderColor: '#000',
  },
  buttonContainer: {
    marginTop: 20,
    marginBottom: 30,
  },
  button: {
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#3E2C1C3',
  },
  cancelButton: {
    backgroundColor: '#ccc7b3',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
});

export default EventFormScreen;
