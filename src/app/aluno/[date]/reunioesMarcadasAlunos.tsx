import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TextInput } from 'react-native';
import { useAuth } from '@/app/context/AuthContext'; // Importa o contexto de autenticação
import { useLocalSearchParams } from 'expo-router'; // Usando Expo Router para pegar parâmetros da URL
import axios from 'axios';
import { API_URL } from '@/app/context/AuthContext'; // Importa o API_URL

interface Reuniao {
  id: string;
  time: string;
  reason: string;
}

const ReunioesMarcadasAlunos = () => {
  const { authState } = useAuth(); // Pega informações de autenticação do aluno
  const { date } = useLocalSearchParams(); // Pega a data da URL (substituímos useSearchParams por useLocalSearchParams)
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [motivoCancelamento, setMotivoCancelamento] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchReunioes = async () => {
      if (!authState?.user || !authState?.token) {
        setError('Usuário não autenticado.');
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/meeting`, {
          params: {
            userId: authState.user._id,
            date: date, // Data passada pela URL
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
  }, [authState, date]);

  const handleCancelarReuniao = async (id: string) => {
    if (!motivoCancelamento.trim()) {
      alert('Por favor, forneça um motivo para o cancelamento.');
      return;
    }

    try {
      await axios.patch(`${API_URL}/meeting/${id}/cancel`, {
        reason: motivoCancelamento,
      }, {
        headers: {
          Authorization: `Bearer ${authState?.token}`,
        },
      });
      alert('Reunião cancelada com sucesso.');
      setReunioes(reunioes.filter(reuniao => reuniao.id !== id)); // Remove a reunião cancelada da lista
    } catch (error) {
      alert('Erro ao cancelar a reunião.');
    }
  };

  if (loading) {
    return <Text>Carregando...</Text>;
  }

  if (error) {
    return <Text>{error}</Text>;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reuniões Marcadas para {date}</Text>
      {reunioes.length > 0 ? (
  reunioes.map((reuniao) => (
            <View key={reuniao.id} style={styles.reuniaoContainer}> {/* Adicionei a chave `key` */}
            <Text>Hora: {reuniao.time}</Text>
            <Text>Motivo: {reuniao.reason}</Text>
            <TextInput
            style={styles.textInput}
            placeholder="Motivo do cancelamento"
            value={motivoCancelamento}
            onChangeText={setMotivoCancelamento}
            />
             <Button
            title="Cancelar Reunião"
            onPress={() => handleCancelarReuniao(reuniao.id)}
            />
          </View>
        ))
      ) : (
        <Text>Sem reuniões marcadas</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  reuniaoContainer: {
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  textInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
  },
});

export default ReunioesMarcadasAlunos;
