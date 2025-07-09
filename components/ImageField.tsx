import React, { useContext, useState } from 'react';
import { TouchableOpacity, View, Image, StyleSheet } from 'react-native';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { pickAndSaveImage } from '@/utils/saveImage';
import { ThemedText } from '@/components/ThemedText';
import { ThemeContext } from '@/theme/ThemeContext';
import { ThemedView } from './ThemedView';

export function ImageField({ label ,onChange }: { label:string ,onChange: (value: string) => void }) {
    const [photo, setPhoto] = useState<string>("");
    const { theme } = useContext(ThemeContext);
    return (
        <ThemedView>
            <ThemedText style={{ fontSize: 20, color: theme === "dark" ? "#fff" : "#000" }}>
                {label || "Image Field"}
            </ThemedText>
            <TouchableOpacity 
                onPress={ async ()=>{
                    const imgPath = await pickAndSaveImage();
                    setPhoto(imgPath);
                    onChange(imgPath);
                }}
                style={[styles.photoButton, photo=="" && styles.photoButtonEmpty]}>
                {photo?
                    <View>
                        <Image source={{uri:photo}} width={200} height={200} />
                    </View>
                    :
                    <View style={styles.photoButtonContent}>
                        <MaterialIcons name="add-photo-alternate" size={24} color={theme === "dark" ? "#fff" : "black"} />
                        <ThemedText style={styles.photoButtonText}>Add Photo</ThemedText>
                    </View>}
            </TouchableOpacity>
        </ThemedView>
    );
}
const styles = StyleSheet.create({
    photoButton: {
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
    },
    photoButtonEmpty: {
        backgroundColor: "#463CEB",
    },
    photoButtonContent: {
        flexDirection: "row",
        alignItems: "center"
    },  
    photoButtonText: {
        paddingLeft: 10,
        fontSize: 20
    },
});