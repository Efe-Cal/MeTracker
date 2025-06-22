import { View, Text, ScrollView } from 'react-native';
import { CartesianChart, useChartPressState, useLinePath, type PointsArray } from "victory-native";
import { Canvas, Circle, Path, Text as SKText, useFont } from "@shopify/react-native-skia";
import { useDerivedValue, type SharedValue } from "react-native-reanimated";
import type { IntakeEntry, IntakeData } from "@/types";
import { useContext, useEffect, useState } from 'react';
import { ThemeContext } from '@/theme/ThemeContext';

type SDProps = {
    intakes: IntakeEntry[];
    halflife: number;
    theme?: "light" | "dark";
};

const interval = 0.25
function timeToNumber(time: string): number {
    let date = new Date(time.replace(" ", "T")+"Z");
    return date.getHours()+Math.floor(date.getMinutes()/15)*interval;
}
function numberToTime(time: number): string {
    let hours: number|string = Math.floor(time);
    let minutes: number|string = Math.floor((time - hours) * 60);
    if (hours>23) hours-=24;
    if (hours < 10) hours = "0" + hours;
    if (minutes < 10) minutes = "0" + minutes;
    return hours + ":" + minutes;
}

function calculateSubstanceAmount(intakes: IntakeEntry[],halflife:number, currentAmountSetter:React.Dispatch<React.SetStateAction<number>>): IntakeEntry[] {
    let result:IntakeEntry[] = [];
    let data:IntakeData[] = intakes.map((intake) => {
        return {
            time: timeToNumber(intake.time),
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
        const currentTime = now.getHours()+Math.floor(now.getMinutes()/15)*interval;
        if (currentTime - time < interval && currentTime - time >= 0) {
            console.log("Time: ", numberToTime(time), "Amount: ", amount);
            currentAmountSetter(amount);
        }
        result.push({time: numberToTime(time), amount: amount});
    });
    return result;
}

function ToolTip({ x, y, yVal, theme }: { x: SharedValue<number>; y: SharedValue<number>; yVal: Readonly<SharedValue<string>>; theme: "light" | "dark" }) {
    return (
    <>
        <Circle cx={x} cy={y} r={4} color={theme === "dark" ? "#fff" : "black"}/>
        <SKText x={x} y={x} text={yVal} font={useFont(require("@/assets/fonts/calibri.ttf"),20)} color={theme === "dark" ? "#fff" : "black"}/>
    </>
    );
}

function MyCustomLine({ points, theme }: { points: PointsArray, theme: "light" | "dark" }) {
    const { path } = useLinePath(points, { curveType: "monotoneX" });
    return <Path path={path} style="stroke" strokeWidth={3} color={theme === "dark" ? "#fff" : "black"}/>;
}

export default function SubstanceDecayGraph({intakes, halflife, theme: themeProp}:SDProps) {
    const context = useContext(ThemeContext);
    const theme = themeProp || context.theme || "light";
    const [DATA, setData] = useState<any[]>([{time: "0", amount: 0}]); 
    const [currentAmount, setCurrentAmount] = useState(0);
    useEffect(() => {
        let isMounted = true;

        const fetchData = async () => {
            try {
                const result = calculateSubstanceAmount(intakes, halflife, setCurrentAmount);
                if (isMounted) {
                    setData(result);
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
    
    // const DATA = useMemo(() => calculateSubstanceAmount(intakes, halflife), [intakes, halflife]);
    // const DATA = calculateSubstanceAmount(intakes, halflife);
    const { state, isActive } = useChartPressState({ x: "0", y: { amount: 0 } });

    const value = useDerivedValue(() => {
        let val = state.y.amount.value.value.toString() + " mg @ "+state.x.value.value;
        return val;
    },[state.y.amount.value.value]);

    return (
        <View style={{
            justifyContent: "flex-start",
            flexDirection: 'column',
        }}>
            <Text style={{fontSize: 20, color: theme === "dark" ? "#fff" : "black"}}>Current amount: ~{currentAmount} mg</Text>
            <Canvas style={{ width: 400, height: 50 }}>
                <SKText text={value} font={useFont(require("@/assets/fonts/calibri.ttf"),20)} x={10} y={20} color={theme === "dark" ? "#fff" : "black"} />
            </Canvas>
            <ScrollView horizontal={true} showsHorizontalScrollIndicator={false} contentOffset={{x:intakes[0]?(2000*timeToNumber(intakes[0].time)/48)-50:0,y:0}}>
                <View style={{height: 250, width: 2000}}>
                <CartesianChart data={DATA} xKey="time" yKeys={["amount"]} 
                    axisOptions={{
                        font: useFont(require("@/assets/fonts/calibri.ttf"),12),
                        tickCount:{x:48,y:5},
                        formatXLabel: (value) => value.toString(),
                        lineColor: theme === "dark" ? "#fff" : "black",
                        labelColor: theme === "dark" ? "#fff" : "black",
                    }}
                    domain={{y: [0, 350],x:[0,48/interval]}}
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


