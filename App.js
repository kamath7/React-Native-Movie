import React, { useState } from 'react';
import axios from 'axios';
import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableHighlight, Modal, Alert } from 'react-native';
import {API_URL} from 'react-native-dotenv';
export default function App() {

  const apiUrl = API_URL;
  const [state, setState] = useState({
    s: "",
    results: [],
    selected: {}
  });
  const search = () => {
    
    axios(`${apiUrl}&s=${encodeURI(state.s)}`)
      .then(({ data }) => {
        let results = data.Search;
        state.s='';
        setState(prevState => {
          return { ...prevState, results: results }
        })
      }).catch((err) => {
        
        console.log(err);
      })
  };
  const openPopup = (id) => {
    axios(`${apiUrl}&i=${id}`).then(({ data }) => {
      let result = data;
      console.log(result);
// Alert.alert("Error","Movie not found!",[{text:'Ok'}])
      setState(prevState => {
        return { ...prevState, selected: result }
      });
    });
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Movie DB</Text>
      <TextInput
        style={styles.searchBox}
        placeholder="Enter a movie"
        onChangeText={text => setState(
          prevState => {
            return { ...prevState, s: text }
          })}
        autoCorrect={false}
        onSubmitEditing={search}
        value={state.s}
      />
     <ScrollView styles={styles.results}>
        {
          state.results.map(result => (
            <TouchableHighlight key={result.imdbID} onPress={() => openPopup(result.imdbID)}>
              <View key={result.imdbID} style={styles.result}>
                <Image
                  source={{ uri: result.Poster }}
                  style={{
                    width: "100%",
                    height: 300
                  }}
                  resizeMode="cover"
                />
                <Text style={styles.heading}>{result.Title}</Text>
              </View>
            </TouchableHighlight>
          ))
        }
      </ScrollView> 
      <Modal
        animationType="fade"
        transparent={false}
        visible={(typeof state.selected.Title != "undefined") ? true : false}
      >
        <View style={styles.popup}>
          <Image source={{uri: state.selected.Poster}} style={{width: '100%', height: 300}} resizeMode="cover"/>
          <Text style={styles.poptitle}>{state.selected.Title}</Text>
          
          <Text style={styles.popRating}>IMDB Rating: {state.selected.imdbRating}</Text>
          <Text style={styles.popactors}>Actors: {state.selected.Actors}</Text>
          <Text style={styles.popupPlot}>Plot:{state.selected.Plot}</Text>
          
        </View>
        <TouchableHighlight
          onPress={()=> setState(prevState=>{
            return { ...prevState, selected: {}}
          })}
          >
          <Text style={styles.closeBtn}>Close</Text>
        </TouchableHighlight>
      </Modal>
    </View>
  );
}

// http://www.omdbapi.com/?t=Class+of+92&apikey=d5fa370

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#223343',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingTop: 70,
    paddingHorizontal: 20
  },
  title: {
    color: '#FFF',
    fontSize: 32,
    fontWeight: '700',
    textAlign: "center",
    marginBottom: 20
  },
  searchBox: {
    fontSize: 20,
    fontWeight: '300',
    padding: 20,
    width: '100%',
    backgroundColor: '#FFF',
    borderRadius: 8,
    marginBottom: 40
  },
  results: {
    flex: 1
  },
  result: {
    flex: 1,
    width: '100%',
    marginBottom: 20
  },
  heading: {
    color: '#FFF',
    fontSize: 17,
    fontWeight: '700',
    padding: 20,
    backgroundColor: '#445565'
  },
  popRating:{
    marginTop: 25,
    fontSize: 20,
    marginBottom: 20
  },
  poptitle:{
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 5
  },
  popup:{
    flex:1,
    padding: 20
  },
  closeBtn:{
    padding: 20,
    fontSize: 20,
    fontWeight: '700',
    backgroundColor: '#2484C4'
  },
  popupPlot:{
    fontSize: 17
  },
  popactors:{
    fontSize: 17
  }
});
