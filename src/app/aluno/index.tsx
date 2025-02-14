import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import ProximaReuniaoAluno from '@/components/ProximaReuniaoAluno';
import Calendario from '@/components/Calendario';
import { useAuth } from '@/app/context/AuthContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { theme } from '@/theme';

const PainelAluno = () => {
  const { onLogout } = useAuth();

  const components = [
    { key: 'ProximaReuniaoAluno', component: <ProximaReuniaoAluno /> },
    { key: 'Calendario', title: 'Calendário', component: <Calendario isProfessor={false} /> },
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
  contentContainer: {
    flexGrow: 1,
  },
  section: {
    paddingHorizontal: 20,
  },
  sectionTitle: {
    textAlign: 'center',
    fontSize: 30,
    fontWeight: 'bold',
    
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
});

export default PainelAluno;
