import { useLocalSearchParams } from 'expo-router';
import SubstanceAddPage from '@/components/SubstanceAddPage';

export default function CustomSubstanceAdd() {
  const { name } = useLocalSearchParams<{ name: string }>();
  console.log('CustomSubstanceAdd', name);
  return <SubstanceAddPage substanceName={name} />;
}
