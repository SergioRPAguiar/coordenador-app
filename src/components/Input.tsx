import React from 'react';
import { TextInput, StyleSheet, TextInputProps, View } from 'react-native';

interface CustomInputProps extends TextInputProps {
  style?: object;
}

const Input: React.FC<CustomInputProps> = ({ style, ...props }) => {
  return (
    <View style={styles.container}>
      <TextInput style={[styles.input, style]} {...props} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    alignItems: "center",
  },
  input: {
    width: "80%",
    height: 40,
    borderWidth: 1,
    borderColor: "#008739",
    borderRadius: 5,
    marginBottom: 10,
    paddingLeft: 10,
  },
});

export default Input;
