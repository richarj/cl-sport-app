import React, {useEffect, useState} from 'react'
import {View, Text, ScrollView, Image, TouchableOpacity, FlashList} from 'react-native'
import useGetFavorites from '../../Model/users/useGetFavorites'
import {splitEvery} from 'ramda'
import useGetLocationById from '../../Model/sports/useGetLocationById'
import EmptyList from '../../Components/EmptyList';

const Favorites = ({navigation}) => {

  const [hasNext, setHasNext] = useState(false)
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true)
  const [query, setQuery] = useState({ limit: 12, page: 1 })
  const [refreshing, setRefreshing] = useState(false)
  const [options, setOptions] = useState({currentPage: 0, itemCount: 0, itemsPerPage: 0, totalItems: 0, totalPages: 0})
  const [getFavorites, {data: dataFavorites, loading: isLoading}] = useGetFavorites()
  const [favorites, setFavorites] = useState([])
  const [backupFavorites, setBackupFavorites] = useState([])
  const {submit: getCenter, loading} = useGetLocationById(  
    (data) => {
      const location = data.getOneLocation
      const center = {
        administration: location.administration,
        communeName: location.location.communeName,
        sport: location.sport,
        address: location.location.address,
        locationName: location.name,
        id: location.id,
        latitude: location.location.latitude,
        image: location.image,
        longitude: location.location.longitude,
        number: location.location.number ?? '',
        phone: location.phone ?? '',
        type: location.type,
        email: location.email ?? '',
        web: location.web ?? '',
        isOwnImage: location.isOwnImage,
        scheduled: location.horario,
        likes: location.likes,
        isLike: false//likes.filter(e => e === location.id).length > 0
      }
      navigation.navigate("Center", {center})
    },
    (error) => console.log({nover: error}),
  )
  useEffect(() => {
    getFavorites({
      variables: query
    })
  }, [])

  useEffect(() => {
    // "options": {"currentPage": 1, "itemCount": 12, "itemsPerPage": 12, "totalItems": 2430, "totalPages": 203}
    if (!dataFavorites) return
    const items = dataFavorites.getFavorites.items
    const control = dataFavorites.getFavorites.meta
    setHasNext(control.currentPage <  control.totalPages)
    setOptions(control)
    const backup = [...backupFavorites, ...items]
    setBackupFavorites(backup)
    const temp = refreshing ? [] : backup
    const splitItems = splitEvery(3, temp)
    let finalItems = []
    splitItems.map(
      (e, i) => {
        finalItems.push({
          id: `loc-${e[0].id}`,
          item: e
        })
      }
    )
    setFavorites(finalItems)
    // console.log('********')
    // console.log({finalItems: JSON.stringify(finalItems)})
  }, [dataFavorites])

  const clickNext = () => {
    if (hasNext) {
      getFavorites({
        variables: {
          ...query,
          page: options.currentPage + 1
        }
      })
    }
  }
  const flattenData = favorites?.flatMap((page) => page) ?? [];

  let squares = [];
  let numberOfSquare = 7;

  for (let index = 0; index < numberOfSquare; index++) {
    squares.push(
      <View key={index}>
        <View
          style={{
            width: 130,
            height: 150,
            marginVertical: 0.5,
            backgroundColor: 'black',
            opacity: 0.1,
          }}></View>
      </View>,
    );
  }
  const showCenter = (center) => {
    getCenter({variables: {locationId: center.id}})    
  }
  const Locations = ({item}) => {
    return (
      <View
        style={{
          flexDirection: 'row'
        }}

      >
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            flexWrap: 'wrap',
            flexDirection: 'row',
            paddingVertical: 5,
            justifyContent: 'space-between',
          }}>
          {
            item.item.map(
              (e, i) => {
                return (
                  <View
                    style={{
                      width: 130,
                      height: 150,
                      marginVertical: 0.5,
                      backgroundColor: 'black',
                      opacity: 1,
                    }}
                    key={`l-${e.id}`}
                  >
                    <TouchableOpacity onPress={() => {showCenter(e)}}>
                      <Image
                        source={{uri: e.image}}
                        style={{width: '100%', height: 150}}
                      />
                    </TouchableOpacity>
                  </View>)
              }
            )
          }
        </View>
      </View>
    );
  };
  const Video = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            flexWrap: 'wrap',
            flexDirection: 'row',
            paddingVertical: 5,
            justifyContent: 'space-between',
          }}>
          {squares}
        </View>
      </ScrollView>
    );
  };
  const Tags = () => {
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{
          width: '100%',
          height: '100%',
        }}>
        <View
          style={{
            width: '100%',
            height: '100%',
            backgroundColor: 'white',
            flexWrap: 'wrap',
            flexDirection: 'row',
            paddingVertical: 5,
            justifyContent: 'space-between',
          }}>
          {squares}
        </View>
      </ScrollView>
    );
  };

  return (
    <View style={{flex: 1}}>
      <Text
        style={{
          padding: 10,
          letterSpacing: 1,
          fontSize: 14,
          textAlign: 'right'
        }}>
        Centros deportivos favoritos
      </Text>
      {/*<Posts />*/}
      <View
        style={{
          width: '100%',
          height: '100%',
          backgroundColor: 'white',
          flexWrap: 'wrap',
          flexDirection: 'row',
          paddingVertical: 5,
          justifyContent: 'space-between',
        }}>


        <FlashList
          keyExtractor={(item) => item.id}
          data={flattenData}
          renderItem={({ item }) => <Locations item={item} />}
          onEndReached = {()=>{
            if (!onEndReachedCalledDuringMomentum) {
              clickNext()  // LOAD MORE DATA
              setOnEndReachedCalledDuringMomentum(true)
            }
          }}
          estimatedItemSize={5}
          onEndReachedThreshold={0.001}
          onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
          refreshing={refreshing}
          ListEmptyComponent={<EmptyList message='Aún no has agregado centros a tus favoritos' />}
        />


      </View>
    </View>
    // <Tab.Navigator
    //   screenOptions={({route}) => ({
    //     tabBarShowLabel: false,
    //     tabBarIndicatorStyle: {
    //       backgroundColor: 'black',
    //       height: 1.5,
    //     },
    //     tabBarIcon: ({focused, colour}) => {
    //       let iconName;
    //       if (route.name === 'Posts') {
    //         iconName = focused ? 'ios-apps-sharp' : 'ios-apps-sharp';
    //         colour = focused ? 'black' : 'gray';
    //       } else if (route.name === 'Video') {
    //         iconName = focused ? 'ios-play-circle' : 'ios-play-circle-outline';
    //         colour = focused ? 'black' : 'gray';
    //       } else if (route.name === 'Tags') {
    //         iconName = focused ? 'ios-person' : 'ios-person-outline';
    //         colour = focused ? 'black' : 'gray';
    //       }

    //       return <Ionicons name={iconName} color={colour} size={22} />;
    //     },
    //   })}>
    //   <Tab.Screen name="Posts" component={Posts} />
    //   <Tab.Screen name="Video" component={Video} />
    //   <Tab.Screen name="Tags" component={Tags} />
    // </Tab.Navigator>
  );
};

export default Favorites;
