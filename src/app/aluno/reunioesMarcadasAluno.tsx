import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  RefreshControl,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import { API_URL } from "@/context/AuthContext";
import { router, useFocusEffect } from "expo-router";
import BackButton from "@/components/BackButton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";

dayjs.extend(utc);
dayjs.extend(timezone);

interface Reuniao {
  _id: string;
  date: string;
  timeSlot: string;
  reason: string;
  canceled?: boolean;
  cancelReason?: string;
}

const ReunioesMarcadasAlunos = () => {
  const { authState } = useAuth();
  const [reunioes, setReunioes] = useState<Reuniao[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const [cancelarReuniaoId, setCancelarReuniaoId] = useState<string | null>(
    null
  );
  const [motivoCancelamento, setMotivoCancelamento] = useState<string>("");
  const [isCancelling, setIsCancelling] = useState(false);

  const fetchReunioes = async () => {
    if (!authState?.authenticated || !authState.user?._id || !authState.token) {
      router.replace("/login");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/meeting/allFutureForStudent`, {
        params: { userId: authState.user._id },
        headers: { Authorization: `Bearer ${authState.token}` },
      });
      const data: Reuniao[] = Array.isArray(response.data)
        ? response.data
        : [response.data];
      setReunioes(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  useFocusEffect(
  React.useCallback(() => {
    if (authState?.authenticated && authState?.user?._id) {
      fetchReunioes();
    }
  }, [authState?.authenticated, authState?.user?._id])
);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchReunioes();
    setRefreshing(false);
  };

  const handleCancelar = async () => {
    if (!motivoCancelamento.trim()) {
      Alert.alert("Informe o motivo do cancelamento");
      return;
    }
    setIsCancelling(true);
    try {
      await axios.patch(
        `${API_URL}/meeting/${cancelarReuniaoId}/cancel`,
        { reason: motivoCancelamento, userId: authState.user!._id },
        { headers: { Authorization: `Bearer ${authState.token}` } }
      );
      await fetchReunioes();
      setCancelarReuniaoId(null);
      setMotivoCancelamento("");
    } catch (e) {
      console.error("Erro ao cancelar reunião:", e);
      Alert.alert("Não foi possível cancelar");
    } finally {
      setIsCancelling(false);
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView
        contentContainerStyle={styles.scrollViewContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {reunioes.length > 0 ? (
          reunioes.map((r) => (
            <View key={r._id} style={styles.reuniaoContainer}>
              <Text style={styles.title}>Reunião Agendada</Text>
              <Text>
                <Text style={styles.labelBold}>Data:</Text>{" "}
                {format(dayjs(r.date).toDate(), "dd/MM/yyyy", { locale: ptBR })}
              </Text>
              <Text>
                <Text style={styles.labelBold}>Hora:</Text> {r.timeSlot}
              </Text>
              <Text>
                <Text style={styles.labelBold}>Motivo:</Text> {r.reason}
              </Text>

              {cancelarReuniaoId === r._id ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Motivo do cancelamento"
                    value={motivoCancelamento}
                    onChangeText={setMotivoCancelamento}
                    multiline
                  />
                  <TouchableOpacity
                    style={[
                      styles.confirmButton,
                      isCancelling && { opacity: 0.6 },
                    ]}
                    onPress={handleCancelar}
                    disabled={isCancelling}
                  >
                    <Text style={styles.buttonText}>
                      {isCancelling ? "Cancelando..." : "Confirmar"}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => setCancelarReuniaoId(null)}>
                    <Text style={styles.buttonText}>Voltar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.uncheckButton}
                  onPress={() => setCancelarReuniaoId(r._id)}
                >
                  <Text style={styles.buttonText}>Desmarcar</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noMeetingsText}>Sem reuniões futuras</Text>
        )}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
    paddingTop: 60,
  },
  reuniaoContainer: {
    marginBottom: 24,
    padding: 18,
    backgroundColor: "#fff",
    borderRadius: 12,
    elevation: 2,
  },
  title: { fontSize: 18, fontWeight: "600", color: "#32A041", marginBottom: 8 },
  labelBold: { fontWeight: "600" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginTop: 8,
  },
  confirmButton: {
    backgroundColor: "#d32f2f",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  uncheckButton: {
    backgroundColor: "#f44336",
    padding: 12,
    borderRadius: 8,
    marginTop: 8,
  },
  buttonText: { color: "#fff", textAlign: "center", fontWeight: "600" },
  noMeetingsText: { textAlign: "center", marginTop: 30, color: "#777" },
  scrollViewContent: { paddingBottom: 50 },
});

export default ReunioesMarcadasAlunos;
