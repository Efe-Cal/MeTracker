import React from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useLocalSearchParams } from 'expo-router';

const ImageViewer = () => {
    const { uri } = useLocalSearchParams<{ uri?: string }>();

    return (
        <View style={styles.container}>
            <Image
                source={{ uri: uri }}
                style={styles.image}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    image: {
        width: '100%',
        height: '100%',
    },
});

export default ImageViewer;