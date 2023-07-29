import { Text, View, StyleSheet, SafeAreaView, StatusBar, Image, FlatList, TouchableOpacity} from 'react-native';
import { useState, useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

import Header from '../../Components/Header';



async function services() {
  let result = await fetch('https://chilehacedeporte.cl/wp-content/uploads/appa/eventos.json');
  const {articles} = await result.json();
  result = null;
  return articles;
}


export default function NewsListScreen() {
  const { navigate } = useNavigation();
  const [newsData, setNewsData] = useState([])
  
  useEffect(() => {
    services().then(data => setNewsData(data)).catch(error => setNewsData([]))
  }, [])

  const onPressHandler = item => navigate('Eventos', {news: item})

  const rederItems = ({ item }) => (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => onPressHandler(item)} style={{flex:1, flexDirection: 'row',}}>
        <Image style={styles.image} source={{uri: item.urlToImage}}/>
        <View style={{flex:1}}>
          <Text style={styles.title}>
              {item.title}
          </Text>
        </View>
      </TouchableOpacity>
      <Text style={styles.date}>
        {item.publishedAt}
      </Text>
    </View>
  )

  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white', flex:1}}>
      <Header title={'Eventos'}></Header>
        <FlatList
          data={newsData}
          initialNumToRender={7}
          maxToRenderPerBatch={7} 
          keyExtractor={(item) => item.id}
          renderItem={rederItems}
        />
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  card:{
    margin: 7,
    padding: 7,
  },
  image: {
    marginTop: 4,
    backgroundColor: 'white',
    height: 'auto',
    width: '40%',
    aspectRatio: 1 /1,
    borderRadius: 5,
    marginRight: 10,
  },
  title: {
    fontSize: 17,
    color: "#434343",    
  },
  date:{
    marginTop: 4,
    color: 'grey'
  }
})