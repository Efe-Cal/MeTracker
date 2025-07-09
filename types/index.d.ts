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
    isSubstanceTracker?: boolean;
    substanceData?: JSON;
};

export type FieldType = "text" | "number" | "boolean" | "select" | "image";

export type Field = {
    id: number;
    trackerId: number;
    name: string;
    type: FieldType;
    options?: string[]; // For select fields, options can be provided
};

type SubstanceItem = {
    name: string,
    amount: number,
}
