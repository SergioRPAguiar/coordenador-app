import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useAuth } from '@/app/context/AuthContext';
import { useDate } from '@/app/context/DateContext';

const Calendario = ({ isProfessor }: { isProfessor: boolean }) => {
  const router = useRouter();
  const { user } = useAuth();
  const { selectedDate, setSelectedDate } = useDate();

  const handleDayPress = (day: any) => {
    const selectedDate = day.dateString;
    setSelectedDate(selectedDate);

    if (isProfessor) {
      console.log(selectedDate);
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
          [selectedDate]: { selected: true, selectedColor: '#00adf5' },
        }}
        minDate={new Date().toISOString().split('T')[0]}
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
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Calendario;
