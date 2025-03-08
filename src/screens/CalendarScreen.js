import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, TouchableOpacity, Text, ScrollView, Dimensions } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useFocusEffect } from '@react-navigation/native';
import { getEvents } from '../services/eventStorage';
import CatImage from '../components/CatImage';
import CustomCalendarHeader from '../components/CustomCalendarHeader';


const { height } = Dimensions.get('window');

const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const DAY_NAMES = [
  'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
];

const CalendarScreen = ({ navigation }) => {
  const [events, setEvents] = useState([]);
  const [selectedDate, setSelectedDate] = useState('');
  const [calendarView, setCalendarView] = useState('month'); 
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth());
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear());


  useEffect(() => {
    loadEvents();
    setSelectedDate(new Date().toISOString().split('T')[0]);
  }, []);


  useFocusEffect(
    useCallback(() => {
      loadEvents();
      return () => {};
    }, [])
  );

  const loadEvents = async () => {
    const storedEvents = await getEvents();
    setEvents(storedEvents);
  };


  const formatTime = (date) => {
    let hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    
    hours = hours % 12;
    hours = hours ? hours : 12; 
    
    const minutesStr = minutes < 10 ? '0' + minutes : minutes;
    
    return `${hours}:${minutesStr} ${ampm}`;
  };


  const getMarkedDates = () => {
    const markedDates = {};
    
    events.forEach(event => {
      const startDate = new Date(event.start);
      const endDate = new Date(event.end);
      
      const currentDate = new Date(startDate);
      while (currentDate <= endDate) {
        const dateString = currentDate.toISOString().split('T')[0];
        
        
        const isStart = currentDate.getDate() === startDate.getDate() && 
                        currentDate.getMonth() === startDate.getMonth() && 
                        currentDate.getFullYear() === startDate.getFullYear();
        
        const isEnd = currentDate.getDate() === endDate.getDate() && 
                      currentDate.getMonth() === endDate.getMonth() && 
                      currentDate.getFullYear() === endDate.getFullYear();
                      

        if (isStart && isEnd) {
          //
          markedDates[dateString] = {
            marked: true,
            dotColor: event.color || '#ccc7b3'
          };
        } else if (isStart) {
          
          markedDates[dateString] = {
            startingDay: true,
            color: event.color || '#ccc7b3',
            textColor: 'white'
          };
        } else if (isEnd) {
          
          markedDates[dateString] = {
            endingDay: true,
            color: event.color || '#ccc7b3',
            textColor: 'white'
          };
        } else {
          markedDates[dateString] = {
            color: event.color || '#ccc7b3',
            textColor: 'white'
          };
        }
        
        
        if (dateString === selectedDate) {
          markedDates[dateString] = {
            ...markedDates[dateString],
            selected: true,
            selectedColor: 'rgba(204,199,179)'
          };
        }
        
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });
    
    return markedDates;
  };


  const getEventsForSelectedDate = () => {
    if (!selectedDate) return [];
    
    const selectedDateObj = new Date(selectedDate);
    
    return events.filter(event => {
      const eventStart = new Date(event.start);
      const eventEnd = new Date(event.end);
      
      return selectedDateObj >= eventStart && selectedDateObj <= eventEnd;
    });
  };

  const handleDayPress = (day) => {
    setSelectedDate(day.dateString);
    setCalendarView('agenda');
  };

  const handleAddEvent = () => {
    const formParams = selectedDate ? {
      event: {
        start: new Date(selectedDate),
        end: new Date(new Date(selectedDate).setHours(new Date(selectedDate).getHours() + 1)),
        title: '',
        description: '',
        location: '',
        color: '#ccc7b3'
      }
    } : {};
    
    navigation.navigate('EventForm', formParams);
  };

  const handleViewEvent = (event) => {
    navigation.navigate('EventDetails', { event });
  };

  const toggleView = () => {
    setCalendarView(calendarView === 'month' ? 'agenda' : 'month');
  };

  const formatSelectedDate = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    const dayName = DAY_NAMES[date.getDay()];
    const monthName = MONTH_NAMES[date.getMonth()];
    const dayOfMonth = date.getDate();
    return `${dayName}, ${monthName} ${dayOfMonth}`;
  };

  const handleMonthChange = (monthData) => {
    console.log('Month changed:', monthData);
    setCurrentMonth(monthData.month - 1); 
    setCurrentYear(monthData.year);
  };


  const calculateDuration = (start, end) => {
    return Math.round((new Date(end) - new Date(start)) / (1000 * 60));
  };

  return (
    <View style={styles.container}>
      {calendarView === 'month' ? (
        
        <>
          {      }
          <CustomCalendarHeader 
            currentMonth={currentMonth} 
            currentYear={currentYear} 
          />
          
          <Calendar
            style={styles.calendar}
            onDayPress={handleDayPress}
            markedDates={getMarkedDates()}
            markingType={'period'} 
            theme={{
              selectedDayBackgroundColor: '#ccc7b3',
              todayTextColor: '#ccc7b3',
              arrowColor: '#ccc7b3',
              textMonthFontWeight: 'bold',
              textMonthFontSize: 18,
              'stylesheet.calendar.header': {
                monthText: {
                  fontSize: 0,
                  margin: 0,
                  height: 0
                }
              }
            }}
            enableSwipeMonths={true}
            onMonthChange={handleMonthChange}
          />
          
          <View style={styles.viewToggleContainer}>
            <TouchableOpacity onPress={toggleView} style={styles.viewToggleButton}>
              <Text style={styles.viewToggleText}>Show Agenda View</Text>
            </TouchableOpacity>
          </View>
          
          <View style={styles.miniEventsContainer}>
            <Text style={styles.selectedDateText}>{formatSelectedDate()}</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddEvent}
            >
              <Text style={styles.addButtonText}>+ Add Event</Text>
            </TouchableOpacity>
            
            <ScrollView style={styles.miniEventsList}>
              {getEventsForSelectedDate().length === 0 ? (
                <Text style={styles.noEventsText}>No events for this date</Text>
              ) : (
                getEventsForSelectedDate().map(event => (
                  <TouchableOpacity
                    key={event.id}
                    style={[styles.eventItem, { borderLeftColor: event.color || '#ccc7b3' }]}
                    onPress={() => handleViewEvent(event)}
                  >
                    <Text style={styles.eventTitle}>{event.title}</Text>
                    <Text style={styles.eventTime}>
                      {formatTime(new Date(event.start))}
                    </Text>
                  </TouchableOpacity>
                ))
              )}
            </ScrollView>
          </View>
        </>
      ) : (
        <View style={styles.agendaContainer}>
          <View style={styles.agendaHeader}>
            <TouchableOpacity onPress={toggleView} style={styles.backButton}>
              <Text style={styles.backButtonText}>Calendar</Text>
            </TouchableOpacity>
            <Text style={styles.agendaDateText}>{formatSelectedDate()}</Text>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={handleAddEvent}
            >
              <Text style={styles.addButtonText}>+</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView style={styles.agendaEventsList}>
            {getEventsForSelectedDate().length === 0 ? (
              <View style={styles.noEventsContainer}>
                <Text style={styles.noEventsText}>No events scheduled for today</Text>
                <TouchableOpacity 
                  style={styles.createEventButton}
                  onPress={handleAddEvent}
                >
                  <Text style={styles.createEventButtonText}>Create New Event</Text>
                </TouchableOpacity>
              </View>
            ) : (
              getEventsForSelectedDate().map(event => (
                <TouchableOpacity
                  key={event.id}
                  style={[styles.agendaEventItem, { borderLeftColor: event.color || '#3E2C1C' }]}
                  onPress={() => handleViewEvent(event)}
                >
                  <View style={styles.eventTimeContainer}>
                    <Text style={styles.eventTimeHour}>
                      {formatTime(new Date(event.start))}
                    </Text>
                    <Text style={styles.eventTimeDuration}>
                      {calculateDuration(event.start, event.end)} min
                    </Text>
                  </View>
                  <View style={styles.eventDetailsContainer}>
                    <Text style={styles.agendaEventTitle}>{event.title}</Text>
                    {event.location && <Text style={styles.eventLocation}>{event.location}</Text>}
                  </View>
                </TouchableOpacity>
              ))
            )}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  calendar: {
    height: height * 0.6, // Calendar takes 60% of screen height
  },
  viewToggleContainer: {
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  viewToggleButton: {
    paddingHorizontal: 15,
    paddingVertical: 8,
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
  },
  viewToggleText: {
    color: '#ccc7b3',
    fontWeight: 'bold',
  },
  miniEventsContainer: {
    flex: 1,
    padding: 15,
  },
  selectedDateText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  addButton: {
    position: 'absolute',
    right: 15,
    top: 10,
    backgroundColor: '#3E2C1C',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    zIndex: 1,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  miniEventsList: {
    flex: 1,
    marginTop: 10,
  },
  eventItem: {
    backgroundColor: '#ccc7b3',
    padding: 15,
    borderRadius: 5,
    marginBottom: 10,
    borderLeftWidth: 5,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  eventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventTime: {
    color: '#666',
  },
  noEventsText: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
    fontStyle: 'italic',
  },
  

  agendaContainer: {
    flex: 1,
  },
  agendaHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    paddingVertical: 5,
    paddingHorizontal: 10,
  },
  backButtonText: {
    color: '#3E2C1C',
    fontWeight: 'bold',
  },
  agendaDateText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  agendaEventsList: {
    flex: 1,
    padding: 15,
  },
  agendaEventItem: {
    flexDirection: 'row',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
    backgroundColor: '#ccc7b3',
    borderLeftWidth: 5,
  },
  eventTimeContainer: {
    marginRight: 15,
    alignItems: 'center',
  },
  eventTimeHour: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  eventTimeDuration: {
    fontSize: 12,
    color: '#666',
    marginTop: 5,
  },
  eventDetailsContainer: {
    flex: 1,
  },
  agendaEventTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 5,
  },
  eventLocation: {
    color: '#666',
    fontSize: 14,
  },
  noEventsContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 50,
  },
  createEventButton: {
    marginTop: 20,
    backgroundColor: '#3E2C1C',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 5,
  },
  createEventButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default CalendarScreen;
