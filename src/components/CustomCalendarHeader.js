import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CatImage from './CatImage';

// Array of month names
const MONTH_NAMES = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

const CustomCalendarHeader = (props) => {


  const monthIndex = props.currentMonth || 0;
  const year = props.currentYear || new Date().getFullYear();
  
  const monthName = MONTH_NAMES[monthIndex];
  

  const monthDate = new Date();
  monthDate.setMonth(monthIndex);
  
  return (
    <View style={styles.header}>
      <View style={styles.monthContainer}>
        <CatImage 
          date={monthDate} 
          style={styles.catImage} 
          size={40} 
        />
        <Text style={styles.monthText}>{`${monthName} ${year}`}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  monthContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  monthText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  catImage: {
    
  },
});

export default CustomCalendarHeader;
