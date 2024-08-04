import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const Tarde = () => {
  const horarios = ['12:00-12:15', '12:15-12:30', '12:30-12:45', '12:45-13:00', '13:00-13:15', '13:15-13:30', '13:30-13:45', '13:45-14:00', '14:00-14:15', '14:15-14:30', '14:30-14:45', '14:45-15:00', '15:00-15:15', '15:15-15:30', '15:30-15:45', '15:45-16:00', '16:00-16:15', '16:15-16:30', '16:30-16:45', '16:45-17:00', '17:00-17:15', '17:15-17:30', '17:30-17:45', '17:45-18:00'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tarde</Text>
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

export default Tarde;
