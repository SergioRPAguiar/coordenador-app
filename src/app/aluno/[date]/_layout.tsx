import React from 'react';
import { Tabs } from 'expo-router';

const AlunoLayout = () => {
  return (
    <Tabs>
      <Tabs.Screen name="horariosDia" options={{ title: 'Horarios disponiveis no dia' }} />
    </Tabs>
  );
};

export default AlunoLayout;
