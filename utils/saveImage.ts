import React, { useState } from 'react';
import * as FileSystem from 'expo-file-system';
import * as ImagePicker from 'expo-image-picker';


export const saveImage = async (uri:string) => {
        // Create a unique filename
        const filename = uri.split('/').pop()??"default.jpeg";
        const newPath = FileSystem.documentDirectory + filename;
    
        // Copy the file to a new location
        await FileSystem.moveAsync({
          from: uri,
          to: newPath,
        });
    
        return newPath; // Return the new URI
      };

export const pickAndSaveImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        quality: 1,
    });
    if (!result.canceled) {
        console.log(result.assets[0].uri);
        const path: string = await saveImage(result.assets[0].uri);
        return path
    }
    return "";
};