import React, {useMemo, useRef, useState, useEffect, useContext} from 'react'
import {Image, Text, TextInput, TouchableOpacity, View, Animated, StyleSheet, Dimensions} from 'react-native'
import {AntDesign, MaterialCommunityIcons} from '@expo/vector-icons'
import useAddRemveLike from "../Model/users/useAddRemveLike"
import { useMutation } from '@apollo/client'
import { CREATE_MESSAGE } from '../Model/messages/createMessage'
import { CREATE_MUTATION } from '../Model/rooms/useCreateRoom'
import ActionsContext from "../Contexts/ActionsContext";
import Toast from 'react-native-root-toast'

const LocationCard = ({ location, getUserLikes, onPressCenter, navigation, isUserValid }) => {
  const {action, changeAction} = useContext(ActionsContext)
  const center = action?.likes.filter(id => id === location.id)
  const [backupLike, setBackupLike] = useState(center.length > 0)
  const [like, setLike] = useState(false);
  const fadeDislike = useRef(new Animated.Value(0)).current;
  const fadeLike = useRef(new Animated.Value(1)).current;
  const [content, setContent] = useState('')
  const [roomId, setRoomId] = useState(null)
  const [createMessage, { data: dataMesagge, loading: loadingMessage, error: errorMessage }] = useMutation(CREATE_MESSAGE)
  const [createRoom, { data, loading: loadingRoom, error }] = useMutation(CREATE_MUTATION);
  const [where, setWhere] = useState(null)
  const multipleLike = useMemo(() => {
    if (location.likes == 0 && !like && !backupLike) return false
    if (location.likes == 1 && !like && !backupLike) return true
    if (location.likes > 1 && !like && !backupLike) return true

    if (location.likes == 0 && like && !backupLike) return false
    if (location.likes == 1 && like && !backupLike) return true
    if (location.likes > 1 && like && !backupLike) return true

    if (location.likes == 0 && !like && backupLike) return false
    if (location.likes == 1 && !like && backupLike) return false
    if (location.likes > 1 && !like && backupLike) return true

    if (location.likes == 0 && like && backupLike) return false
    if (location.likes == 1 && like && backupLike) return false
    if (location.likes > 1 && like && backupLike) return true

  }, [like, location.likes, backupLike])
  useEffect(() => {
    const center = action?.likes.filter(id => id === location.id)
    setLike(center.length > 0)
  }, [action])
  const fadeIn = (fadeControl) => {
    Animated.timing(fadeControl, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };
  const fadeOut = (fadeControl) => {
    Animated.timing(fadeControl, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  };

  if (!like) {
    fadeIn(fadeDislike)
  } else {
    fadeIn(fadeLike)
  }

  const { submit, loading } = useAddRemveLike(() => {
    setLike(!like)
    if (!like) {
      fadeOut(fadeDislike)
      fadeIn(fadeLike)
    } else {
      fadeOut(fadeLike)
      fadeIn(fadeDislike)
    }

  }, console.log)
  const addRemoveLike = async (like, locationId) => {
    if (loading) return
    submit({locationId, like })
    if (action?.likes?.length) {
      if (!like) {
        await changeAction({...action, likes: action?.likes.filter(e => e !== locationId)})
      } else {
        let arrayNew = action?.likes.concat([locationId])
        await changeAction({...action, likes: arrayNew})
      }
    } else {
      await changeAction({...action, likes: [locationId]})
    }
  }
  const RenderLikes = () => {
    if (!location.isLike && !like) {
      return location.likes > 0 ? <Text>Le gusta a {location.likes} persona{location.likes > 1 ? 's' : ''}</Text> : null
    }
    if (!location.isLike && like) {
      return <Text>
              Te gusta a ti {location.likes > 0 ? 'y a' : ''}{' '}
              {location.likes > 0 ? location.likes + ` persona${location.likes > 1 ? 's' : ''}`: ''}
            </Text>
    }
    if (location.isLike && !like) {
      return <Text>
        {location.likes > 1 ? 'Le gusta a' : ''}{' '}
        {location.likes > 1 ? location.likes - 1 + ` persona${location.likes - 1 > 1 ? 's' : ''}`: ''}
      </Text>
    }
    return <Text>
            Te gusta a ti {location.likes > 1 ? 'y a' : ''}{' '}
            {location.likes > 1 ? location.likes - 1 + ` persona${location.likes - 1 > 1 ? 's' : ''}`: ''}
          </Text>
  }
  const showUserLikes = () => {
    if (!multipleLike) return
    getUserLikes(location.id)
  }
  const sendMessage = () => {
    if (content === '') return
    if (!isUserValid) {
      Toast.show('Para enviar omentarios, debes actualizar tu perfil', {
        duration: Toast.durations.LONG,
        position: Toast.positions.CENTER -100,
        shadow: true,
        animation: true,
        hideOnPress: true,
        delay: 250,
        backgroundColor: '#FF6347'
      });
      navigation.navigate("EditProfile", {
        firstName: action?.firstName,
        lastName: action?.lastName,
        avatar: action?.avatar
      })
      return
    }
    if (roomId) {
      const body = {roomId, content}
      createMessage({variables: body})
    } else {
      setWhere('MESSAGE')
      createRoom({variables: {recipientId: location.id, chatType: 'LOCATION'}})
    }
  }
  useEffect(() => {
    if (!dataMesagge) return
    setContent('')
  }, [dataMesagge])
  useEffect(() => {
    if (!data) return
    setRoomId(data.createRoom.id)
    if (where === 'MESSAGE') {
      const body = {roomId: data.createRoom.id, content}
      createMessage({variables: body})
    } else {
      navigation.push('Comments', {
        id: data.createRoom.id,
        type: 'LOCATION',
        roomId: data.createRoom.id
      })
    }
  }, [data])
  return (
    // Container wrap
    <View
      key={location.id}
      style={{
        paddingBottom: 10,
        borderBottomColor: 'gray',
        borderBottomWidth: 0.1,
      }}>
      {/*Header*/}
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          //padding: 15,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          {/* may be a logo center?
            <Image
                  source={data.postPersonImage}
                  style={{width: 40, height: 40, borderRadius: 100}}
                />
          */}
          <View style={{paddingLeft: 5}}>
            <Text style={{fontSize: 15, fontWeight: 'bold'}}>
              {location.locationName}
            </Text>
          </View>
        </View>
        {/* <Feather name="more-vertical" style={{fontSize: 20}} /> */}
      </View>
      {/* Location image */}
      <TouchableOpacity onPress={onPressCenter}>
        <View
          style={{
            position: 'relative',
            justifyContent: 'center',
            alignItems: 'center',
            marginTop: 7,
          }}
        >
            <Image
              source={{uri: location.image}}
              style={{width: '100%', height: 400}}
            />
        </View>
      </TouchableOpacity>
      {/* like own && comments buttons */}
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 15,
        }}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => {
              addRemoveLike(!like, location.id)
            }}>
              {!like ? <Animated.View
                style={[
                  styles.fadingContainer,
                  {
                    // Bind opacity to animated value
                    opacity: fadeDislike,
                  },
                ]}>
                <AntDesign
                  name='hearto'
                  style={{
                    paddingRight: 10,
                    fontSize: 20,
                    color: 'black',
                  }}
                />
              </Animated.View> :
              <Animated.View
                style={[
                  styles.fadingContainer,
                  {
                    // Bind opacity to animated value
                    opacity: fadeLike,
                  },
                ]}>
                <AntDesign
                  name='heart'
                  style={{
                    paddingRight: 10,
                    fontSize: 20,
                    color: 'red',
                  }}
                />
              </Animated.View>}
            </TouchableOpacity>
            <RenderLikes />
          </View>
          {/* <TouchableOpacity>
                  <Feather name="navigation" style={{fontSize: 20}} />
                </TouchableOpacity> */}
        </View>
        <MaterialCommunityIcons name="heart-multiple" size={25} color={multipleLike ? 'red' : '#E5E7E9'} onPress={showUserLikes}/>
      </View>
      {/* number comment && link to see all comments && button to add comments */}
      <View style={{paddingHorizontal: 15}}>        
        {/*<Text>*/}
        {/*  {like ? 'Te gusta a ti' : location.likes > 0 && ''}*/}
        {/*  {location.likes > 0 ? location.likes + 1 : location.likes} otros*/}
        {/*  location.isLike*/}
        {/*</Text>*/}
        {/*<Text*/}
        {/*  style={{*/}
        {/*    fontWeight: '700',*/}
        {/*    fontSize: 14,*/}
        {/*    paddingVertical: 0,*/}
        {/*  }}>*/}

        {/*</Text>*/}
        <TouchableOpacity
          onPress={() => {
            if (roomId) {
              navigation.push('Comments', {
                id: roomId,
                type: 'LOCATION',
                roomId
              })
            } else {
              setWhere('LOCATION')
              createRoom({variables: {recipientId: location.id, chatType: 'LOCATION'}})
            }
          }}
        >
          <Text style={{opacity: 0.4, paddingVertical: 0}}>Ver todos los comentarios</Text>
        </TouchableOpacity>
        <View
          style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 10}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={{uri: location.image}}
              style={{
                width: 25,
                height: 25,
                borderRadius: 100,
                backgroundColor: 'orange',
                marginRight: 10,
              }}
            />
            <TextInput
              placeholder="Agrega un comentario"
              style={{width: Dimensions.get("window").width - 92, color: 'red'}}
              onChangeText={newText => setContent(newText)}
              value={content}
            />
            <MaterialCommunityIcons name="send" size={24} color="black" style={{marginLeft: 10}} onPress={sendMessage}/>
          </View>
        </View>
      </View>
    </View>
  )
}

export default LocationCard

const styles = StyleSheet.create({
  container: {
  },
  fadingContainer: {
  },
  fadingText: {
  },
  buttonRow: {
  },
});