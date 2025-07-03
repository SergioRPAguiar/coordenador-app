import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  Alert,
  TouchableOpacity,
} from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import axios from "axios";
import { API_URL } from "@/app/context/AuthContext";
import { router } from "expo-router";
import Botao from "@/components/Botao";
import BackButton from "@/components/BackButton";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

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
  const [error, setError] = useState<string | null>(null);
  const [cancelarReuniaoId, setCancelarReuniaoId] = useState<string | null>(
    null
  );
  const [motivoCancelamento, setMotivoCancelamento] = useState<string>("");

  useEffect(() => {
    const fetchReunioes = async () => {
      // Verificação mais rigorosa
      if (
        !authState?.authenticated ||
        !authState.user?._id ||
        !authState.token
      ) {
        setError("Usuário não autenticado");
        setLoading(false);
        router.replace("/login"); // Redireciona imediatamente
        return;
      }

      try {
        const response = await axios.get(`${API_URL}/meeting/allForStudent`, {
          params: { userId: authState.user._id },
          headers: { Authorization: `Bearer ${authState.token}` },
        });
        
        const raw: Reuniao[] = Array.isArray(response.data)
        ? response.data
        : [response.data];

      // → Aqui filtra antes de setar:
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const futuras = raw.filter(r => {
        const dt = new Date(r.date);      // cria data sem hora
        return dt >= hoje;                // só mantém hoje/em diante
      });

      setReunioes(futuras);
      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.response?.status === 401) {
            setError("Sessão expirada");
            router.replace("/login");
          } else {
            setError("Erro ao carregar reuniões");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchReunioes();
  }, [authState?.authenticated]);

  const handleCancelar = async () => {
    if (!authState?.token) {
      Alert.alert("Erro", "Sessão expirada");
      router.replace("/login");
      return;
    }

    if (!motivoCancelamento.trim()) {
      Alert.alert("Atenção", "Por favor, insira o motivo do cancelamento");
      return;
    }

    try {
      await axios.patch(
        `${API_URL}/meeting/${cancelarReuniaoId}/cancel`,
        { reason: motivoCancelamento },
        {
          headers: {
            Authorization: `Bearer ${authState.token}`,
            "Content-Type": "application/json",
          },
        }
      );

      setReunioes((prev) => prev.filter((r) => r._id !== cancelarReuniaoId));
      setCancelarReuniaoId(null);
      setMotivoCancelamento("");

      Alert.alert("Sucesso", "Reunião cancelada com sucesso");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          Alert.alert("Sessão expirada", "Faça login novamente");
          router.replace("/login");
        } else {
          Alert.alert(
            "Erro",
            error.response?.data?.message || "Erro ao cancelar"
          );
        }
      }
    }
  };

  return (
    <View style={styles.container}>
      <BackButton />
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        {reunioes.length > 0 ? (
          reunioes.map((reuniao) => (
            <View key={reuniao._id} style={styles.reuniaoContainer}>
              <Text style={styles.label}>
                Data:{" "}
                {format(new Date(reuniao.date), "dd/MM/yyyy", { locale: ptBR })}
              </Text>
              <Text style={styles.label}>Hora: {reuniao.timeSlot}</Text>
              <Text style={styles.label}>Motivo: {reuniao.reason}</Text>

              {cancelarReuniaoId === reuniao._id ? (
                <>
                  <TextInput
                    style={styles.input}
                    placeholder="Motivo do cancelamento"
                    value={motivoCancelamento}
                    onChangeText={setMotivoCancelamento}
                    multiline
                  />
                  <TouchableOpacity
                    style={styles.confirmButton}
                    onPress={handleCancelar}
                  >
                    <Text style={styles.buttonText}>
                      Confirmar cancelamento
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.cancelButton}
                    onPress={() => setCancelarReuniaoId(null)}
                  >
                    <Text style={styles.buttonText}>Cancelar</Text>
                  </TouchableOpacity>
                </>
              ) : (
                <TouchableOpacity
                  style={styles.uncheckButton}
                  onPress={() => setCancelarReuniaoId(reuniao._id)}
                >
                  <Text style={styles.buttonText}>Desmarcar reunião</Text>
                </TouchableOpacity>
              )}
            </View>
          ))
        ) : (
          <Text style={styles.noMeetingsText}>
            Sem reuniões futuras marcadas
          </Text>
        )}
      </ScrollView>

      <View style={styles.footerContainer}>
        <Botao
          title="Voltar para o Calendário"
          onPress={() => router.replace("/aluno")}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#fff",
    flex: 1,
    paddingTop: 60,
  },
  reuniaoContainer: {
    marginBottom: 30,
    padding: 10,
    alignItems: "center",
    borderColor: "#ddd",
    borderWidth: 2,
    borderRadius: 5,
  },
  label: {
    fontSize: 16,
    color: "#333",
    marginBottom: 3,
  },
  input: {
    borderColor: "#ccc",
    width: "100%",
    marginTop: 5,
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 8,
    alignItems: "center",
  },
  confirmButton: {
    backgroundColor: "#ff4d4d",
    width: "100%",
    marginTop: 5,
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#6e6e6e",
    width: "100%",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  uncheckButton: {
    backgroundColor: "#ff4d4d",
    width: "100%",
    padding: 10,
    borderRadius: 15,
    alignItems: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  footerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    padding: 10,
    backgroundColor: "#fff",
    borderTopWidth: 0,
    borderTopColor: "#ddd",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  noMeetingsText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  scrollViewContent: {
    paddingBottom: 50,
  },
});

export default ReunioesMarcadasAlunos;
