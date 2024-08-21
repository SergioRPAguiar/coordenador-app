import React, { useState } from 'react';
import { View, StyleSheet, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'react-native-calendars';
import { useRouter } from 'expo-router';

const Calendario = () => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const router = useRouter();

  console.log("Calendario renderizado com data atual:", currentDate);

  const onDayPress = (day: { dateString: string }) => {
    console.log("Dia pressionado:", day.dateString);
    router.push(`/${day.dateString}`);
  };

  const changeMonth = (direction: number) => {
    const newDate = new Date(currentDate);
    newDate.setMonth(currentDate.getMonth() + direction);
    setCurrentDate(newDate);
    console.log("Mês alterado para:", newDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' }));
  };

  return (
    <View>
      <View style={styles.monthSelector}>
        <TouchableOpacity 
          onPress={() => changeMonth(-1)}
          accessibilityLabel="Mês anterior"
          accessibilityHint="Navega para o mês anterior"
        >
          <Text>Anterior</Text>
        </TouchableOpacity>
        <Text>{currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}</Text>
        <TouchableOpacity 
          onPress={() => changeMonth(1)}
          accessibilityLabel="Próximo mês"
          accessibilityHint="Navega para o próximo mês"
        >
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 10,
  },
});

export default Calendario;
