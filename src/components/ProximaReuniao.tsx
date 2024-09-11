import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Button } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';
import { useRouter } from 'expo-router'; // Importa o useRouter para navegação no Expo Router

const ProximaReuniao = () => {
  const { user } = useAuth();
  const [proximaReuniao, setProximaReuniao] = useState<{ date: string; time: string } | null>(null);
  const router = useRouter(); // Usa o hook useRouter para navegação

  useEffect(() => {
    const fetchProximaReuniao = async () => {
      const response = await new Promise<{ data: { date: string; time: string } | null }>((resolve) =>
        setTimeout(() => resolve({ data: { date: '2024-09-15', time: '10:00' } }), 1000)
      );
      setProximaReuniao(response.data);
    };

    fetchProximaReuniao();
  }, [user]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próxima Reunião</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.info}>
          {proximaReuniao ? `${proximaReuniao.date} às ${proximaReuniao.time}` : '-'}
        </Text>
        <Button
          title="Mostrar todas as reuniões"
          onPress={() => router.push('/professor/reunioesMarcadas')} // Navega para a página de reuniões marcadas
        />
      </View>
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
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  info: {
    fontSize: 16,
    color: '#008739',
  },
});

export default ProximaReuniao;
