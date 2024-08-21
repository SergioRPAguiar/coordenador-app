import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Checkbox } from 'react-native-paper';

const Noite = () => {
  const [horarios, setHorarios] = useState([
    { time: '18:00 - 18:15', available: false },
    { time: '18:15 - 18:30', available: false },
    { time: '18:30 - 18:45', available: false },
    { time: '18:45 - 19:00', available: false },
    { time: '19:00 - 19:15', available: false },
    { time: '19:15 - 19:30', available: false },
    { time: '19:30 - 19:45', available: false },
    { time: '19:45 - 20:00', available: false },
    { time: '20:00 - 20:15', available: false },
    { time: '20:15 - 20:30', available: false },
    { time: '20:30 - 20:45', available: false },
    { time: '20:45 - 21:00', available: false },
    { time: '21:00 - 21:15', available: false },
    { time: '21:15 - 21:30', available: false },
    { time: '21:30 - 21:45', available: false },
    { time: '21:45 - 22:00', available: false },
  ]);

  const toggleDisponibilidade = (index: number) => {
    const newHorarios = [...horarios];
    newHorarios[index].available = !newHorarios[index].available;
    setHorarios(newHorarios);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Horários da Noite</Text>
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

export default Noite;
