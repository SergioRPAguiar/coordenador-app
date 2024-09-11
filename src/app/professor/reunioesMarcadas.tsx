// reunioesMarcadas.tsx
import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useAuth } from '@/app/context/AuthContext';

interface Reuniao {
  id: string;
  date: string;
  time: string;
  reason: string;
}

const ReunioesMarcadas = () => {
  const { user } = useAuth();
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);

  useEffect(() => {
    const fetchReunioes = async () => {
      const response = await new Promise<{ data: Reuniao[] }>((resolve) =>
        setTimeout(() => resolve({ data: [{ id: '1', date: '2024-09-15', time: '10:00', reason: 'Discussão de projeto' }] }), 1000)
      );
      setReunioes(response.data);
    };

    fetchReunioes();
  }, [user]);

  const handleCancelar = (id: string) => {
    alert(`Cancelar reunião ${id}`);
  };

  return (
    <View style={styles.container}>
      {reunioes.length > 0 ? (
        reunioes.map((reuniao) => (
          <View key={reuniao.id} style={styles.reuniaoContainer}>
            <Text>Data: {reuniao.date}</Text>
            <Text>Hora: {reuniao.time}</Text>
            <Text>Motivo: {reuniao.reason}</Text>
            <Button title="Cancelar reunião" onPress={() => handleCancelar(reuniao.id)} />
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
  reuniaoContainer: {
    marginBottom: 20,
  },
});

export default ReunioesMarcadas;
