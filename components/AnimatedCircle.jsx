import { StatusBar } from "expo-status-bar";
import React from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedGestureHandler,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SIZE = 100.0;
const CIRCLE_RADIUS = SIZE * 2;

export default function Index() {
  const offsetX = useSharedValue(0);
  const offsetY = useSharedValue(0);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      offsetX.value += event.changeX;
      offsetY.value += event.changeY;
    })
    .onEnd(() => {
      const distance = Math.sqrt(offsetX.value ** 2 + offsetY.value ** 2);
      if (distance < CIRCLE_RADIUS + SIZE / 2) {
        offsetY.value = withTiming(0, { duration: 500 });
        offsetX.value = withTiming(0, { duration: 500 });
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: offsetX.value }, { translateY: offsetY.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={styles.circle}>
          <GestureDetector gesture={panGesture}>
            <Animated.View style={[styles.square, rStyle]} />
          </GestureDetector>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  square: {
    width: SIZE,
    height: SIZE,
    backgroundColor: "rgba(0,0,256, 0.5)",
    borderRadius: 20,
  },
  circle: {
    width: CIRCLE_RADIUS * 2,
    height: CIRCLE_RADIUS * 2,
    borderColor: "rgba(0,256,0, 0.5)",
    borderWidth: 5,
    borderRadius: CIRCLE_RADIUS,
    alignItems: "center",
    justifyContent: "center",
  },
});
