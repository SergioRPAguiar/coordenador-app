import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import ProximaReuniaoAluno from '@/components/ProximaReuniaoAluno';
import Calendario from '@/components/Calendario';
import { theme } from '@/theme';

const PainelAluno = () => {
  const proximaReuniao = '15/08/2024, 10:00 AM';

  const components = [
    { key: 'ProximaReuniaoAluno', title: 'Próxima Reunião', component: <ProximaReuniaoAluno proximaReuniao={proximaReuniao} /> },
    { key: 'Calendario', title: 'Calendário', component: <Calendario /> },
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
    paddingVertical: 10,
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

export default PainelAluno;
