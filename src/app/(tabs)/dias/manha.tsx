import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const Manha = () => {
  const horarios = ['07:00-07:15', '07:15-07:30', '07:30-07:45', '07:45-08:00', '08:00-08:15', '08:15-08:30', '08:30-08:45', '08:45-09:00', '09:00-09:15', '09:15-09:30', '09:30-09:45', '09:45-10:00', '10:00-10:15', '10:15-10:30', '10:30-10:45', '10:45-11:00', '11:00-11:15', '11:15-11:30', '11:30-11:45', '11:45-12:00'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Manhã</Text>
      {horarios.map((horario, index) => (
        <View key={index} style={styles.horarioContainer}>
          <Text>{horario}</Text>
          <CheckBox value={false} onValueChange={() => {}} />
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
  },
  horarioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
});

export default Manha;
