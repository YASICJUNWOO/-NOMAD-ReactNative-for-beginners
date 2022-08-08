import { StatusBar } from 'expo-status-bar';
import * as Location from 'expo-location';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Text, View, StyleSheet, ScrollView, Dimensions } from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

export default function App() {
  const [city, setCity] = useState("Loading..");
  const [days, setDays] = useState([]);
  const [ok, setOk] =  useState();
  const getWeather = async ()=> {
    const {granted} = await Location.requestForegroundPermissionsAsync();
    const API_KEY = "503cb7dbae22ffc0a8d0aa5d6e6eb5d2";
    
    if(!granted){
      setOk(false);
    }
    const {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({accuracy:5});
    const location = await Location.reverseGeocodeAsync({latitude,longitude},{useGoogleMaps:false});
    setCity(location[0].city); 
    const reponse = await fetch(`https://api.openweathermap.org/data/2.5/onecall?lat=${latitude}&lon=${longitude}&exclude=alerts&appid=${API_KEY}&units=metric`)
    const json = await reponse.json();
    console.log(json.daily);
    setDays(json.daily);
  }
  useEffect(() => {
    getWeather();
  },[]);
  return (
    <View style={styles.container}>

      <View style={styles.city}>
        <Text style={styles.cityName}>{city}</Text> 
      </View>

      <ScrollView
      horizontal 
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.weather}>
      {days.length === 0 ? (
      <View style={styles.day}>< ActivityIndicator color="white"
      style={{marginTop:10}} size="large"/></View>) 
      : (
        days.map((day,index)=>
        <View key ={index} style={styles.day}>
        <Text style={styles.temp}>{parseFloat(day.temp.day).toFixed(1)}</Text>
        <Text style={styles.description}>{day.weather[0].main}</Text>
        <Text style={styles.tinyText}>{day.weather[0].description}</Text>
      </View>
      )
      )}   
      </ScrollView>

    </View>
    
  );
}

const styles = StyleSheet.create({
  container:{
    flex:1,
    backgroundColor : "tomato",
  },
  city:{
    flex:1,
    justifyContent:"center",
    alignItems:"center",
  },
  cityName:{
    fontSize:48,
    fontWeight:"500",
  },
  weather:{
  },
  day:{
    width: SCREEN_WIDTH,
    alignItems:"center",
  },
  temp:{
    marginTop: 50,
    fontSize: 178,
  },
  description:{
    marginTop: -30,
    fontSize: 60,
  },
  tinyText:{
    fontSize:20,
  },

})
