import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Checkbox } from "react-native-paper";
import axios from "axios";
import { useRouter, useLocalSearchParams } from "expo-router";
import { API_URL, useAuth } from "@/app/context/AuthContext";
import { useDate } from "@/app/context/DateContext";
import Botao from "@/components/Botao";
import BackButton from "@/components/BackButton";

const Manha = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const { selectedDate, setSelectedDate } = useDate();
  const [horarios, setHorarios] = useState([
    { time: "07:00 - 07:15", available: false },
    { time: "07:15 - 07:30", available: false },
    { time: "07:30 - 07:45", available: false },
    { time: "07:45 - 08:00", available: false },
    { time: "08:00 - 08:15", available: false },
    { time: "08:15 - 08:30", available: false },
    { time: "08:30 - 08:45", available: false },
    { time: "08:45 - 09:00", available: false },
    { time: "09:00 - 09:15", available: false },
    { time: "09:15 - 09:30", available: false },
    { time: "09:30 - 09:45", available: false },
    { time: "09:45 - 10:00", available: false },
    { time: "10:00 - 10:15", available: false },
    { time: "10:15 - 10:30", available: false },
    { time: "10:30 - 10:45", available: false },
    { time: "10:45 - 11:00", available: false },
    { time: "11:00 - 11:15", available: false },
    { time: "11:15 - 11:30", available: false },
    { time: "11:30 - 11:45", available: false },
    { time: "11:45 - 12:00", available: false },
  ]);

  const { authState } = useAuth();
  const token = authState.token;

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
      const allTimeSlots = [
        "07:00 - 07:15",
        "07:15 - 07:30",
        "07:30 - 07:45",
        "07:45 - 08:00",
        "08:00 - 08:15",
        "08:15 - 08:30",
        "08:30 - 08:45",
        "08:45 - 09:00",
        "09:00 - 09:15",
        "09:15 - 09:30",
        "09:30 - 09:45",
        "09:45 - 10:00",
        "10:00 - 10:15",
        "10:15 - 10:30",
        "10:30 - 10:45",
        "10:45 - 11:00",
        "11:00 - 11:15",
        "11:15 - 11:30",
        "11:30 - 11:45",
        "11:45 - 12:00"
      ];
  
      const updatedHorarios = allTimeSlots.map(time => ({
        time,
        available: response.data.some((h: any) => h.timeSlot === time && h.available)
      }));
  
      setHorarios(updatedHorarios);
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
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      newHorarios[index].available = newAvailability;
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
      <ScrollView contentContainerStyle={styles.scrollViewContainer}>
        <Text style={styles.headerText}>Horários da Manhã</Text>

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
  scrollViewContainer: {
    padding: 20,
    paddingBottom: 5,
  },
  headerText: {
    paddingTop: 30,
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 5,
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
    color: "#fff",
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

export default Manha;
