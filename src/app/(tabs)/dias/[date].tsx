import React from 'react';
import { Stack, useRouter, useLocalSearchParams, useGlobalSearchParams } from 'expo-router'
import { View, Text, Button, StyleSheet } from 'react-native';

const DiaDetalhes = () => {
  const router = useRouter();
  const { date } = useGlobalSearchParams<{ date: string }>();

  return (
    <View style={styles.container}>
      <Text style={styles.dateText}>{date}</Text>
      <Button title="Manhã" onPress={() => router.push('/dias/manha')} />
      <Button title="Tarde" onPress={() => router.push('/dias/tarde')} />
      <Button title="Noite" onPress={() => router.push('/dias/noite')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dateText: {
    fontSize: 24,
    marginBottom: 20,
  },
});

export default DiaDetalhes;
