import { View, Text, ScrollView, Modal, TouchableOpacity, TextInput, Alert } from 'react-native';
import { CartesianChart, useAnimatedPath, useChartPressState, useLinePath, type PointsArray } from "victory-native";
import { Canvas, Circle, Path, Text as SKText, useFont } from "@shopify/react-native-skia";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import type { IntakeEntry, IntakeData } from "@/types";
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';
import Ionicons from '@expo/vector-icons/Ionicons';
import AsyncStorage from '@react-native-async-storage/async-storage';

type SDProps = {
    intakes: IntakeEntry[];
    halflife?: number;
    theme?: "light" | "dark";
    substanceName: string; // <-- Add this prop
};

const interval = 0.25;
function timeToNumber(time: string): number {
    let date = new Date(time.replace(" ", "T")+"Z");
    return date.getHours()+Math.floor(date.getMinutes()/15)*interval;
}
function numberToTime(time: number): string {
    let hours: number|string = Math.floor(time);
    let minutes: number|string = Math.floor((time - hours) * 60);
    do {
        if (hours>23){ hours-=24;}
    }while (hours > 23);
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    return hours + ":" + minutes;
}

function calculateSubstanceAmount(intakes: IntakeEntry[], halflife:number, currentAmountSetter:React.Dispatch<React.SetStateAction<number>>): IntakeEntry[] {
    let result:IntakeEntry[] = [];
    let data:IntakeData[] = intakes.map((intake) => {
        return {
            time: timeToNumber(intake.time) + (intake.theDayBefore ? 24 : 0), // Convert time to number and add 24 if the intake was recorded the day before
            amount: intake.amount
        };
    });
    Array.from({length: 96/interval+1}, (_, i) => {
        let time = i * interval;
        let amount = 0;
        data.forEach((intake) => {
            if (time >= intake.time){
                amount += intake.amount * Math.pow(0.5, (time - intake.time) / halflife);
                amount = Math.floor(amount);
                if (amount < 1) amount = 0;
            }
        });
        const now = new Date();
        const currentTime = now.getHours()+Math.floor(now.getMinutes()/15)*interval +  (intakes[intakes.length-1] && intakes[intakes.length-1].theDayBefore ? 24 : 0);
        if (currentTime - time < interval && currentTime - time >= 0) {
            console.log("Time: ", numberToTime(time), "Amount: ", amount);
            currentAmountSetter(amount);
        }
        result.push({time: numberToTime(time), amount: amount});
    });
    return result;
}

function ToolTip({ x, y, yVal, theme }: { x: SharedValue<number>; y: SharedValue<number>; yVal: Readonly<SharedValue<string>>; theme: "light" | "dark" }) {
    // Extract values from shared values
    const xVal = x.value;
    const yValNum = y.value;
    const font = useFont(require("@/assets/fonts/calibri.ttf"), 20);
    return (
        <>
            <Circle cx={x} cy={y} r={6} color={theme === "dark" ? "#fff" : "black"}/>
            <SKText x={xVal + 10} y={yValNum - 10} text={yVal} font={font} color={theme === "dark" ? "#fff" : "black"}/>
        </>
    );
}

function MyCustomLine({ points, theme }: { points: PointsArray, theme: "light" | "dark" }) {
    const { path } = useLinePath(points, { curveType: "monotoneX" });
    const animPath = useAnimatedPath(path);
    return <Path path={animPath} style="stroke" strokeWidth={3} color={theme === "dark" ? "#fff" : "black"}/>;
}
type ModalInputProps = {
  onSubmit: () => void;
  visible: boolean;
  value: string;
  onCancel: () => void;
  placeholder?: string;
};

