import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
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
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Próxima{'\n'}Reunião</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.info}>
            {proximaReuniao ? `${proximaReuniao.date}\nàs ${proximaReuniao.time}` : '-'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.push('/professor/reunioesMarcadas')}
        >
          <Text style={styles.buttonText}>Reuniões Marcadas</Text>
        </TouchableOpacity>
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
    marginVertical: 10,
  },
  infoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 2,
    justifyContent: 'center',
  },
  dateContainer: {
    flex: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    flex: 2,
    backgroundColor: '#008739', // Cor do tema ou personalizada
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  info: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default ProximaReuniao;
