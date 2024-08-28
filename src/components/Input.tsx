// src/components/Input.tsx
import React from 'react';
import { View, TextInput, Text, StyleSheet } from 'react-native';

interface CustomInputProps {
  placeholder: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
  onBlur: () => void;
  value: string;
  errorMessage?: string; 
}

const Input: React.FC<CustomInputProps> = ({ 
  placeholder, 
  secureTextEntry = false, 
  onChangeText, 
  onBlur, 
  value, 
  errorMessage 
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={[styles.input, errorMessage ? styles.inputError : null]}
        placeholder={placeholder}
        secureTextEntry={secureTextEntry}
        onChangeText={onChangeText}
        onBlur={onBlur}
        value={value}
      />
      {errorMessage && <Text style={styles.errorText}>{errorMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
  },
  inputError: {
    borderColor: 'red',
  },
  errorText: {
    color: 'red',
    marginTop: 5,
  },
});

export default Input;
