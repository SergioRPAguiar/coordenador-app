import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';

const Tarde = () => {
  const [horarios, setHorarios] = useState([
    { time: '12:00 - 12:15', available: false },
    { time: '12:15 - 12:30', available: false },
    { time: '12:30 - 12:45', available: false },
    { time: '12:45 - 13:00', available: false },
    { time: '13:00 - 13:15', available: false },
    { time: '13:15 - 13:30', available: false },
    { time: '13:30 - 13:45', available: false },
    { time: '13:45 - 14:00', available: false },
    { time: '14:00 - 14:15', available: false },
    { time: '14:15 - 14:30', available: false },
    { time: '14:30 - 14:45', available: false },
    { time: '14:45 - 15:00', available: false },
    { time: '15:00 - 15:15', available: false },
    { time: '15:15 - 15:30', available: false },
    { time: '15:30 - 15:45', available: false },
    { time: '15:45 - 16:00', available: false },
    { time: '16:00 - 16:15', available: false },
    { time: '16:15 - 16:30', available: false },
    { time: '16:30 - 16:45', available: false },
    { time: '16:45 - 17:00', available: false },
    { time: '17:00 - 17:15', available: false },
    { time: '17:15 - 17:30', available: false },
    { time: '17:30 - 17:45', available: false },
    { time: '17:45 - 18:00', available: false },
  ]);

  const toggleDisponibilidade = (index: number) => {
    const newHorarios = [...horarios];
    newHorarios[index].available = !newHorarios[index].available;
    setHorarios(newHorarios);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Horários da Tarde</Text>
      {horarios.map((horario, index) => (
        <View key={index} style={styles.horarioContainer}>
          <Text style={styles.text}>{horario.time}</Text>
          <Checkbox
            status={horario.available ? 'checked' : 'unchecked'}
            onPress={() => toggleDisponibilidade(index)}
          />
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  horarioContainer: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
});

export default Tarde;
