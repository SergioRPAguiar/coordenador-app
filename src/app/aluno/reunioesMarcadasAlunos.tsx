import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, Alert, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/context/AuthContext'; // Importa o contexto de autenticação
import axios from 'axios';
import { API_URL } from '@/app/context/AuthContext'; // Importa a URL base da API
import { router } from 'expo-router';

interface Reuniao {
  _id: string;
  date: string;
  timeSlot: string;
  reason: string;
  canceled?: boolean;  // Propriedade opcional
  cancelReason?: string;  // Propriedade opcional para o motivo do cancelamento
}

const ReunioesMarcadasAlunos = () => {
  const { authState } = useAuth(); // Pega informações de autenticação do aluno
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelarReuniaoId, setCancelarReuniaoId] = useState<string | null>(null);
  const [motivoCancelamento, setMotivoCancelamento] = useState<string>('');

  useEffect(() => {
    const fetchReunioes = async () => {
      if (!authState?.user || !authState?.token) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }
  
      try {
        const response = await axios.get(`${API_URL}/meeting/allForStudent`, {
          params: {
            userId: authState.user._id,
          },
          headers: {
            Authorization: `Bearer ${authState.token}`,
          },
        });
        setReunioes(response.data);
      } catch (err) {
        setError('Erro ao carregar reuniões.');
      } finally {
        setLoading(false);
      }
    };
  
    fetchReunioes();
  }, [authState]);
  

  const handleCancelar = async () => {
    if (!motivoCancelamento.trim()) {
      Alert.alert('Por favor, insira o motivo do cancelamento.');
      return;
    }

    try {
      await axios.patch(`${API_URL}/meeting/${cancelarReuniaoId}/cancel`, { reason: motivoCancelamento }, {
        headers: {
          Authorization: `Bearer ${authState.token}`,
        },
      });
      setReunioes((prevReunioes) => prevReunioes.filter((reuniao) => reuniao._id !== cancelarReuniaoId));
      Alert.alert('Reunião cancelada com sucesso.');
      setCancelarReuniaoId(null);
      setMotivoCancelamento('');
    } catch (error) {
      console.error('Erro ao cancelar a reunião:', error);
      Alert.alert('Erro ao cancelar a reunião.');
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
                />
                <TouchableOpacity style={styles.confirmButton} onPress={handleCancelar}>
                  <Text style={styles.buttonText}>Confirmar cancelamento</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.cancelButton} onPress={() => setCancelarReuniaoId(null)}>
                  <Text style={styles.buttonText}>Cancelar</Text>
                </TouchableOpacity>
              </>
            ) : (
              <TouchableOpacity style={styles.cancelButton} onPress={() => setCancelarReuniaoId(reuniao._id)}>
                <Text style={styles.buttonText}>Desmarcar reunião</Text>
              </TouchableOpacity>
            )}
          </View>
        ))
      ) : (
        <Text style={styles.noMeetingsText}>Sem reuniões futuras marcadas</Text>
      )}
      <TouchableOpacity style={styles.backButton} onPress={() => router.push('/aluno')}>
        <Text style={styles.buttonText}>Voltar ao Calendário</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flex: 1,
  },
  reuniaoContainer: {
    marginBottom: 20,
    padding: 15,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 10,
    backgroundColor: '#f9f9f9',
  },
  label: {
    fontSize: 16,
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
  },
  confirmButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  cancelButton: {
    backgroundColor: '#ff0000',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  backButton: {
    backgroundColor: '#007bff',
    padding: 10,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  noMeetingsText: {
    fontSize: 16,
    color: '#666',
    textAlign: 'center',
  },
});

export default ReunioesMarcadasAlunos;
