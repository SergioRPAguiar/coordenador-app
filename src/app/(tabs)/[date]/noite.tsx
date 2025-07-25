import React from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  Alert,
  RefreshControl,
} from "react-native";
import { Checkbox } from "react-native-paper";
import axios from "axios";
import { router } from "expo-router";
import { API_URL, useAuth } from "@/context/AuthContext";
import { useDate } from "@/context/DateContext";
import Botao from "@/components/Botao";
import BackButton from "@/components/BackButton";
import { useHorarios } from "@/hooks/useHorarios";
import { slots } from "@/utils/horariosSlots";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";

dayjs.locale("pt-br");

const Noite = () => {
  const { selectedDate } = useDate();
  const { authState } = useAuth();
  const token = authState?.token;

  const { horarios, error, refresh, updateLocal } = useHorarios(
    selectedDate,
    token,
    slots.noite
  );

  const toggleDisponibilidade = async (index: number) => {
    if (!authState?.user) {
      Alert.alert("Erro", "Usuário não autenticado.");
      return;
    }
    if (!token) return;

    const newAvailability = !horarios[index].available;

    try {
      updateLocal((prev) =>
        prev.map((h, i) =>
          i === index ? { ...h, available: newAvailability } : h
        )
      );

      await axios.post(
        `${API_URL}/schedule`,
        {
          date: selectedDate,
          timeSlot: horarios[index].time,
          available: newAvailability,
          professorId: authState?.user._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      await refresh();
    } catch (error: any) {
      updateLocal((prev) =>
        prev.map((h, i) =>
          i === index ? { ...h, available: !newAvailability } : h
        )
      );

      if (axios.isAxiosError(error) && error.response?.status === 409) {
        Alert.alert("Horário reservado", error.response.data.message);
      } else {
        Alert.alert("Erro", "Erro ao atualizar horário");
      }
    }
  };

  const onRefresh = async () => {
    await refresh();
  };

  if (error) return <Text>Erro: {error}</Text>;

  return (
    <View style={styles.container}>
      <BackButton />

      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        refreshControl={
          <RefreshControl refreshing={false} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.headerText}>Horários da Noite</Text>
        <Text style={styles.dateText}>
          {dayjs(selectedDate).format("DD/MM/YYYY")}
        </Text>

        {horarios.length > 0 ? (
          horarios.map((horario, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.time}>{horario.time}</Text>
                <Checkbox
                  status={horario.available ? "checked" : "unchecked"}
                  onPress={() => toggleDisponibilidade(index)}
                  color={horario.available ? "#32A041" : "#ccc"}
                />
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.noSlots}>Nenhum horário cadastrado</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    padding: 20,
  },
  scrollContainer: {
    paddingBottom: 60,
  },
  headerText: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#32A041",
    textAlign: "center",
    marginVertical: 10,
  },
  dateText: {
    fontSize: 16,
    color: "#333",
    textAlign: "center",
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  time: {
    fontSize: 18,
    color: "#333",
  },
  noSlots: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 30,
  },
  footer: {
    marginTop: 10,
  },
});

export default Noite;
