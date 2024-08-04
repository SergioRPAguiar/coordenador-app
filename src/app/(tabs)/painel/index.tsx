import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import CalendarioMesAtual from '@/components/Calendario';
import { theme } from '@/theme';

const Painel = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Painel</Text>
      <View style={styles.calendarSection}>
        <CalendarioMesAtual />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginVertical: 20,
  },
  calendarSection: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
});

export default Painel;
