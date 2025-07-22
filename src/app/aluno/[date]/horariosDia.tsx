import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TextInput,
  StyleSheet,
  Alert,
  RefreshControl,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Checkbox } from "react-native-paper";
import axios from "axios";
import { useRouter, useLocalSearchParams, useFocusEffect } from "expo-router";
import { API_URL, useAuth } from "@/app/context/AuthContext";
import { useDate } from "@/app/context/DateContext";
import Botao from "@/components/Botao";
import BackButton from "@/components/BackButton";
import dayjs from "dayjs";

interface Horario {
  timeSlot: string;
  available: boolean;
}

const HorariosDia = () => {
  const router = useRouter();
  const { date } = useLocalSearchParams();
  const { selectedDate, setSelectedDate } = useDate();
  const [horarios, setHorarios] = useState<Horario[]>([]);
  const [motivo, setMotivo] = useState("");
  const [selectedHorario, setSelectedHorario] = useState<string | null>(null);
  const { authState } = useAuth();
  const token = authState.token;
  const [motivoInvalido, setMotivoInvalido] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (date) {
      setSelectedDate(date as string);
    }
  }, [date]);

  const fetchHorarios = useCallback(
    async (data: string) => {
      try {
        const response = await axios.get(
          `${API_URL}/schedule/available/${data}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const sortedHorarios = response.data.sort((a: Horario, b: Horario) =>
          a.timeSlot.localeCompare(b.timeSlot)
        );
        setHorarios(sortedHorarios);
      } catch (error) {
        console.error("Erro ao buscar horários:", error);
      }
    },
    [token]
  );

  useFocusEffect(
    useCallback(() => {
      if (selectedDate) {
        fetchHorarios(selectedDate);
      }
    }, [fetchHorarios, selectedDate])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    try {
      if (selectedDate) {
        await fetchHorarios(selectedDate);
      }
    } catch (error) {
      console.error("Erro ao atualizar:", error);
    } finally {
      setRefreshing(false);
    }
  };

  const confirmarReuniao = async () => {
    if (!authState.user) return;
    if (!motivo.trim()) {
      setMotivoInvalido(true);
      return;
    }

    try {
      await axios.post(
        `${API_URL}/meeting`,
        {
          date: dayjs(selectedDate).format("YYYY-MM-DD"),
          timeSlot: selectedHorario,
          reason: motivo,
          userId: authState.user._id,
        },
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );

      setSelectedHorario(null);
      setMotivo("");
      setMotivoInvalido(false);

      if (selectedDate) await fetchHorarios(selectedDate);

      Alert.alert(
        "Reunião Marcada",
        `Reunião marcada com sucesso para ${dayjs(selectedDate).format(
          "DD/MM/YYYY"
        )} às ${selectedHorario}`
      );
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 400) {
        const msg = error.response.data.message;

        if (msg === "Horário indisponível") {
          Alert.alert(
            "Horário Indisponível",
            "Este horário foi reservado por outro aluno.",
            [
              {
                text: "OK",
                onPress: () => {
                  fetchHorarios(selectedDate);
                  setSelectedHorario(null);
                  setMotivo("");
                },
              },
            ]
          );
          return;
        }

        if (msg === "Reuniões não podem ser marcadas no Domingo") {
          Alert.alert(
            "Agendamento não permitido",
            "Reuniões não podem ser marcadas no domingo."
          );
          return;
        }
      }

      Alert.alert(
        "Erro",
        "Não foi possível marcar a reunião. Tente novamente."
      );
    }
  };

  const handleSelectHorario = (horario: string) => {
    const horarioSelecionado = horarios.find((h) => h.timeSlot === horario);
    if (!horarioSelecionado?.available) {
      Alert.alert(
        "Horário Indisponível",
        "Este horário já foi reservado por outro aluno"
      );
      return;
    }
    setSelectedHorario(selectedHorario === horario ? null : horario);
    setMotivoInvalido(false);
    setMotivo("");
  };

  const handleInputFocus = () => {
    setMotivoInvalido(false);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <BackButton />
      <ScrollView
        contentContainerStyle={styles.scrollContainer}
        keyboardShouldPersistTaps="handled"
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <Text style={styles.headerText}>Horários Disponíveis</Text>
        <Text style={styles.dateText}>
          {dayjs(selectedDate).format("DD/MM/YYYY")}
        </Text>

        {horarios.length > 0 ? (
          horarios.map((horario, index) => (
            <View key={index} style={styles.card}>
              <View style={styles.row}>
                <Text style={styles.time}>{horario.timeSlot}</Text>
                <Checkbox
                  status={
                    selectedHorario === horario.timeSlot
                      ? "checked"
                      : "unchecked"
                  }
                  onPress={() => handleSelectHorario(horario.timeSlot)}
                  disabled={!horario.available}
                  color="#008739"
                />
              </View>
              {selectedHorario === horario.timeSlot && (
                <View style={styles.formSection}>
                  <TextInput
                    style={[styles.input, motivoInvalido && styles.inputError]}
                    placeholder="Motivo da reunião"
                    value={motivo}
                    onChangeText={setMotivo}
                    onFocus={handleInputFocus}
                    multiline
                  />
                  {motivoInvalido && (
                    <Text style={styles.errorText}>Campo obrigatório</Text>
                  )}
                  <Botao title="Marcar Reunião" onPress={confirmarReuniao} />
                </View>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noSlots}>Nenhum horário disponível</Text>
        )}
      </ScrollView>
    </KeyboardAvoidingView>
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
    color: "#008739",
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
  formSection: {
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
    marginBottom: 10,
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 14,
    marginBottom: 10,
  },
  noSlots: {
    textAlign: "center",
    color: "#999",
    fontSize: 16,
    marginTop: 30,
  },
});

export default HorariosDia;
