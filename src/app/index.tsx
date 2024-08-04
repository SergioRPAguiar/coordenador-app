import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ProximaReuniao from '@/components/ProximaReuniao';
import Calendario from '@/components/Calendario';
import { theme } from '@/theme';

const Painel = () => {
  const components = [
    { key: 'proximaReuniao', title: 'Próxima Reunião', component: <ProximaReuniao /> },
    { key: 'calendario', title: 'Calendário', component: <Calendario /> },
  ];

  return (
    <FlatList
      data={components}
      keyExtractor={(item) => item.key}
      renderItem={({ item }) => (
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{item.title}</Text>
          {item.component}
        </View>
      )}
      contentContainerStyle={styles.container}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#fff',
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Painel;
