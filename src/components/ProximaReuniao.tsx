import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import axios from 'axios';
import { API_URL } from '@/app/context/AuthContext'; 

const ProximaReuniaoProfessor = () => {
  const [proximaReuniao, setProximaReuniao] = useState<{ date: string; timeSlot: string } | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProximaReuniao = async () => {
      try {
        const response = await axios.get(`${API_URL}/meeting/nextForProfessor`);
        if (response.data) {
          setProximaReuniao(response.data);
        } else {
          setProximaReuniao(null);
        }
      } catch (error) {
        setProximaReuniao(null);
      }
    };
  
    fetchProximaReuniao();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.infoContainer}>
        <View style={styles.textContainer}>
          <Text style={styles.title}>Próxima{'\n'}Reunião</Text>
        </View>
        <View style={styles.dateContainer}>
          <Text style={styles.info}>
            {proximaReuniao ? `${proximaReuniao.date}\nàs ${proximaReuniao.timeSlot}` : '—'}
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
    marginVertical: 1,
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
    backgroundColor: '#008739',
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

export default ProximaReuniaoProfessor;
