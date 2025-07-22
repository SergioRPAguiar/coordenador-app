import React from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { useAuth } from "@/app/context/AuthContext";
import { useRouter } from "expo-router";
import BackButton from "@/components/BackButton";
import { theme } from "@/theme";

const formatPhone = (value?: string) => {
  const cleaned = value?.replace(/\D/g, "").slice(0, 11) || "";

  if (cleaned.length < 3) return cleaned;
  if (cleaned.length < 8) return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2)}`;
  return `(${cleaned.slice(0, 2)}) ${cleaned.slice(2, 7)}-${cleaned.slice(7)}`;
};

export default function PerfilProfessor() {
  const { authState, onLogout } = useAuth();
  const router = useRouter();

  const user = authState?.user;

  return (
    <View style={styles.container}>
      <BackButton />

      <Text style={styles.sectionTitle}>Minha Conta</Text>

      <View style={styles.card}>
        <Text style={styles.label}>Nome</Text>
        <Text style={styles.value}>{user?.name}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>E-mail</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Contato</Text>
          <TouchableOpacity
            onPress={() => router.push("/professor/editarContato")}
          >
            <Text style={styles.editLink}>Editar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.value}>{formatPhone(user?.contato)}</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <Text style={styles.label}>Senha</Text>
          <TouchableOpacity
            onPress={() => router.push("/professor/editarSenha")}
          >
            <Text style={styles.editLink}>Editar</Text>
          </TouchableOpacity>
        </View>
        <Text style={styles.value}>••••••••</Text>
      </View>

      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <Text style={styles.logoutText}>Sair da conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f9f9f9",
    paddingHorizontal: 16,
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: "#008739",
    marginBottom: 16,
    marginTop: 50,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  label: {
    fontSize: 14,
    color: "#777",
    fontFamily: theme.fontFamily.primary,
  },
  value: {
    fontSize: 16,
    color: "#111",
    marginTop: 4,
    fontFamily: theme.fontFamily.medium,
  },
  editLink: {
    fontSize: 14,
    color: "#008739",
    textDecorationLine: "underline",
    fontFamily: theme.fontFamily.medium,
  },
  rowBetween: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  logoutButton: {
    marginTop: 20,
    alignSelf: "center",
    padding: 10,
  },
  logoutText: {
    fontSize: 14,
    color: "#666",
    textDecorationLine: "underline",
    fontFamily: theme.fontFamily.medium,
  },
});
