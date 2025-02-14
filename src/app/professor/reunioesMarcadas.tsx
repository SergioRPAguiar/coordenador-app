import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
import axios from 'axios';
import { API_URL } from '@/app/context/AuthContext';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import { router } from 'expo-router';
import Botao from '@/components/Botao';
import BackButton from '@/components/BackButton';

dayjs.extend(utc);
dayjs.extend(timezone);
interface Reuniao {
  _id: string;
  date: string;
  timeSlot: string;
  reason: string;
  canceled?: boolean;
  cancelReason?: string;
}

const ReunioesMarcadas = () => {
  const { authState } = useAuth();
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelarReuniaoId, setCancelarReuniaoId] = useState<string | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState<string>('');

  useEffect(() => {
    const fetchReunioes = async () => {
      try {
        if (authState.user && authState.user._id) {
          console.log('Buscando todas as reuniões futuras para o professor:', authState.user._id);

          const response = await axios.get(`${API_URL}/meeting/allFutureForProfessor`);
          console.log('Resposta da API com todas as reuniões:', response.data);

          let reunioesData: Reuniao[] = [];

          if (Array.isArray(response.data)) {
            reunioesData = response.data;
          } else if (response.data && typeof response.data === 'object') {
            reunioesData = [response.data];
          }

          const filteredReunioes = reunioesData.filter((reuniao) => !reuniao.canceled);
          setReunioes(filteredReunioes);
        }
      } catch (error) {
        console.error('Erro ao buscar reuniões:', error);
        setError('Erro ao buscar reuniões');
      } finally {
        setLoading(false);
      }
    };

    fetchReunioes();
  }, [authState]);

  const handleCancelar = async () => {
    if (!motivoCancelamento.trim()) {
      alert('Por favor, insira o motivo do cancelamento.');
      return;
    }
  
    try {
      await axios.patch(`${API_URL}/meeting/${cancelarReuniaoId}/cancel`, { reason: motivoCancelamento });
      setReunioes((prevReunioes) => prevReunioes.filter((reuniao) => reuniao._id !== cancelarReuniaoId));
      alert('Reunião cancelada com sucesso. O aluno será notificado por e-mail.');
      setCancelarReuniaoId(null);
      setMotivoCancelamento('');
    } catch (error) {
      console.error('Erro ao cancelar a reunião:', error);
      alert('Erro ao cancelar a reunião. Verifique sua conexão ou tente novamente.');
    }
  };
  

  if (loading) {
    return <Text>Carregando reuniões...</Text>;
  }

  if (error) {
    return <Text>Erro: {error}</Text>;
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {reunioes.length > 0 ? (
          reunioes.map((reuniao) => (
            <View key={reuniao._id} style={styles.reuniaoContainer}>
              <Text style={styles.label}>Data: {reuniao.date}</Text>
              <Text style={styles.label}>Hora: {reuniao.timeSlot}</Text>
              <Text style={styles.label}>Motivo: {reuniao.reason}</Text>
  
              {cancelarReuniaoId === reuniao._id ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Motivo do cancelamento"
                    value={motivoCancelamento}
                    onChangeText={setMotivoCancelamento}
                    multiline
                  />
                  <TouchableOpacity style={styles.confirmButton} onPress={handleCancelar}>
                    <Text style={styles.buttonText}>Confirmar cancelamento</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setCancelarReuniaoId(null)}>
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity style={styles.uncheckButton} onPress={() => setCancelarReuniaoId(reuniao._id)}>
                  <Text style={styles.buttonText}>Desmarcar reunião</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text>Sem reuniões futuras marcadas</Text>
        )}
      </ScrollView>
      <View style={styles.footerContainer}>
        <Botao title="Voltar para o Calendário" onPress={() => router.replace('/professor')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
    paddingTop: 60
    
  },
  reuniaoContainer: {
    marginBottom: 30,
    padding: 10,
    alignItems: 'center',
    borderColor: '#ddd',
    borderWidth: 2,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 3,
  },
  input: {
    borderColor: '#ccc',
    width: '100%',
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  confirmButton: {
    backgroundColor: '#ff4d4d',
    width: '100%',
    marginTop: 5,
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#6e6e6e',
    width: '100%',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  uncheckButton: {
    backgroundColor: '#ff4d4d',
    width: '100%',
    padding: 10,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 10,
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  footerContainer: {
    paddingTop: 5,
    backgroundColor: '#fff', 
    alignItems: 'center',
    justifyContent: 'center',
    borderTopColor: '#ddd',
  },
  scrollViewContent: {
    paddingBottom: 20,
  },
});

export default ReunioesMarcadas;
