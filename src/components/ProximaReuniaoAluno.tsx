import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router'; // Usando Expo Router
import { theme } from '@/theme'; // Importando o tema

const ProximaReuniaoAluno = () => {
  const { authState } = useAuth();
  const [proximaReuniao, setProximaReuniao] = useState<string | null>(null);
  const router = useRouter(); // Hook de navegação

  useEffect(() => {
    const fetchProximaReuniao = async () => {
      // Simulação de chamada API
      const response = await new Promise<{ data: string | null }>((resolve) =>
        setTimeout(() => resolve({ data: '2024-09-20' }), 1000)
      );
      setProximaReuniao(response.data);
    };

    fetchProximaReuniao();
  }, [authState]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próxima Reunião</Text>
      <Text style={styles.reuniao}>{proximaReuniao ? proximaReuniao : '—'}</Text>
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/aluno/reunioesMarcadasAluno')} // Navegar para a página de reuniões do aluno
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
    justifyContent: 'space-between', // Alinha itens nas extremidades
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
    flex: 2, // Permite que a data ocupe o espaço central
  },
  button: {
    backgroundColor: '#008739', // Use a cor do tema ou cor padrão
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1, // Mantém o botão pequeno e ajustado
    alignSelf: 'flex-end', // Posiciona o botão à direita
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default ProximaReuniaoAluno;
