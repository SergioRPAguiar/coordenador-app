import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TextInput, Button, StyleSheet } from 'react-native';
import { Checkbox } from 'react-native-paper';
import axios, { AxiosError } from 'axios';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { API_URL, useAuth } from '@/app/context/AuthContext';
import { useDate } from '@/app/context/DateContext';

// Definindo o tipo para os itens de horário
interface Horario {
  timeSlot: string;
  available: boolean;
}

const HorariosDia = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams(); // Captura o parâmetro da URL
  const { selectedDate, setSelectedDate } = useDate(); // Usa a data global
  const [horarios, setHorarios] = useState<Horario[]>([]); // Estado com o tipo Horario[]
  const [motivo, setMotivo] = useState('');
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const { authState } = useAuth();
  const token = authState.token;

  // Atualiza a data selecionada assim que o parâmetro 'date' é carregado da URL
  useEffect(() => {
    if (date) {
      setSelectedDate(date as string); // Atualiza o selectedDate do contexto com o valor da URL
    }
  }, [date]);

  // Função para buscar os horários disponíveis para o aluno
  const fetchHorarios = async (selectedDate: string) => {
    try {
      const response = await axios.get(`${API_URL}/schedule/available/${selectedDate}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchedHorarios = response.data;

      setHorarios(fetchedHorarios); // Garante que o estado tenha o tipo correto
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

  // Função para confirmar a reunião
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
          userId: authState.user._id  // ID do usuário logado
        },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`, // Certifique-se que o token está presente
          }
        }
      );
      console.log("Reunião marcada com sucesso!", response.data);
    } catch (error) {
      
      
      if (axios.isAxiosError(error)) {
        if (error.response) {
          console.error('Erro na resposta da API:', error.response.data);
          console.error('Status:', error.response.status);
          console.error('Headers:', error.response.headers);
        } else if (error.request) {
          console.error('Nenhuma resposta recebida:', error.request);
        } else {
          console.error('Erro ao configurar a requisição:', error.message);
        }
      } else {
        console.error('Erro desconhecido:', error);
      }}
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Voltar para o Calendário" onPress={() => router.back()} />

      <Text style={styles.headerText}>Horários Disponíveis</Text>
      <Text>Data selecionada: {selectedDate}</Text>

      {horarios.length > 0 ? (
        horarios.map((horario, index) => (
          <View key={index} style={styles.horarioContainer}>
            <Text style={styles.text}>{horario.timeSlot}</Text>
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
          <Button title="Marcar Reunião" onPress={confirmarReuniao} />
        </View>
      )}
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
  motivoContainer: {
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  noHorariosText: {
    textAlign: 'center',
    fontSize: 16,
    color: 'gray',
    marginTop: 20,
  },
});

export default HorariosDia;
