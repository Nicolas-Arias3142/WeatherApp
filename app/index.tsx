import React, { useEffect, useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import CityList from "../components/CityList";
import PullUp from "@/components/PullUp";

const WEATHER_API = process.env.EXPO_PUBLIC_API_WEATHER_KEY;
const PLACES_API = process.env.EXPO_PUBLIC_API_PLACES_KEY;

const initialCities = [
  { name: "Toronto, ON, Canada", place_id: "ChIJpTvG15DL1IkRd8S0KlBVNTI" },
];

export default function Index() {
  const [weather, setWeather] = useState(null);
  const [city, setCity] = useState({
    name: "Toronto, ON, Canada",
    place_id: "ChIJpTvG15DL1IkRd8S0KlBVNTI",
  });
  const [cities, setCities] = useState(initialCities);
  const [searching, setSearching] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [reset, setReset] = useState(false);

  const [cityImage, setCityImage] = useState();

  useEffect(() => {
    const fetchCityData = async () => {
      try {
        const res = await fetch(
          `http://api.weatherapi.com/v1/current.json?key=${WEATHER_API}&q=${city.name}&aqi=no`
        );
        const data = await res.json();
        setWeather(data);
      } catch (error) {
        setWeather(null);
      }
    };
    fetchCityData();

    const fetchSuggestions = async () => {
      try {
        const res = await fetch(
          `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${city.name}&types=(cities)&key=${PLACES_API}`
        );
        const { predictions } = await res.json();
        const suggestions = predictions.map((prediction: any) => ({
          name: prediction.description,
          place_id: prediction.place_id, // Assuming place_id is available
        }));

        setSuggestions(suggestions);
      } catch (error) {
        console.log(error);
      }
    };
    if (city.name.length > 2 && searching) {
      fetchSuggestions();
    }
  }, [city, searching]);

  useEffect(() => {
    const fetchCityImage = async () => {
      try {
        // Fetch photo reference from Place Details API
        const detailsRes = await fetch(
          `https://maps.googleapis.com/maps/api/place/details/json?place_id=${city.place_id}&fields=photos&key=${PLACES_API}`
        );
        const detailsData = await detailsRes.json();

        if (
          !detailsData.result?.photos ||
          detailsData.result?.photos.length === 0
        ) {
          console.error("No photos found for this city.");
          return null;
        }

        // Extract photo reference
        const photoReference = detailsData.result?.photos[0].photo_reference;

        // Construct Place Photos API URL
        const imageUrl = `https://maps.googleapis.com/maps/api/place/photo?maxwidth=1000&maxheight=500&photoreference=${photoReference}&key=${PLACES_API}`;
        setCityImage(imageUrl);
      } catch (error) {
        console.error("Error fetching city image:", error);
        return null;
      }
    };
    fetchCityImage();
  }, [city]);

  function handleAddCity(city: { name: string; place_id: string }) {
    if (cities.find((c) => c.place_id === city.place_id)) {
      return;
    }
    setCities([...cities, city]);
  }

  function handleRemoveCity(city: { name: string; place_id: string }) {
    setCities(cities.filter((c) => c.place_id !== city.place_id));
  }

  function changeCity(city: { name: string; place_id: string }) {
    setCity(city);
    setReset(!reset);
  }

  function handleSelectSuggestion(city: { name: string; place_id: string }) {
    setCity(city);
    setSearching(false);
  }

  return (
    <GestureHandlerRootView>
      <View style={styles.wrapper}>
        <TextInput
          style={styles.input}
          placeholder="Enter city name"
          value={city.name}
          onChangeText={(text) => setCity({ ...city, name: text })}
          onFocus={() => setSearching(true)}
          placeholderTextColor="#B0B0B0" // Updated placeholder color
        />
        {city.name.length > 2 && !searching && (
          <>
            <View style={styles.pictureContainer}>
              <Image source={{ uri: cityImage }} style={styles.picture} />
            </View>
            <View style={styles.weatherInfo}>
              <View style={styles.row}>
                <Image
                  source={{ uri: "https:" + weather?.current?.condition.icon }}
                  style={styles.weatherIcon}
                />
                <Text style={styles.weatherCondition}>
                  {weather?.current?.condition.text}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>🌡 Temperature:</Text>
                <Text style={styles.value}>{weather?.current?.temp_c}°C</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>😙 Feels Like:</Text>
                <Text style={styles.value}>
                  {weather?.current?.feelslike_c}°C
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>💨 Wind Speed:</Text>
                <Text style={styles.value}>
                  {weather?.current?.gust_kph} kph
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>💧 Humidity:</Text>
                <Text style={styles.value}>{weather?.current?.humidity}%</Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.label}>📉 Pressure:</Text>
                <Text style={styles.value}>
                  {weather?.current?.pressure_mb} mb
                </Text>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => handleAddCity(city)}
              >
                <Text style={styles.buttonText}>Save City</Text>
              </TouchableOpacity>
            </View>

            <PullUp propWidth={400} propHeight={2000} reset={reset}>
              <View style={styles.pullUpContainer}>
                <Text style={styles.pullUpText}> Saved Cities</Text>
                <CityList
                  cities={cities}
                  handleRemoveCity={handleRemoveCity}
                  changeCity={changeCity}
                />
              </View>
            </PullUp>
          </>
        )}
        {searching && (
          <View style={styles.suggestionsContainer}>
            <CityList
              cities={suggestions}
              removeButton={false}
              handleRemoveCity={() => {}}
              changeCity={handleSelectSuggestion}
            />
          </View>
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: "center",
    backgroundColor: "#F5F5F5", // Light gray background for a soft look
  },
  title: {
    fontSize: 34,
    fontFamily: "Inter",
    fontWeight: "700",
    marginTop: -70,
    color: "#1976D2", // Deep blue title color
  },
  locationText: {
    fontSize: 26,
    fontFamily: "Inter",
    fontWeight: "600",
    marginBottom: 20,
    marginTop: 20,
    color: "#5D6D7E", // Soft gray location text color
  },

  tempText: {
    fontSize: 26,
    fontFamily: "Inter",
    color: "#1976D2", // Deep blue temperature text color
    marginLeft: -60,
  },
  weatherContainer: {
    backgroundColor: "#BBDEFB", // Light blue background for weather container
    width: "95%",
    borderRadius: 4,
    padding: 24,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  input: {
    fontSize: 18,
    color: "#0D47A1", // Dark blue text
    width: "95%",
    borderRadius: 4,
    margin: 20,
    height: 48,
    borderBottomWidth: 1,
    borderBottomColor: "#1976D2", // Deep blue border
    paddingHorizontal: 12,
    fontFamily: "Inter",
    textAlignVertical: "bottom",
  },
  button: {
    marginTop: 15,
    backgroundColor: "#FF7043", // Bright orange for contrast
    borderRadius: 6,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
  pictureContainer: {
    width: "95%",
    height: 200,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#ECEFF1", // Light gray background
  },
  picture: {
    width: "100%",
    height: "100%",
  },
  suggestionsContainer: {
    width: "95%",
    height: 300,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 20,
    backgroundColor: "#FF7043", // Light blue suggestions container
  },
  pullUpContainer: {
    alignItems: "center",
    width: "95%",
  },
  pullUpText: {
    marginTop: 20,
    color: "#ffff", // Medium gray text
    fontSize: 22,
    fontFamily: "Inter",
    fontWeight: "600",
  },
  extraInfoContainer: {
    width: "95%",
    height: 240,
    borderRadius: 4,
    overflow: "hidden",
    marginBottom: 10,
    marginTop: 20,
    backgroundColor: "#BBDEFB", // Light gray extra info background
  },
  weatherInfo: {
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#FFFFFF", // White background for a clean look
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    alignItems: "center",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  weatherIcon: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  weatherCondition: {
    fontSize: 22,
    fontWeight: "600",
    color: "#37474F",
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
  },
  label: {
    fontSize: 18,
    fontWeight: "500",
    color: "#455A64",
  },
  value: {
    fontSize: 18,
    fontWeight: "600",
    color: "#0288D1",
  },
});
