import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect } from 'react';
import SubstanceAddPage from '@/components/SubstanceAddPage';

export default function CustomSubstanceAdd() {
  const { name } = useLocalSearchParams<{ name: string }>();
  const navigation = useNavigation();

  useEffect(() => {
    if (name) {
      navigation.setOptions?.({ title: name + " Add Item"});
    }
  }, [name, navigation]);

  return <SubstanceAddPage substanceName={name} />;
}
