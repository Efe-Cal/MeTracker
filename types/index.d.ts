export type IntakeEntry = {
    time: string;
    amount: number;
};
export type IntakeData={
    time: number;
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