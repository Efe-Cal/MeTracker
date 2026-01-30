import { StyleProp, ViewStyle, Animated, Platform } from 'react-native';
import { ThemedView } from './ThemedView';
import { useContext, useRef } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';
import { PanGestureHandler, HandlerStateChangeEvent, PanGestureHandlerEventPayload } from 'react-native-gesture-handler';
import { Colors } from '@/constants/Colors';

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

  const cardStyle = {
    backgroundColor: theme === 'dark' ? Colors.dark.cardBackground : Colors.light.cardBackground,
    borderRadius: 12,
    padding: 16,
    marginVertical: 6,
    marginHorizontal: 4,
    flexDirection: "row" as const,
    justifyContent: "space-between" as const,
    alignItems: "center" as const,
    borderWidth: 1,
    borderColor: theme === 'dark' ? Colors.dark.cardBorder : Colors.light.cardBorder,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: theme === 'dark' ? 0.3 : 0.1,
        shadowRadius: 8,
      },
      android: {
        elevation: 3,
      },
    }),
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
          <ThemedView style={[cardStyle, style]}>
            {children}
          </ThemedView>
        </Animated.View>
      </PanGestureHandler>
    );
  }

  return (
    <ThemedView style={[cardStyle, style]}>
      {children}
    </ThemedView>
  );
}