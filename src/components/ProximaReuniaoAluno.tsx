import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ProximaReuniaoAluno = ({ proximaReuniao }: { proximaReuniao?: string }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Próxima Reunião:</Text>
      <Text style={styles.reuniao}>
        {proximaReuniao ? proximaReuniao : '—'}
      </Text>
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
