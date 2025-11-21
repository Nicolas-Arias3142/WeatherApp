//https://docs.swmansion.com/react-native-gesture-handler/docs/fundamentals/installation/
//https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/getting-started/
//https://docs.swmansion.com/react-native-reanimated/docs/fundamentals/handling-gestures/
import React, { useEffect } from "react";
import { View, StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { GestureDetector, Gesture } from "react-native-gesture-handler";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const SIZE = 300.0;
const BOX_HEIGHT = 300;

export default function Index({
  propWidth = 400,
  propHeight = 300,
  children,
  reset,
}) {
  const offsetY = useSharedValue(0);

  useEffect(() => {
    offsetY.value = withTiming(970, { duration: 500 });
  }, [reset]);

  const panGesture = Gesture.Pan()
    .onChange((event) => {
      if (offsetY.value >= 370 && offsetY.value <= 980) {
        offsetY.value += event.changeY;
      }
    })
    .onEnd(() => {
      if (offsetY.value < 370) {
        offsetY.value = withTiming(375, { duration: 500 });
      }
      if (offsetY.value > 980) {
        offsetY.value = withTiming(970, { duration: 500 });
      }
      if (offsetY.value > 890) {
        offsetY.value = withTiming(970, { duration: 500 });
      }
      if (offsetY.value < 890) {
        offsetY.value = withTiming(375, { duration: 500 });
      }
    });

  const rStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateY: offsetY.value }],
    };
  });

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <View style={[styles.box, { width: propWidth, height: 50 }]}>
          <GestureDetector gesture={panGesture}>
            <Animated.View
              style={[
                styles.square,
                { width: propWidth, height: propHeight }, // Fixed height
                rStyle,
              ]}
            >
              {/* Content Wrapper - prevents affecting height */}
              <View
                style={{
                  flex: 1,
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                }}
              >
                {children}
              </View>
            </Animated.View>
          </GestureDetector>
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F5F5F5", // Light gray background
  },
  square: {
    backgroundColor: "#FF7043", // White square background FF7043
    borderRadius: 20,
    overflow: "hidden",
    borderWidth: 3,
    borderColor: "rgba(0, 0, 0, 0.1)", // Light shadow effect
    shadowColor: "#000000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
  },
  box: {
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E3F2FD", // Light blue accent background
    padding: 10,
  },
});
