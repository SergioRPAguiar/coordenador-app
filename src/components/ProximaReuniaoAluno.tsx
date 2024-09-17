import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router';
import axios from 'axios';  // Importar axios para fazer a requisição
import { API_URL } from '@/app/context/AuthContext';  // Importar a URL da API
import { format } from 'date-fns';  // Biblioteca para formatar a data
import { ptBR } from 'date-fns/locale';  // Localização para data em português

const ProximaReuniaoAluno = () => {
  const { authState } = useAuth();
  const [proximaReuniao, setProximaReuniao] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProximaReuniao = async () => {
      try {
        // Verifica se o usuário está autenticado e se tem um userId válido
        if (authState.user && authState.user._id) {
          const response = await axios.get(`${API_URL}/meeting/next`, {
            params: { userId: authState.user._id },  // Passa o userId para a API
          });

          if (response.data) {
            const { date, timeSlot } = response.data;

            // Formata a data para o padrão dd/mm/aaaa
            const formattedDate = format(new Date(date), 'dd/MM/yyyy', {
              locale: ptBR,
            });

            setProximaReuniao(`${formattedDate} às ${timeSlot}`);
          } else {
            setProximaReuniao(null); // Se não houver reunião
          }
        }
      } catch (error) {
        console.error('Erro ao buscar a próxima reunião:', error);
        setProximaReuniao(null); // Se houver erro, não mostra nenhuma reunião
      }
    };

    fetchProximaReuniao();
  }, [authState]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próxima Reunião</Text>
      <Text style={styles.reuniao}>
        {proximaReuniao ? proximaReuniao : '—'}
      </Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/aluno/reunioesMarcadasAlunos')}
      >
        <Text style={styles.buttonText}>Reuniões Marcadas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
    marginVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
  },
  reuniao: {
    fontSize: 16,
    marginVertical: 10,
    textAlign: 'center',
    flex: 2,
  },
  button: {
    backgroundColor: '#008739',
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    alignSelf: 'flex-end',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProximaReuniaoAluno;
