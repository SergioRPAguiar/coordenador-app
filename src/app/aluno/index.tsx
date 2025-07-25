import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from "react-native";
import ProximaReuniaoAluno from "@/components/ProximaReuniaoAluno";
import Calendario from "@/components/Calendario";
import { useAuth } from "@/context/AuthContext";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { theme } from "@/theme";
import { useFocusEffect } from "expo-router";

const PainelAluno = () => {
  const { onLogout, authState } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const primeiroNome = authState.user?.name
    ? authState.user.name.split(" ")[0]
    : "Aluno";

  const atualizarProximaReuniao = useCallback(() => {
    setRefreshTrigger((prev) => prev + 1);
  }, []);

  useFocusEffect(
    useCallback(() => {
      atualizarProximaReuniao();
    }, [atualizarProximaReuniao])
  );

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    atualizarProximaReuniao();

    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  }, [atualizarProximaReuniao]);

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Olá, {primeiroNome}!</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
          <MaterialCommunityIcons
            name="logout"
            size={20}
            color="#666"
            style={{ transform: [{ scaleX: -1 }] }}
          />
          <Text style={styles.logoutText}>Sair</Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        <ProximaReuniaoAluno key={refreshTrigger} />
        <Text style={styles.sectionTitle}>Agende sua próxima reunião</Text>
        <Calendario isProfessor={false} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#32A041",
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    padding: 6,
  },
  logoutText: {
    color: "#555",
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
  },
  content: {
    paddingHorizontal: 16,
    paddingBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#32A041",
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 4,
  },
});

export default PainelAluno;
