
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import Checkbox from 'expo-checkbox';
import Botao from './Botao';

const HorariosDisponiveis = ({ horarios }: { horarios: { [key: string]: string[] } }) => {
  const [index, setIndex] = useState(0);
  const [motivo, setMotivo] = useState('');
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);

  const renderHorarios = (period: string) => (
    <View style={styles.tabContainer}>
      {horarios[period]?.map((hora) => (
        <View key={hora} style={styles.horarioItem}>
          <Checkbox
            value={selectedHorario === hora}
            onValueChange={(newValue) => setSelectedHorario(newValue ? hora : null)}
          />
          <Text style={styles.horarioText}>{hora}</Text>
        </View>
      ))}
    </View>
  );

  const renderScene = SceneMap({
    manha: () => renderHorarios('manha'),
    tarde: () => renderHorarios('tarde'),
    noite: () => renderHorarios('noite'),
  });

  return (
    <View style={styles.container}>
      <TabView
        navigationState={{ index, routes: [
          { key: 'manha', title: 'Manhã' },
          { key: 'tarde', title: 'Tarde' },
          { key: 'noite', title: 'Noite' },
        ]}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: 300 }}
        style={styles.tabView}
      />
      {selectedHorario && (
        <View style={styles.confirmContainer}>
          <TextInput
            style={styles.input}
            placeholder="Motivo da reunião"
            value={motivo}
            onChangeText={setMotivo}
          />
          <Botao title="Confirmar Horário" onPress={() => console.log('Horário Confirmado!')} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
  },
  tabView: {
    marginBottom: 20,
  },
  tabContainer: {
    padding: 10,
  },
  horarioItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  horarioText: {
    marginLeft: 10,
    fontSize: 16,
  },
  confirmContainer: {
    marginTop: 20,
  },
  input: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default HorariosDisponiveis;
