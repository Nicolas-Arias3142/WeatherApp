import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";

export default function CityList({
  cities,
  handleRemoveCity,
  changeCity,
  removeButton = true,
}: {
  cities: { name: string; place_id: string }[];
  handleRemoveCity: (city: { name: string; place_id: string }) => void;
  changeCity: (city: { name: string; place_id: string }) => void;
  removeButton?: boolean;
}) {
  return (
    <ScrollView style={styles.container}>
      {cities.map((city) => (
        <View key={city.place_id} style={styles.cityItem}>
          <TouchableOpacity onPress={() => changeCity(city)}>
            <Text style={styles.cityText}>{city.name}</Text>
          </TouchableOpacity>
          {removeButton && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={() => handleRemoveCity(city)}
            >
              <Text style={styles.buttonText}>x</Text>
            </TouchableOpacity>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "95%",
    maxHeight: 300,
    marginTop: 10,
  },
  cityItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 0,
    borderBottomColor: "#fff",
  },
  cityText: {
    fontSize: 16,
    color: "#ffff",
    fontFamily: "Inter",
    marginTop: 8,
    marginBottom: 8,
  },
  removeButton: {
    width: 10,
    borderColor: "#ffff",
    marginRight: 10,
  },
  buttonText: {
    color: "#ffff",
    fontWeight: "bold",
    fontSize: 16,
  },
});
