import React, {useContext, useEffect, useState} from "react";
import {View, StatusBar, SafeAreaView} from "react-native";
import {
  MaterialCommunityIcons,
  MaterialIcons
} from '@expo/vector-icons'
import SettingFilter from "../../Components/SettingFilter";
import ActionsContext from "../../Contexts/ActionsContext";
import useGetLocations from "../../Model/locations/useGetLocations";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import useGetLocationById from "../../Model/sports/useGetLocationById";

const MapScreen = (props) => {
  const {action, changeAction} = useContext(ActionsContext)
  const [refreshing, setRefreshing] = useState(false)
  const [locations, setLocations] = useState([])
  const [isVisibleFilters, setIsVisibleFilters] = useState(false)
  const [sports, setSports] = useState([])
  const [query, setQuery] = useState({
    limit: 0,
    next: '',
    previous: '',
    sortField: 'name',
    search: '',
    regionIds: [],
    communeIds: action?.communeIds?.map(c => c.id) ?? [],
    sports: []
  })
  const [getLocations, {data: dataLocations, loading: isLoading}] = useGetLocations()
  const likes = action?.likes ?? []

  const {submit: getCenter, loading: loadingCenter} = useGetLocationById(
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
        isLike: likes.filter(e => e === location.id).length > 0
      }
      props.navigation.navigate("Center", {center})
    },
    (error) => console.log(error),
  )

  // useEffect(() => {
  //   setRefreshing(true)
  //   submit()
  //   getLocations({variables: {
  //     ...query
  //   }})
  // }, [])
  useEffect(() => {
    setRefreshing(true)
    getLocations({variables: {
        ...query
      }})
  }, [query])

  useEffect(() => {
    if (!dataLocations) return
    console.log({dataLocations})
    const temp = refreshing ? [] : locations
    setLocations([...temp, ...dataLocations.allPaginateLocations.docs.map(location => ({
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
        isLike: false
      }))]
    )
    setRefreshing(false)
  }, [dataLocations])
  const applyFilters = async (filters) => {
    setQuery({
      ...query,
      communeIds: filters.communes.map(e => e._id),
      sports: filters.sports.map(e => e.name),
      next: ''
    })
    changeAction({
      ...action,
      communeIds: filters.communes.map(e => ({...e, id: e._id})),
      regionIds: [],
      sportIds: filters.sports,
      isParalympic: filters.isParalympic
    })
  }
  const changeView = () => {
    props.navigation.goBack()
  }
  const average = locationName => locations.reduce((a, b) => {return a + Number(b[locationName])}, 0) / locations.length;
  const region = {
    latitude: average('latitude') || -33.4566362382008,
    longitude: average('longitude') || -70.6488050373298,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  }
  const initialRegion = {
    latitude: -33.4566362382008,
    longitude: -70.6488050373298,
    latitudeDelta: 0.2,
    longitudeDelta: 0.2,
  }
  const showCenter = (id) => {
    getCenter({variables: {locationId: id}})
  }
  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white', flex:1}}>
      <View style={{height: '100%'}}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            paddingHorizontal: 10
          }}>
          <MaterialIcons name="list-alt" size={24} color="black" onPress={changeView} />
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color="black"
            style={{marginLeft: 20}}
            onPress={() => setIsVisibleFilters(!isVisibleFilters)}
          />
        </View>
        <MapView initialRegion={initialRegion} region={region}
                 style={{flex:1}}
                 provider={PROVIDER_GOOGLE}
                 //onMapReady={() => setTimeout(() => setMapReady(true), 5000)}
        >
          {locations.map((item, index) => (
            <Marker
              key={index}
              coordinate={{ latitude: Number(item.latitude), longitude: Number(item.longitude) }}
              onPress={() => showCenter(item.id)}
            />
          ))}
        </MapView>
      </View>
      { isVisibleFilters &&
        <SettingFilter
          isVisibleFilters={isVisibleFilters}
          setIsVisibleFilters={setIsVisibleFilters}
          filters={action}
          setFilters={(filters) => {
            applyFilters(filters)
          }}
          sports={sports}
        />
      }
    </SafeAreaView>
  )
}
export default MapScreen