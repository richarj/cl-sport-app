import { StyleSheet, Text, View, StatusBar, SafeAreaView, FlatList } from 'react-native';
import { useState, useEffect } from 'react';
import { WebView } from 'react-native-webview';
import Header from '../../Components/Header';

async function services() {
  let result = await fetch('https://chilehacedeporte.cl/wp-content/uploads/appa/videos.json');
  const {videos} = await result.json();
  return videos;
}


export default function VideosScreen() {

  const [videos, setVideos] = useState([])

  useEffect(() => {
    services().then(data => setVideos(data)).catch(error => setVideos([]))
  }, [])
  
  const rederItems = ({ item }) => (
    <View style={styles.container}>
      <Text style={styles.title}>
          {item.title}
      </Text>
      <WebView style={styles.image} source={{uri: item.urlToVideo}} javaScriptEnabled={true} />
    </View>
  )


  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white', flex:1}}>
      <Header title={'Videos'}></Header>

      <FlatList data={videos} initialNumToRender={7} maxToRenderPerBatch={7} 
        keyExtractor={(item) => item.id} renderItem={rederItems}/>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:{
    flex:1,
    marginHorizontal: 17,
  },
  image: {
    height: 'auto',
    width: '100%',
    aspectRatio: 16/9,
    marginTop:5,
    marginBottom: 15,
  },
  title: {
    marginTop: 15,
    fontSize: 17,
    color: "#434343",
  },

});