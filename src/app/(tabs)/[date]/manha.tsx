import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, Alert } from "react-native";
import { Checkbox } from "react-native-paper";
import axios from "axios";
import { useRouter, useLocalSearchParams, router } from "expo-router";
import { API_URL, useAuth } from "@/app/context/AuthContext";
import { useDate } from "@/app/context/DateContext";
import Botao from "@/components/Botao";
import BackButton from "@/components/BackButton";
import { useHorarios } from '@/hooks/useHorarios';
import { slots } from '@/utils/horariosSlots';

const Manha = () => {
  const { selectedDate } = useDate();
  const { authState } = useAuth();
  const token = authState?.token;
  
  const { 
    horarios,  
    error, 
    refresh,
    updateLocal
  } = useHorarios(selectedDate, token, slots.manha);

  const toggleDisponibilidade = async (index: number) => {
    if (!token) return;
    
    const newAvailability = !horarios[index].available;

    try {
      
      updateLocal(prev => prev.map((h, i) => 
        i === index ? {...h, available: newAvailability} : h
      ));

      await axios.post(
        `${API_URL}/schedule`,
        {
          date: selectedDate,
          timeSlot: horarios[index].time,
          available: newAvailability
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refresh();

    } catch (error) {
      console.error('Erro ao atualizar horário:', error);
      updateLocal(prev => prev.map((h, i) => 
        i === index ? {...h, available: !newAvailability} : h
      ));
    }
  };

  if (error) return <Text>Erro: {error}</Text>;


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
