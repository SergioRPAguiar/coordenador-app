// src/components/ProximaReuniao.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';

const ProximaReuniao = () => {
  const { user } = useAuth();
  const [proximaReuniao, setProximaReuniao] = useState<string | null>(null);

  useEffect(() => {
    // Aqui você faria a requisição para a API para buscar a próxima reunião do aluno
    // Exemplo: fetch(`/api/proxima-reuniao/${user.id}`)
    const fetchProximaReuniao = async () => {
      // Simulação de uma chamada API
      const response = await new Promise<{ data: string | null }>((resolve) =>
        setTimeout(() => resolve({ data: null }), 1000) // substitua por chamada real
      );
      setProximaReuniao(response.data);
    };

    fetchProximaReuniao();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próxima Reunião</Text>
      <Text style={styles.info}>
        {proximaReuniao ? proximaReuniao : '-'}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  info: {
    fontSize: 16,
    color: '#008739',
  },
});

export default ProximaReuniao;
