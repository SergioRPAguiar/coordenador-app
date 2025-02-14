import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/app/context/AuthContext';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

const ProximaReuniaoAluno = () => {
  const { authState } = useAuth();
  const [proximaReuniao, setProximaReuniao] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProximaReuniao = async () => {
      try {
        if (authState.user && authState.user._id) {
          const response = await axios.get(`${API_URL}/meeting/next`, {
            params: { userId: authState.user._id }, 
          });

          if (response.data) {
            const { date, timeSlot } = response.data;
            const formattedDate = format(new Date(date), 'dd/MM/yyyy', {
              locale: ptBR,
            });

            setProximaReuniao(`${formattedDate} às ${timeSlot}`);
          } else {
            setProximaReuniao(null); 
          }
        }
      } catch (error) {
        setProximaReuniao(null); 
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
    marginBottom: 15,
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