const ModalInput = ({ onSubmit, visible, value, onCancel, placeholder, onChangeText }: ModalInputProps & { onChangeText: (text: string) => void }) => {
  // Use ThemeContext for theming
  const { theme } = useContext(ThemeContext);
  const isDark = theme === "dark";
  return (
    <Modal visible={visible} transparent={true} animationType="fade">
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: isDark ? 'rgba(0,0,0,0.85)' : 'rgba(0,0,0,0.6)',
        }}>
        
        <View
          style={{
            height: 160,
            padding: 20,
            width: '70%',
            alignSelf: 'center',
            justifyContent: 'center',
            backgroundColor: isDark ? '#232323' : 'white',
            borderRadius: 16,
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 4,
            elevation: 5,
          }}>
          <Text style={{ color: isDark ? '#fff' : '#000', fontSize: 18, marginBottom: 10 }}>Set substance half-life</Text>
        
          <TextInput
            value={value}
            onChangeText={onChangeText}
            placeholder={placeholder ?? 'Enter text'}
            placeholderTextColor={isDark ? "#aaa" : "#888"}
            style={{
              borderWidth: 1,
              borderColor: isDark ? "#444" : "#ccc",
              borderRadius: 8,
              padding: 8,
              marginBottom: 16,
              backgroundColor: isDark ? "#181818" : "#f9f9f9",
              color: isDark ? "#fff" : "#000",
            }}
          />
          <View style={{ flexDirection: 'row', alignSelf: 'center', gap: 12 }}>
            <TouchableOpacity
              onPress={onCancel}
              style={{
                backgroundColor: isDark ? "#333" : "#eee",
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 8,
                marginRight: 8,
              }}
            >
              <Text style={{ color: isDark ? "#bbb" : "#222", fontWeight: "bold" }}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onSubmit}
              style={{
                backgroundColor: isDark ? "#444" : "#007AFF",
                paddingVertical: 8,
                paddingHorizontal: 20,
                borderRadius: 8,
              }}
            >
              <Text style={{ color: isDark ? "#fff" : "#fff", fontWeight: "bold" }}>OK</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default function SubstanceDecayGraph({intakes, halflife: halflifeProp, theme: themeProp, substanceName}:SDProps) {
    const context = useContext(ThemeContext);
    const theme = themeProp || context.theme || "light";
    const [substanceData, setSubstanceData] = useState<any[]>([{time: "0", amount: 0}]); 
    const [currentAmount, setCurrentAmount] = useState(0);
    const [ isModalVisible, setIsModalVisible ] = useState(false);
    const [halflife, setHalflife] = useState(halflifeProp);
    const [halflifeInput, setHalflifeInput] = useState(halflifeProp?.toString());

    // Load halflife from AsyncStorage on mount or when substanceName changes
    useEffect(() => {
        const loadHalflife = async () => {
            try {
                const stored = await AsyncStorage.getItem(`halflife_${substanceName}`);
                if (stored !== null) {
                    setHalflife(Number(stored));
                    setHalflifeInput(stored);
                } else {
                    setHalflife(halflifeProp);
                    setHalflifeInput(halflifeProp?.toString());
                }
            } catch (e) {
                setHalflife(halflifeProp);
                setHalflifeInput(halflifeProp?.toString());
            }
        };
        loadHalflife();
    }, [substanceName, halflifeProp]);

    // Save halflife to AsyncStorage when changed
    const saveHalflife = async (value: number) => {
        try {
            await AsyncStorage.setItem(`halflife_${substanceName}`, value.toString());
        } catch (e) {
            // handle error if needed
        }
    };

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const filteredIntakes = intakes
                    .sort((a, b) => {
                        const dateA = new Date(a.time.replace("T", " ") + "Z");
                        const dateB = new Date(b.time.replace("T", " ") + "Z");
                        return dateA.getTime() - dateB.getTime();
                    })
                    .reverse()
                    .filter(intake => {
                        // only intakes within the last 48 hours
                        const intakeDate = new Date(intake.time.replace("T", " ") + "Z");
                        const now = new Date();
                        const diff = now.getTime() - intakeDate.getTime();
                        return diff <= 48 * 60 * 60 * 1000; // 48 hours in milliseconds
                    })
                    .map(intake => {
                        const intakeDate = new Date(intake.time.replace("T", " ") + "Z");
                        const now = new Date();
                        if (intakeDate.getDate() < now.getDate()) {
                            intake.theDayBefore = true; // Mark as the day before if the date is earlier than today
                        }
                        return {
                            time: intake.time,
                            amount: intake.amount,
                            theDayBefore: intake.theDayBefore || false // Ensure the property exists
                        };
                    });
                if (halflife===undefined || halflife === null) {
                    Alert.alert("Halflife not set", "Please set the halflife for the substance in the settings", 
                        [{ text: "OK", onPress: () => setIsModalVisible(true) }
                    ]);
                }
                else{
                    const result = calculateSubstanceAmount(filteredIntakes, halflife, setCurrentAmount);
                    if (isMounted) {
                        setSubstanceData(result);
                    }
                }    
                
            } catch (error) {
                console.error('Error calculating substance amount:', error);
            }
        };
        fetchData();
        return () => {
            isMounted = false;
        };
    }, [intakes, halflife]);
    const { state, isActive } = useChartPressState({ x: "0", y: { amount: 0 } });
    const value = useDerivedValue(() => {
        let val = state.y.amount.value.value.toString() + " mg @ " + state.x.value.value;
        return val;
    }, [state.y.amount.value.value, state.x.value.value]);
    var days = 3
    return (
        <View style={{
            justifyContent: "flex-start",
            flexDirection: 'column',
            position: 'relative',
        }}>
            <ModalInput
                visible={isModalVisible}
                onCancel={() => setIsModalVisible(!isModalVisible)}
                onSubmit={() => {
                    if (!halflifeInput || halflifeInput.trim() === "") {
                        Alert.alert("Invalid input", "Please enter a valid halflife value.");
                        return;
                    }
                    const parsed = parseFloat(halflifeInput);
                    if (!isNaN(parsed) && parsed > 0) {
                        setHalflife(parsed);
                        saveHalflife(parsed);
                    }
                    setIsModalVisible(false);
                }}
                value={halflifeInput??""}
                onChangeText={setHalflifeInput}
                placeholder='Enter halflife in hours'
            />
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
            }}>
                <Text style={{fontSize: 20, color: theme === "dark" ? "#fff" : "black"}}>Current amount: ~{currentAmount} mg</Text>
                <TouchableOpacity onPress={() => setIsModalVisible(true)} style={{padding: 10}}>
                    <Ionicons name="settings-sharp" size={20} color={theme==="dark"?"white":"black"} />
                </TouchableOpacity>
            </View>
            <Canvas style={{ width: 400, height: 50 }}>
                <SKText text={value} font={useFont(require("@/assets/fonts/calibri.ttf"),20)} x={10} y={20} color={theme === "dark" ? "#fff" : "black"} />
            </Canvas>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentOffset={{x:intakes[intakes.length-1]?(2000*(timeToNumber(intakes[intakes.length-1].time)+(intakes[intakes.length-1].theDayBefore?24:0))/(days*24))-50:0,y:0}}>
                <View style={{height: 250, width: 2000}}>
                    <CartesianChart data={substanceData} xKey="time" yKeys={["amount"]} 
                        axisOptions={{
                            font: useFont(require("@/assets/fonts/calibri.ttf"),12),
                            tickCount:{x:48/2,y:5},
                            formatXLabel: (value) => {
                                return value.toString()},
                            lineColor: theme === "dark" ? "#fff" : "black",
                            labelColor: theme === "dark" ? "#fff" : "black",
                        }}
                        domain={{y: [0, 350],x:[0,days*24/interval]}}
                        chartPressState={state}
                    >
                        {({ points }) => (
                            <>
                                <MyCustomLine points={points.amount} theme={theme} />
                                {isActive ? (
                                    <ToolTip x={state.x.position} y={state.y.amount.position} yVal={value} theme={theme} />
                                ) : null}
                            </>
                        )}
                    </CartesianChart>
                </View>
            </ScrollView>
        </View>
    );
}


