import { useState, useCallback } from 'react';
import * as SQLite from 'expo-sqlite';
import { useFocusEffect } from 'expo-router';
import type { IntakeEntry } from '@/types';
import { getIntakesTableName } from '@/utils/sanitizeForSQL';


export function useIntakes(substance_name: string) {
    const [ intakes, setIntakes ] = useState([] as IntakeEntry[]);
    useFocusEffect(    
        useCallback(() => {
            const fetchIntakes = async () => {
                const meTrackerDB = await SQLite.openDatabaseAsync("MeTracker.db", { useNewConnection: true });
                const tableName = getIntakesTableName(substance_name);
                await meTrackerDB.runAsync(`
                    CREATE TABLE IF NOT EXISTS ${tableName} (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT NOT NULL,
                        time DATETIME DEFAULT CURRENT_TIMESTAMP,
                        amount REAL NOT NULL
                    );
                `);
                const result = await meTrackerDB.getAllAsync(`SELECT * FROM ${tableName}`);
                setIntakes(result as IntakeEntry[]);
                await meTrackerDB.closeAsync();
            }
            fetchIntakes();
        }, [substance_name])
    );
    return intakes;
}