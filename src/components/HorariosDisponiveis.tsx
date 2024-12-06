import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_URL } from '@/app/context/AuthContext';
import Botao from './Botao';

const HorariosDisponiveis = ({ horarios, isProfessor, selectedDate }: { horarios: { [key: string]: string[] }, isProfessor: boolean, selectedDate: string }) => {
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const [motivo, setMotivo] = useState('');

  const handleConfirmHorario = async () => {
    try {
      const url = isProfessor ? `${API_URL}/professor/set-horario` : `${API_URL}/meeting`;
      const response = await axios.post(url, {
        date: selectedDate,
        time: selectedHorario,
        motivo: isProfessor ? undefined : motivo,
      });
      console.log("Horário Confirmado:", response.data);
    } catch (error) {
      console.error("Erro ao confirmar horário:", error);
    }
  };

  return (
    <View>
      <Text>Horários Disponíveis</Text>
      {Object.keys(horarios).map((time) => (
        <TouchableOpacity key={time} onPress={() => setSelectedHorario(time)}>
          <Text>{time}</Text>
        </TouchableOpacity>
      ))}

      {selectedHorario && (
        <View style={styles.confirmContainer}>
          {!isProfessor && (
            <TextInput
              style={styles.input}
              placeholder="Motivo da reunião"
              value={motivo}
              onChangeText={setMotivo}
            />
          )}
          <Botao title="Confirmar Horário" onPress={handleConfirmHorario} />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
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
