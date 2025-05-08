import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

export default function GenderSelection({values, setFieldValue}) {

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Select Gender</Text>
      <View style={styles.buttonGroup}>
        <Pressable
          style={[styles.button, values.gender === 'male' && styles.selectedButton]}
          onPress={() => {setFieldValue("gender", "male");}}
        >
          <Text style={[styles.buttonText, values.gender === 'male' && styles.selectedButtonText]}>
            Male
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, values.gender === 'female' && styles.selectedButton]}
          onPress={() => {setFieldValue("gender", "female");}}
        >
          <Text style={[styles.buttonText, values.gender === 'female' && styles.selectedButtonText]}>
            Female
          </Text>
        </Pressable>

        <Pressable
          style={[styles.button, values.gender === 'other' && styles.selectedButton]}
          onPress={() => {setFieldValue("gender", "other");}}
        >
          <Text style={[styles.buttonText, values.gender === 'other' && styles.selectedButtonText]}>
            Other
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 20,
    width: '100%',
  },
  label: {
    fontSize: 16,
    marginBottom: 10,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#eee',
    borderRadius: 8,
    marginHorizontal: 5,
  },
  selectedButton: {
    backgroundColor: '#ff6363',
  },
  buttonText: {
    fontSize: 14,
    color: '#333',
  },
  selectedButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
