import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';

const Manha = () => {
  const [horarios, setHorarios] = useState([
    { time: '07:00 - 07:15', available: false },
    { time: '07:15 - 07:30', available: false },
    { time: '07:30 - 07:45', available: false },
    { time: '07:45 - 08:00', available: false },
    { time: '08:00 - 08:15', available: false },
    { time: '08:15 - 08:30', available: false },
    { time: '08:30 - 08:45', available: false },
    { time: '08:45 - 09:00', available: false },
    { time: '09:00 - 09:15', available: false },
    { time: '09:15 - 09:30', available: false },
    { time: '09:30 - 09:45', available: false },
    { time: '09:45 - 10:00', available: false },
    { time: '10:00 - 10:15', available: false },
    { time: '10:15 - 10:30', available: false },
    { time: '10:30 - 10:45', available: false },
    { time: '10:45 - 11:00', available: false },
    { time: '11:00 - 11:15', available: false },
    { time: '11:15 - 11:30', available: false },
    { time: '11:30 - 11:45', available: false },
    { time: '11:45 - 12:00', available: false },
  ]);

  const toggleDisponibilidade = (index: number) => {
    const newHorarios = [...horarios];
    newHorarios[index].available = !newHorarios[index].available;
    setHorarios(newHorarios);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Horários da Manhã</Text>
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
    flexDirection: 'row', // Para alinhar a checkbox com o texto na horizontal
    justifyContent: 'space-between', // Para colocar a checkbox à direita
    alignItems: 'center',
    marginBottom: 10,
  },
  text: {
    fontSize: 18,
  },
});

export default Manha;
