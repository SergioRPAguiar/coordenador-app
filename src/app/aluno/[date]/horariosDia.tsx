import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import axios from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL, useAuth } from '@/app/context/AuthContext';
import { useDate } from '@/app/context/DateContext';
import Botao from '@/components/Botao';
import { theme } from '@/theme';

interface Horario {
  timeSlot: string;
  available: boolean;
}

const HorariosDia = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const { selectedDate, setSelectedDate } = useDate();
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [motivo, setMotivo] = useState('');
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const { authState } = useAuth();
  const token = authState.token;

  useEffect(() => {
    if (date) {
      setSelectedDate(date as string);
    }
  }, [date]);

  const fetchHorarios = async (selectedDate: string) => {
    try {
      const response = await axios.get(`${API_URL}/schedule/available/${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setHorarios(response.data);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchHorarios(selectedDate);
    }
  }, [selectedDate]);

  const confirmarReuniao = async () => {
    if (!authState.user) {
      console.error("Usuário não autenticado");
      return;
    }

    try {
      const response = await axios.post(
        `${API_URL}/meeting`,
        {
          date: selectedDate,
          timeSlot: selectedHorario,
          reason: motivo,
          userId: authState.user._id
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
          }
        }
      );
      console.log("Reunião marcada com sucesso!", response.data);
      router.replace('/aluno');
    } catch (error) {
      console.error('Erro ao marcar reunião:', error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.headerText}>Horários Disponíveis</Text>
      <Text style={styles.dateText}>Data selecionada: {selectedDate}</Text>

      {horarios.length > 0 ? (
        horarios.map((horario, index) => (
          <View key={index} style={styles.horarioContainer}>
            <Text style={styles.horarioText}>{horario.timeSlot}</Text>
            <Checkbox
              status={selectedHorario === horario.timeSlot ? 'checked' : 'unchecked'}
              onPress={() => setSelectedHorario(horario.timeSlot)}
              disabled={!horario.available}
               
            />
          </View>
        ))
      ) : (
        <Text style={styles.noHorariosText}>Nenhum horário disponível para esta data.</Text>
      )}

      {selectedHorario && (
        <View style={styles.motivoContainer}>
          <TextInput
            style={styles.input}
            placeholder="Motivo da reunião"
            value={motivo}
            onChangeText={setMotivo}
          />
          <Botao title="Marcar Reunião" onPress={confirmarReuniao} />
        </View>
      )}

      <Botao title="Voltar para o Calendário" onPress={() => router.replace('/aluno')} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#008739',
    marginBottom: 10,
    textAlign: 'center',
  },
  dateText: {
    fontSize: 18,
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  horarioContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 10,
  },
  horarioText: {
    fontSize: 18,
    color: '#333',
    flex: 1, // Para garantir que o texto ocupe o espaço disponível
  },
  noHorariosText: {
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
    textAlign: 'center',
  },
  motivoContainer: {
    width: '100%',
    marginTop: 20,
    alignItems: 'center',
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 25, // Bordas arredondadas como os botões
    padding: 10,
    marginBottom: 10,
    width: '80%',
  },
});

export default HorariosDia;
