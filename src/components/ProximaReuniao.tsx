import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FontAwesome } from '@expo/vector-icons';

const ProximaReuniao = () => {
  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <FontAwesome name="user" size={24} color="black" />
        <Text style={styles.text}>Nome da Pessoa</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.column}>
        <FontAwesome name="calendar" size={24} color="black" />
        <Text style={styles.text}>15/07/2024</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.column}>
        <FontAwesome name="clock-o" size={24} color="black" />
        <Text style={styles.text}>14:00</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f9f9f9',
    borderRadius: 10,
  },
  column: {
    alignItems: 'center',
  },
  text: {
    marginTop: 5,
    fontSize: 16,
  },
  divider: {
    width: 1,
    height: '100%',
    backgroundColor: '#ddd',
  },
});

export default ProximaReuniao;
