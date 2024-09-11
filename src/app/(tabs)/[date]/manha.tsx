import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Button, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL, useAuth } from '@/app/context/AuthContext';
import { useDate } from '@/app/context/DateContext';

const Manha = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams(); // Captura o parâmetro da URL
  const { selectedDate, setSelectedDate } = useDate(); // Usa a data global
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

  const { authState } = useAuth();
  const token = authState.token;

  // Atualiza a data selecionada assim que o parâmetro 'date' é carregado da URL
  useEffect(() => {
    if (date) {
      setSelectedDate(date as string); // Atualiza o selectedDate do contexto com o valor da URL
    }
  }, [date]);

  // Função para buscar os horários disponíveis na data selecionada
  const fetchHorarios = async (selectedDate: string) => {
    try {
      const response = await axios.get(`${API_URL}/schedule/available/${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedHorarios = response.data;

      const updatedHorarios = horarios.map(horario => {
        const horarioBackend = fetchedHorarios.find((h: any) => h.timeSlot === horario.time);
        return horarioBackend
          ? { ...horario, available: horarioBackend.available }
          : horario;
      });

      setHorarios(updatedHorarios);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  // Chama a função de buscar horários quando a data selecionada muda
  useEffect(() => {
    if (selectedDate) {
      fetchHorarios(selectedDate); // Busca os horários usando a data atualizada do contexto
    }
  }, [selectedDate]);

  // Função para alternar a disponibilidade de um horário
  const toggleDisponibilidade = async (index: number) => {
    const newHorarios = [...horarios];
    newHorarios[index].available = !newHorarios[index].available;
    setHorarios(newHorarios);

    try {
      await axios.post(
        `${API_URL}/schedule`,
        {
          date: selectedDate, // Envia a data como string
          timeSlot: newHorarios[index].time,
          available: newHorarios[index].available,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(`Horário ${newHorarios[index].time} atualizado com sucesso!`);
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Voltar para o Calendário" onPress={() => router.back()} />

      <Text style={styles.headerText}>Horários da Manhã</Text>

      <Text>Data selecionada: {selectedDate}</Text>

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

export default Manha;