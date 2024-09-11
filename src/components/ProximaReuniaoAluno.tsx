import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router'; // Usando Expo Router

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
      <Text style={styles.reuniao}>
        {proximaReuniao ? proximaReuniao : '—'}
      </Text>
      <Button
        title="Reuniões Marcadas"
        onPress={() => router.push('/aluno/reunioesMarcadasAluno')} // Navegar para a página de reuniões do aluno
      />
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
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  reuniao: {
    fontSize: 16,
    marginTop: 10,
  },
});

export default ProximaReuniaoAluno;
