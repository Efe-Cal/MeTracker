export type IntakeEntry = {
    time: string;
    amount: number;
    theDayBefore?: boolean; // Indicates if the intake was recorded the day before
};
export type IntakeData={
    time: Date;
    amount: number;
} 

export type Tracker = {
    id: number;
    name: string;
};
export type Field = {
    id: number;
    trackerId: number;
    name: string;
    type: "text" | "number" | "boolean" | "select" | "substance";
};