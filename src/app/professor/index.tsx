import React, { useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProximaReuniao from '@/components/ProximaReuniao';
import Calendario from '@/components/Calendario';
import { useAuth } from '@/app/context/AuthContext';
import { useFocusEffect } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/theme';

const Painel = () => {
  const { onLogout } = useAuth();

  useFocusEffect(
    useCallback(() => {
      console.log('Tela de Painel voltou a ficar em foco.');
    }, [])
  );

  const components = [
    { key: 'ProximaReuniao', component: <ProximaReuniao /> },
    { key: 'Calendario', title: 'Calendário', component: <Calendario isProfessor={true} /> },
  ];

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton} onPress={onLogout}>
        <MaterialCommunityIcons name="logout" size={20} color="#666" style={{ transform: [{ scaleX: -1 }] }} />
        <Text style={styles.logoutText}>Sair</Text>
      </TouchableOpacity>
      <FlatList
        data={components}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>{item.title}</Text>
            {item.component}
          </View>
        )}
        contentContainerStyle={styles.contentContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingVertical: 10,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    padding: 1,
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 10,
  },
  logoutText: {
    color: '#666',
    fontSize: 14,
    fontFamily: theme.fontFamily.medium,
  },
  contentContainer: {
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: 20,
    marginVertical: 10,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    marginBottom: 10,
  },
});

export default Painel;
