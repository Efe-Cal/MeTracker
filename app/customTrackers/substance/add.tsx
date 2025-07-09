import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import SubstanceAddPage from '@/components/SubstanceAddPage';

export default function CustomSubstanceAdd() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const navigation = useNavigation();

  const capitalizeFirstLetter = (str: string) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  useEffect(() => {
    if (name) {
      navigation.setOptions?.({ title: capitalizeFirstLetter(name) + " Add Item"});
    }
  }, [name, navigation]);

  return <SubstanceAddPage substanceName={name} />;
}
