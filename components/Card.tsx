import { StyleProp, ViewStyle, Animated } from 'react-native';
import { ThemedView } from './ThemedView';
import { useContext, useRef } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';
import { PanGestureHandler, HandlerStateChangeEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';

interface CardProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  onSwipe?: (direction: 'left' | 'right') => void;
}

export function Card({ children, style, onSwipe }: CardProps) {
  const { theme } = useContext(ThemeContext);
  const panRef = useRef(null);

  // Add Animated.Value for horizontal translation
  const translateX = useRef(new Animated.Value(0)).current;

  // Animated event for gesture
  const handlePan = Animated.event(
    [{ nativeEvent: { translationX: translateX } }],
    { useNativeDriver: true }
  );

  const handleGestureEvent = (event: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
    if (event.nativeEvent.state === 5) { // 5 === State.END
      const { translationX } = event.nativeEvent;
      if (onSwipe && Math.abs(translationX) > 40) {
        // Animate card out
        Animated.timing(translateX, {
          toValue: translationX > 0 ? 500 : -500,
          duration: 200,
          useNativeDriver: true,
        }).start(() => {
          translateX.setValue(0);
          onSwipe(translationX > 0 ? 'right' : 'left');
        });
      } else {
        // Animate card back to center
        Animated.spring(translateX, {
          toValue: 0,
          useNativeDriver: true,
        }).start();
      }
    }
  };

  if (onSwipe) {
    return (
      <PanGestureHandler
        ref={panRef}
        onGestureEvent={handlePan}
        onHandlerStateChange={handleGestureEvent}
        activeOffsetX={[-20, 20]}
      >
        <Animated.View style={{ transform: [{ translateX }] }}>
          <ThemedView
            style={[
              {
                backgroundColor: theme === 'dark' ? '#27272a' : 'white',
                borderRadius: 10,
                padding: 10,
                shadowColor: theme === 'dark' ? '#000' : 'black',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 10,
                elevation: 5,
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                margin: 5,
                display: "flex"
              },
              style
            ]}
          >
            {children}
          </ThemedView>
        </Animated.View>
      </PanGestureHandler>
    );
  }

  return (
    <ThemedView
      style={[
        {
          backgroundColor: theme === 'dark' ? '#27272a' : 'white',
          borderRadius: 10,
          padding: 10,
          shadowColor: theme === 'dark' ? '#000' : 'black',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 10,
          elevation: 5,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          margin: 5,
          display: "flex"
        },
        style
      ]}
    >
      {children}
    </ThemedView>
  );
}