import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Checkbox } from "react-native-paper";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_URL, useAuth } from "@/app/context/AuthContext";
import { useDate } from "@/app/context/DateContext";
import Botao from "@/components/Botao";
import BackButton from "@/components/BackButton";

const Tarde = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const { selectedDate, setSelectedDate } = useDate();
  const { authState } = useAuth();
  const token = authState.token;

  const [horarios, setHorarios] = useState([
    { time: "12:00 - 12:15", available: false },
    { time: "12:15 - 12:30", available: false },
    { time: "12:30 - 12:45", available: false },
    { time: "12:45 - 13:00", available: false },
    { time: "13:00 - 13:15", available: false },
    { time: "13:15 - 13:30", available: false },
    { time: "13:30 - 13:45", available: false },
    { time: "13:45 - 14:00", available: false },
    { time: "14:00 - 14:15", available: false },
    { time: "14:15 - 14:30", available: false },
    { time: "14:30 - 14:45", available: false },
    { time: "14:45 - 15:00", available: false },
    { time: "15:00 - 15:15", available: false },
    { time: "15:15 - 15:30", available: false },
    { time: "15:30 - 15:45", available: false },
    { time: "15:45 - 16:00", available: false },
    { time: "16:00 - 16:15", available: false },
    { time: "16:15 - 16:30", available: false },
    { time: "16:30 - 16:45", available: false },
    { time: "16:45 - 17:00", available: false },
    { time: "17:00 - 17:15", available: false },
    { time: "17:15 - 17:30", available: false },
    { time: "17:30 - 17:45", available: false },
    { time: "17:45 - 18:00", available: false },
  ]);

  useEffect(() => {
    if (date) {
      setSelectedDate(date as string);
    }
  }, [date]);

  const fetchHorarios = async (selectedDate: string) => {
    try {
      const response = await axios.get(`${API_URL}/schedule/available/${selectedDate}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      const completeHorarios = horarios.map(horario => ({
        ...horario,
        available: response.data.some((h: any) => h.timeSlot === horario.time)
      }));
  
      setHorarios(completeHorarios);
    } catch (error) {
      console.error('Erro ao buscar horários:', error);
    }
  };

  useEffect(() => {
    if (selectedDate) {
      fetchHorarios(selectedDate);
    }
  }, [selectedDate]);

  const toggleDisponibilidade = async (index: number) => {
    const newHorarios = [...horarios];
    const newAvailability = !newHorarios[index].available;
    
    try {
      await axios.post(
        `${API_URL}/schedule`,
        {
          date: selectedDate,
          timeSlot: newHorarios[index].time,
          available: newAvailability
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
  
      if (!newAvailability) {
        newHorarios.splice(index, 1);
      } else {
        newHorarios[index].available = newAvailability;
      }
      
      setHorarios(newHorarios);
  
    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
      const restoredHorarios = [...horarios];
      restoredHorarios[index].available = !newAvailability;
      setHorarios(restoredHorarios);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.headerText}>Horários da Tarde</Text>
        <Text style={styles.headerText2}>Data selecionada: {selectedDate}</Text>

        {horarios.map((horario, index) => (
          <View key={index} style={styles.horarioContainer}>
            <Text style={styles.text}>{horario.time}</Text>
            <Checkbox
              status={horario.available ? "checked" : "unchecked"}
              onPress={() => toggleDisponibilidade(index)}
              color={horario.available ? "#008739" : "#ccc"}
            />
          </View>
        ))}
      </ScrollView>

      <View style={styles.footerContainer}>
        <Botao
          title="Voltar para o Calendário"
          onPress={() => router.replace("/professor")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
  },
  scrollContainer: {
    padding: 20,
    paddingBottom: 10,
  },
  headerText: {
    paddingTop: 30,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
    color: "#008739",
  },
  headerText2: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    borderBottomColor: "#7c7c7c",
    borderBottomWidth: 1,
    paddingBottom: 10,
  },
  horarioContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    padding: 10,
    borderColor: "#ccc",
    backgroundColor: "#f9f9f9",
    borderWidth: 1,
    borderRadius: 8,
  },
  text: {
    fontSize: 18,
  },
  footerContainer: {
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    borderTopColor: "#ddd",
  },
});

export default Tarde;
