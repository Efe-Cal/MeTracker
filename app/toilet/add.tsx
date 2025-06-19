import { View, Text, TouchableOpacity, Image, TextInput, ToastAndroid, StyleSheet } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useState } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite';
import { router } from 'expo-router'
import * as FileSystem from 'expo-file-system';

export default function Add(){
    const [isUrination, setUrination] = useState(true);
    const [showUrinationColors, setShowUrinationColors] = useState(false);
    const [urinationColor, setUrinationColor] = useState('#EBE9EA');
    const [isPainUrination, setPainUrination] = useState(false);
    const [isBM, setBM] = useState(false);
    const [showBMColors, setShowBMColors] = useState(false);
    const [BMColor, setBMColor] = useState('#8B4513');
    const [isPainBM, setPainBM] = useState(false);
    const [BMshape, setBMShape] = useState(2);
    const [showBMShapes, setShowBMShapes] = useState(false);
    const [isSmell, setSmell] = useState(false);
    const [photo, setPhoto] = useState("");
    const [note, setNote] = useState("");

    const saveImage = async (uri:string) => {
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

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });
        if (!result.canceled) {
            console.log(result.assets[0].uri);
            const path:string = await saveImage(result.assets[0].uri);
            setPhoto(path);
        }
    };
    const BMShapes = ['Type I: Separate hard lumps', 'Type II: Lumpy sausage', 'Type III: Sausage-shaped', 'Type IV: Smooth and soft', 'Type V: Soft blobs with clear cut edges', 'Type VI: Mushy consistency with ragged edges', 'Type VII: Watery'];

    const save = async () => {
        setNote("");
        let values = [];
        const db = await SQLite.openDatabaseAsync('MeTracker');
        await db.execAsync("CREATE TABLE IF NOT EXISTS toilet (time DATETIME PRIMARY KEY DEFAULT CURRENT_TIMESTAMP, urination BOOLEAN, urinationColor TEXT, isPainUrination BOOLEAN, isBM BOOLEAN, BMColor TEXT, BMshape INTEGER, isPainBM BOOLEAN, isSmell BOOLEAN, photo TEXT, notes TEXT);");
        if(isUrination){
            values.push(true);
            values.push(urinationColor);
            values.push(isPainUrination);
        }else{
            values.push(false);
            values.push(null);
            values.push(null);
        }
        if (isBM) {
            values.push(true);
            values.push(BMColor);
            values.push(BMshape);
            values.push(isPainBM);
            values.push(isSmell);
        }else {
            values.push(false);
            values.push(null);
            values.push(null);
            values.push(null);
            values.push(null);
        }
        values.push(photo);
        values.push(note);
        const result = await db.runAsync("INSERT INTO toilet (urination, urinationColor, isPainUrination, isBM, BMColor, BMshape, isPainBM, isSmell, photo, notes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);", values);
        console.log(result);
        db.closeSync();
        router.replace('/toilet/logs');
        ToastAndroid.show("Saved", ToastAndroid.SHORT);

    }
    //TODO: Add ScrollView
    return (
        <View style={styles.container}>
            <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Urination</Text>
                <Checkbox value={isUrination} onValueChange={setUrination} color={isUrination ? '#4630EB' : undefined} />
            </View>
            <View style={styles.divider}/>
            <View style={[styles.sectionBody, {opacity:isUrination?1:0.5, pointerEvents:isUrination?"auto":"none"}]}>
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Color</Text>
                    <TouchableOpacity onPress={()=>{setShowUrinationColors((prev)=>!prev)}} style={[styles.colorBox, {backgroundColor:urinationColor}]}/>
                </View>
                {showUrinationColors?
                <View style={styles.colorRow}>
                    {["#EBE9EA", "#F3C891", "#BE9B5D", "#C67548", "#805A45", "#e67e6b"].map((color) => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => { setUrinationColor(color);setShowUrinationColors(false) }}
                            style={[styles.colorBox, {backgroundColor: color, margin: 10}]}
                        />
                    ))}
                </View>:null}

                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Painful</Text>
                    <Checkbox value={isPainUrination} onValueChange={setPainUrination} color={isPainUrination ? '#4630EB' : undefined} />
                </View>
            </View>

            <View style={[styles.sectionHeader, {paddingTop:30}]}>
                <Text style={styles.sectionTitle}>Bowel Movment</Text>
                <Checkbox value={isBM} onValueChange={setBM} color={isBM ? '#4630EB' : undefined} />
            </View>
            <View style={styles.divider}/>
            <View style={[styles.sectionBody, {opacity:isBM?1:0.5, pointerEvents:isBM?"auto":"none"}]}>
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Color</Text>
                    <TouchableOpacity onPress={()=>{setShowBMColors((prev)=>!prev)}} style={[styles.colorBox, {backgroundColor:BMColor}]}/>
                </View>
                {showBMColors?
                <View style={styles.colorRow}>
                    {['#8B4513', '#5C4033', '#4B8C2C', '#D2B48C', '#000000', '#E03C31'].map((color) => (
                        <TouchableOpacity
                            key={color}
                            onPress={() => { setBMColor(color);setShowBMColors(false) }}
                            style={[styles.colorBox, {backgroundColor: color, margin: 10}]}
                        />
                    ))}
                </View>:null}
                
                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Shape</Text>
                    <TouchableOpacity onPress={()=>{setShowBMShapes((prev)=>!prev)}} style={styles.shapeBox}><Text>{BMShapes[BMshape]}</Text></TouchableOpacity>
                </View>
                {showBMShapes?
                <View>
                    {BMShapes.map((shape,index) => (
                        <TouchableOpacity
                            key={shape}
                            onPress={() => { setBMShape(index);setShowBMShapes(false) }}
                            style={styles.shapeOption}
                        >
                            <Text>{shape}</Text>
                        </TouchableOpacity>
                    ))}
                </View>:null}

                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Painful</Text>
                    <Checkbox value={isPainBM} onValueChange={setPainBM} color={isPainBM ? '#4630EB' : undefined} />
                </View>

                <View style={styles.rowBetween}>
                    <Text style={styles.label}>Foul-smell</Text>
                    <Checkbox value={isSmell} onValueChange={setSmell} color={isSmell ? '#4630EB' : undefined} />
                </View>
            </View>
            
            <TouchableOpacity 
                onPress={()=>{pickImage();}}
                style={[styles.photoButton, photo=="" && styles.photoButtonEmpty]}>
                {photo?
                    <View>
                        <Image source={{uri:photo}} width={200} height={200} />
                    </View>
                    :
                    <View style={styles.photoButtonContent}>
                        <MaterialIcons name="add-photo-alternate" size={24} color="black" />
                        <Text style={styles.photoButtonText}>Add Photo</Text>
                    </View>}
            </TouchableOpacity>

            <TextInput
                style={styles.noteInput}
                placeholder="Note"
                editable
                value={note}
                onChangeText={text => setNote(text)}
                multiline={true}
                numberOfLines={3}
            />
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity onPress={save} style={styles.saveButton}>
                    <Text style={styles.saveButtonText}>Save</Text>
                </TouchableOpacity>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: "flex-start",
        flexDirection: 'column'
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: 'bold'
    },
    divider: {
        borderBottomColor: 'black',
        borderBottomWidth: 1
    },
    sectionBody: {
        paddingHorizontal: 10,
        paddingTop: 3
    },
    rowBetween: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 10
    },
    label: {
        fontSize: 20,
        paddingRight: 10
    },
    colorBox: {
        width: 30,
        height: 30,
        borderWidth: 1
    },
    colorRow: {
        flexDirection: "row"
    },
    shapeBox: {
        maxWidth: 200
    },
    shapeOption: {
        margin: 10,
        borderWidth: 1
    },
    photoButton: {
        padding: 10,
        marginTop: 20,
        borderRadius: 10
    },
    photoButtonEmpty: {
        backgroundColor: "#e0dcf9"
    },
    photoButtonContent: {
        flexDirection: "row",
        alignItems: "center"
    },
    photoButtonText: {
        paddingLeft: 10,
        fontSize: 20
    },
    noteInput: {
        borderWidth: 1,
        marginTop: 20,
        padding: 10,
        borderRadius: 10,
        textAlignVertical: "top"
    },
    saveButtonContainer: {
        flex: 1,
        alignItems: "center"
    },
    saveButton: {
        backgroundColor: "#4630EB",
        padding: 10,
        marginTop: 20,
        borderRadius: 10,
        position: "absolute",
        bottom: 0,
        width: "100%"
    },
    saveButtonText: {
        color: "white",
        textAlign: "center",
        fontSize: 20
    }
});