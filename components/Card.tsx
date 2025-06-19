import { View, ViewStyle } from 'react-native';

interface CardProps {
  children: React.ReactNode;
  style?: ViewStyle;
}

export function Card({ children,style }: CardProps) {
  return (
    <View style={[{
      backgroundColor: 'white',
      borderRadius: 10,
      padding: 10,
      shadowColor: 'black',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 10,
      elevation: 5,
      flexDirection:"row",
      justifyContent:"space-between",
      alignItems:"center",
      margin:5,
      display:"flex"
      
  },style]}>
      {children}
    </View>
  );
}