import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import CheckBox from '@react-native-community/checkbox';

const Noite = () => {
  const horarios = ['18:00-18:15', '18:15-18:30', '18:30-18:45', '18:45-19:00', '19:00-19:15', '19:15-19:30', '19:30-19:45', '19:45-20:00', '20:00-20:15', '20:15-20:30', '20:30-20:45', '20:45-21:00', '21:00-21:15', '21:15-21:30', '21:30-21:45', '21:45-22:00'];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Noite</Text>
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

export default Noite;
