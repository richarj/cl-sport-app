import React, {useContext, useEffect, useMemo, useState} from 'react'
import {View, SafeAreaView, StatusBar, FlashList} from 'react-native'
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons'
import useGetLocations from '../../Model/locations/useGetLocations'


import LocationCard from '../../Components/LocationCard'
import SettingFilter from '../../Components/SettingFilter'
import useGetAllSports from '../../Model/sports/useGetAllSports'
import ListUsersLikes from '../../Components/ListUsersLikes'
import { useMutation } from '@apollo/client'
import { CREATE_MUTATION } from '../../Model/rooms/useCreateRoom'

import EmptyList from '../../Components/EmptyList'
import useGetLocationById from '../../Model/sports/useGetLocationById'
import ActionsContext from "../../Contexts/ActionsContext";

const HomeScreen = (props) => {
  const {action, changeAction} = useContext(ActionsContext)
  const [isMapView] = useState(false)
  const [isFinalMap, setIsFinalMap] = useState(false)
  const [locations, setLocations] = useState([])
  const [next, setNext] = useState('')
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true)
  const [isVisibleFilters, setIsVisibleFilters] = useState(false);
  const [sports, setSports] = useState([])
  const [refreshing, setRefreshing] = useState(false)
  const [isShowUsersLikes, setIsShowUsersLikes] = useState(false)
  const [locationId, setLocationId] = useState(null)
  const [room, setRoom] = useState({id: '', type: ''})
  const [createRoom, { data, loading }] = useMutation(CREATE_MUTATION);
  
  const isUserValid = useMemo(() => {
    return action?.avatar && action.firstName && action.lastName && action.firstName !== "" && action.lastName !== ""
  }, [action])

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
      props.navigation.navigate("Center", {center: center, isUserValid})
    },
    (error) => console.log({nover: error}),
  )
  const likes = action?.likes ?? []
  const baseQuery = {
    limit: 10,
    next: '',
    previous: '',
    sortField: 'name',
    search: '',
    regionIds: [],
    communeIds: action?.communeIds?.map(c => c.id) ?? [],
    sports: [],
    isParalympic: action.isParalympic ? true : null
  }


  const [query, setQuery] = useState({ ...baseQuery })
  const [hasNext, setHasNext] = useState(false)
  const [getLocations, {data: dataLocations, loading: isLoading}] = useGetLocations()
  useEffect(() => {
    if (!dataLocations) return
    setHasNext(dataLocations.allPaginateLocations.hasNext ?? false)
    setNext(dataLocations.allPaginateLocations.next)
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
          isLike: likes.filter(e => e === location.id).length > 0
      }))]
    )
    setRefreshing(false)
    console.log({isMapView})
    if (isMapView) setIsFinalMap(true)
  }, [dataLocations, isMapView])
  const clickNext = () => {
    if (hasNext) {
      getLocations({
        variables: {
          ...query,
          next
        }
      })
    }
  }
  const flattenData = locations?.flatMap((page) => page) ?? [];
  useEffect(() => {
    if (action === {}) return
    getLocations({
      variables: {
        ...query,
        communeIds: action?.communeIds?.map(c => c.id),
        next,
        isParalympic: action.isParalympic ? true : false
      }
    })
  }, [action])
  const {submit} = useGetAllSports(
    data => {
      setSports(data.getAllSports)
    },
    error => {
      console.log({sportsError: error})
    }
  )
  useEffect(() => {
    submit()
  }, [])
  const applyFilters = async (filters) => {
    setOnEndReachedCalledDuringMomentum(false)
    setRefreshing(true)
    getLocations({
      variables: {
        ...query,
        communeIds: filters.communes.map(e => e._id),
        sports: filters.sports.map(e => e.name),
        next: '',
        isParalympic: filters.isParalympic ? true : null
      }
    })
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
  const getUserLikes = (id) => {
    setLocationId(id)
    setIsShowUsersLikes(!isShowUsersLikes)
  }
  const displayComments = (id, type) => {
    setIsShowUsersLikes(false)
    setRoom({id, type})
    createRoom({variables: {recipientId: id, chatType: type}})
  }
  useEffect(() => {
    if (!data) return
    const roomId = data.createRoom.id
    props.navigation.push('Comments', {
      id: room.id,
      type: room.type,
      roomId,
      isUserValid
    })
  }, [data])
  const showCenter = (center) => {
    getCenter({variables: {locationId: center.id}}) 
  }
  const changeView = () => {
    props.navigation.navigate("Map")
  }

  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white', flex:1}}>
      <View style={{height: '100%'}}>
        <View
            style={{
                flexDirection: 'row',
                // backgroundColor: 'red'
                justifyContent: 'flex-end',
            // flexDirection: 'row',
            paddingHorizontal: 10,
            // alignItems: 'left',

            }}
        >
          <MaterialIcons name="location-pin" size={30} color="black" onPress={() => {changeView()}}/>
          <MaterialCommunityIcons
            name="filter-variant"
            size={24}
            color="black"
            style={{marginLeft: 10}}
            onPress={() => setIsVisibleFilters(!isVisibleFilters)}
          />
        </View>
        <View style={{flex: 1}}>
          {
            action !== {} && !isFinalMap && (
              <FlashList
                keyExtractor={(item) => item.id}
                data={flattenData}
                renderItem={({ item }) =>
                  <LocationCard
                    location={item}
                    getUserLikes={(id) => getUserLikes(id)}
                    navigation={props.navigation}
                    onPressCenter={() => {
                      showCenter(item)
                    }}
                    isUserValid={isUserValid}
                    action={action}
                  />
                }
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
                ListEmptyComponent={<EmptyList message='No se encontraron centros, para tu búsqueda' />}
              />
            )
          }
        </View>
      </View>
      {
        isVisibleFilters &&
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
      {
        isShowUsersLikes && <ListUsersLikes isVisible={isShowUsersLikes} setIsVisible={setIsShowUsersLikes} id={locationId} showComments={(id, type) => {displayComments(id, type)}} />
      }
    </SafeAreaView>
  )
}

export default HomeScreen