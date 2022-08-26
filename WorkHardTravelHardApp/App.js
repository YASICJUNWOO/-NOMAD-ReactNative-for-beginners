import { StatusBar } from 'expo-status-bar';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, TextInput, ScrollView} from 'react-native';
import { theme } from './color';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = "@TODOS";

export default function App() {
  const [working, setWorking] = useState(true);
  const [text, setText] = useState("");
  const [toDos, setToDos] =useState({});
  useEffect(()=>{loadToDos()},[]);
  const travel = () => setWorking(false);
  const work = () => setWorking(true);
  const onChangeText = (payload) => setText(payload);
  const saveToDos = async (toSave) => {
    
   await AsyncStorage.setItem("@TODOS", JSON.stringify(toSave));
   
  }
  const loadToDos = async () => {
    const s = await AsyncStorage.getItem(STORAGE_KEY)
    setToDos(JSON.parse(s));
  }

 

  const addToDo = async () => {
    if(text ===""){
      return ;
    }
    const newToDos = {...toDos,[Date.now()]:{text, work:working}};
    setToDos(newToDos);
    await saveToDos(newToDos);
    setText("");
  };
  console.log(toDos);
  return (
    <View style={styles.container}>
      <StatusBar style="auto" />
      <View style={styles.header}>

        <TouchableOpacity onPress={work}>
          <Text style={{...styles.btnText, color:working ? "white":theme.grey}}>Work</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={travel}>
        <Text style={{...styles.btnText, color:working ? theme.grey:"white"}}>Travel</Text>
        </TouchableOpacity>

      </View>

      <TextInput
        onChangeText = {onChangeText}
        onSubmitEditing ={addToDo}
        returnKeyType = "done"
        value = {text}
        placeholder={working ? "Add a ToDo":"What do you want to go?"}
        style={styles.input}/>
      
      <ScrollView > 
        
        {Object.keys(toDos).map(key=>(
          toDos[key].work === working ?
          <View key={key} style={styles.toDo}>
            <Text style={styles.toDoText}>{toDos[key].text}</Text>
          </View> : null))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingHorizontal:20,
  },
  header:{
    justifyContent : "space-between",
    flexDirection:"row",
    color:"white",
    marginTop:100,
  },
  btnText:{
    fontSize: 38,
    fontWeight:"600",
  },
  input:{
    backgroundColor:"white",
    paddingVertical:15,
    paddingHorizontal:20,
    borderRadius:30,
    marginVertical:15,
    fontSize:18,
  },
  toDo:{
    backgroundColor:theme.toDoBg,
    marginBottom:10,
    paddingVertical:20,
    paddingHorizontal:40,
    borderRadius : 15,
  },
  toDoText:{
    color:"white",
    fontSize: 16,
    fontWeight:"500",
  }
});
