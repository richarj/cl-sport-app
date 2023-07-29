import { Text, StyleSheet, SafeAreaView, ScrollView, StatusBar, Image,} from 'react-native';


import HeaderBack from '../../Components/HeaderBack';

export default function NewsScreen({ route, navigation }) {

  const {title, urlToImage, content, source} = route.params.news;

  
  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white', flex:1}}>
      <HeaderBack title={'Volver'} OnPress={() => navigation.goBack()}></HeaderBack>
      <ScrollView contentContainerStyle={styles.container}>
        
        <Text style={styles.title}>
          {title}
        </Text>
        <Image style={styles.image} source={{uri: urlToImage}}/>

        <Text style={styles.txtItem}>
          {content}
        </Text>
        <Text style={styles.source}>
          Fuente: {source}
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
   container:{
    marginHorizontal: 17,
  },
  image: {
    marginVertical: 20,
    height: 'auto',
    width: '100%',
    aspectRatio: 640 /480,
    borderRadius: 5,
    backgroundColor: 'whitesmoke',
  },  
  title: {
    marginTop: 20,
    marginBottom: 10,
    fontSize: 21,
    fontWeight: 'bold',
  },
  txtItem:{
    fontSize:17,
    lineHeight: 22,
    color: "#434343",    
  },
  source:{
    marginVertical: 20,
    color: 'grey'
  }  
})