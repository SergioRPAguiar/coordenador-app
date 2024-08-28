// src/components/Calendario.tsx

import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import HorariosDisponiveis from './HorariosDisponiveis';
import { useAuth } from '@/app/context/AuthContext';

const Calendario = () => {
  const { user } = useAuth();
  const [horarios, setHorarios] = useState<{[key: string]: string[]}>({});
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  const fetchHorariosDisponiveis = async (date: string) => {
    // Simulação de uma chamada API para buscar horários disponíveis do professor
    const response = await new Promise<{ data: { [key: string]: string[] } }>((resolve) =>
      setTimeout(() => resolve({ data: {
        manha: ['08:00', '09:00'],
        tarde: ['14:00', '15:00'],
        noite: ['19:00', '20:00'],
      }}), 1000) // substitua por chamada real
    );
    setHorarios(response.data);
    setSelectedDate(date);
  };

  const handleDayPress = (date: string) => {
    fetchHorariosDisponiveis(date);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Selecione um dia</Text>
      <TouchableOpacity onPress={() => handleDayPress('2024-08-10')}>
        <Text>10 de Agosto de 2024</Text>
      </TouchableOpacity>

      {selectedDate && (
        <HorariosDisponiveis horarios={horarios} />
      )}
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
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
});

export default Calendario;
