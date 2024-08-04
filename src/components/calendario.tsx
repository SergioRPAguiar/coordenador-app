import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();

  const onDayPress = (day: { dateString: string }) => {
    router.push(`/dias/${day.dateString}`);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
  };

  return (
    <View>
      <View style={styles.monthSelector}>
        <TouchableOpacity onPress={() => changeMonth(-1)}>
          <Text>Anterior</Text>
        </TouchableOpacity>
        <Text>{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</Text>
        <TouchableOpacity onPress={() => changeMonth(1)}>
          <Text>Próximo</Text>
        </TouchableOpacity>
      </View>
      <Calendar
        current={currentDate.toISOString().split('T')[0]}
        onDayPress={onDayPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  monthSelector: {
    backgroundColor: 'red',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Calendario;
