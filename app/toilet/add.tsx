import { View, TouchableOpacity, Image, TextInput, ToastAndroid, StyleSheet, ScrollView } from 'react-native';
import Checkbox from 'expo-checkbox';
import { useState, useContext } from 'react';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import * as ImagePicker from 'expo-image-picker';
import * as SQLite from 'expo-sqlite';
import { router } from 'expo-router'
import * as FileSystem from 'expo-file-system';
import { ThemeContext } from '@/theme/ThemeContext';
import { ThemedText } from '@/components/ThemedText';

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

    const { theme } = useContext(ThemeContext);

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
        const db = await SQLite.openDatabaseAsync('MeTracker.db', { useNewConnection: true });
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
    return (
        <View style={[styles.container, { backgroundColor: theme === "dark" ? "#18181b" : "#fff" }]}>
            <View style={styles.sectionHeader}>
                <ThemedText style={[styles.sectionTitle, { color: theme === "dark" ? "#fff" : "#222" }]}>Urination</ThemedText>
                <Checkbox value={isUrination} onValueChange={setUrination} color={isUrination ? '#4630EB' : undefined} />
            </View>
            <View style={styles.divider}/>
            <View style={[styles.sectionBody, {opacity:isUrination?1:0.5, pointerEvents:isUrination?"auto":"none"}]}>
                <View style={styles.rowBetween}>
                    <ThemedText style={[styles.label, { color: theme === "dark" ? "#fff" : "#222" }]}>Color</ThemedText>
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
                    <ThemedText style={[styles.label, { color: theme === "dark" ? "#fff" : "#222" }]}>Painful</ThemedText>
                    <Checkbox value={isPainUrination} onValueChange={setPainUrination} color={isPainUrination ? '#4630EB' : undefined} />
                </View>
            </View>

            <View style={[styles.sectionHeader, {paddingTop:30}]}>
                <ThemedText style={[styles.sectionTitle, { color: theme === "dark" ? "#fff" : "#222" }]}>Bowel Movement</ThemedText>
                <Checkbox value={isBM} onValueChange={setBM} color={isBM ? '#4630EB' : undefined} />
            </View>
            <View style={styles.divider}/>
            <View style={[styles.sectionBody, {opacity:isBM?1:0.5, pointerEvents:isBM?"auto":"none"}]}>
                <View style={styles.rowBetween}>
                    <ThemedText style={[styles.label, { color: theme === "dark" ? "#fff" : "#222" }]}>Color</ThemedText>
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
                    <ThemedText style={[styles.label, { color: theme === "dark" ? "#fff" : "#222" }]}>Shape</ThemedText>
                    <TouchableOpacity onPress={()=>{setShowBMShapes((prev)=>!prev)}} style={styles.shapeBox}><ThemedText>{BMShapes[BMshape]}</ThemedText></TouchableOpacity>
                </View>
                {showBMShapes?
                <View>
                    {BMShapes.map((shape,index) => (
                        <TouchableOpacity
                            key={shape}
                            onPress={() => { setBMShape(index);setShowBMShapes(false) }}
                            style={styles.shapeOption}
                        >
                            <ThemedText>{shape}</ThemedText>
                        </TouchableOpacity>
                    ))}
                </View>:null}

                <View style={styles.rowBetween}>
                    <ThemedText style={[styles.label, { color: theme === "dark" ? "#fff" : "#222" }]}>Painful</ThemedText>
                    <Checkbox value={isPainBM} onValueChange={setPainBM} color={isPainBM ? '#4630EB' : undefined} />
                </View>

                <View style={styles.rowBetween}>
                    <ThemedText style={[styles.label, { color: theme === "dark" ? "#fff" : "#222" }]}>Foul-smell</ThemedText>
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
                        <MaterialIcons name="add-photo-alternate" size={24} color={theme === "dark" ? "#fff" : "black"} />
                        <ThemedText style={styles.photoButtonText}>Add Photo</ThemedText>
                    </View>}
            </TouchableOpacity>

            <TextInput
                style={[
                  styles.noteInput,
                  {
                    backgroundColor: theme === "dark" ? "#222" : "#fff",
                    color: theme === "dark" ? "#fff" : "#222",
                    borderColor: theme === "dark" ? "#444" : "#ccc"
                  }
                ]}
                placeholder="Note"
                placeholderTextColor={theme === "dark" ? "#888" : "#aaa"}
                editable
                value={note}
                onChangeText={text => setNote(text)}
                multiline={true}
                numberOfLines={3}
            />
            <View style={styles.saveButtonContainer}>
                <TouchableOpacity onPress={save} style={styles.saveButton}>
                    <ThemedText style={styles.saveButtonText}>Save</ThemedText>
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