import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext';
import { useDate } from '@/app/context/DateContext';
import dayjs from 'dayjs';

const Calendario = ({ isProfessor }: { isProfessor: boolean }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();

  const getCurrentLocalDateString = () => {
    return dayjs().format('YYYY-MM-DD');
  };

  const minDate = dayjs(getCurrentLocalDateString())
    .add(1, 'day')
    .format('YYYY-MM-DD');

  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);

    if (isProfessor) {
      router.push(`/(tabs)/${selectedDate}`);
    } else {
      router.push(`/aluno/${selectedDate}`);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione um dia</Text>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { 
            selected: true, 
            selectedColor: '#00adf5',
            selectedTextColor: '#ffffff'
          },
        }}
        minDate={minDate}
        disableAllTouchEventsForDisabledDays
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#000000',
          selectedDayBackgroundColor: '#00adf5',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#008739',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d3d3d3',
          arrowColor: '#000000',
          monthTextColor: '#000000',
          'stylesheet.day.basic': {
            base: {
              width: 32,
              height: 32,
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: 16,
              backgroundColor: 'transparent',
            },
          },
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    marginVertical: 10,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d4150',
  },
});

export default Calendario;