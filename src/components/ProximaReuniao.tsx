import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { API_URL, useAuth } from "@/app/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import dayjs from "dayjs";

const ProximaReuniaoProfessor = () => {
  const { authState } = useAuth();
  const [proximaReuniao, setProximaReuniao] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    async function fetchNext() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `${API_URL}/meeting/nextForProfessor`,
          {
            headers: {
              Authorization: `Bearer ${authState.token}`,
            },
          }
        );
        if (data) {
          const formatted = dayjs(data.date).format("DD/MM/YYYY");
          setProximaReuniao(`${formatted} | ${data.timeSlot}`);
        } else {
          setProximaReuniao(null);
        }
      } catch (e) {
        setProximaReuniao(null);
      } finally {
        setLoading(false);
      }
    }
    fetchNext();
  }, [authState.token]);

  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <MaterialCommunityIcons
          name="calendar-clock"
          size={22}
          color="#008739"
        />
        <Text style={styles.cardTitle}>Próxima Reunião</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="small" color="#008739" />
      ) : (
        <Text style={styles.reuniao}>
          {proximaReuniao ?? "—"}
        </Text>
      )}

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push("/professor/reunioesMarcadas")}
      >
        <Text style={styles.buttonText}>Ver todas</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    marginHorizontal: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#008739",
    marginLeft: 8,
  },
  reuniao: {
    fontSize: 16,
    color: "#333",
    marginBottom: 12,
  },
  button: {
    alignSelf: "flex-start",
    backgroundColor: "#008739",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ProximaReuniaoProfessor;
