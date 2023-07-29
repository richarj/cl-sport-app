import {useRef, useState, useEffect, useContext} from 'react'
import {View, Text, StatusBar, SafeAreaView, Image, TouchableOpacity, StyleSheet, Animated, TextInput, Dimensions} from 'react-native';
import { AntDesign, Feather, Entypo, MaterialCommunityIcons, FontAwesome } from '@expo/vector-icons';
import useAddRemveLike from '../Model/users/useAddRemveLike'
import { useMutation } from '@apollo/client';
import { CREATE_MUTATION } from '../Model/rooms/useCreateRoom';
import { CREATE_MESSAGE } from '../Model/messages/createMessage';
import ActionsContext from "../Contexts/ActionsContext";
import Toast from 'react-native-root-toast';

const Center = ({ route, navigation }) => {
  const {action, changeAction} = useContext(ActionsContext)
  const { goBack } = navigation;
  const {center, isUserValid} = route.params
  const location = center
  const [like, setLike] = useState(center.isLike);
  const [where, setWhere] = useState(null)
  const [content, setContent] = useState('')
  const [roomId, setRoomId] = useState(null)
  const goToMap = () => {
    navigation.navigate("ViewMap", {center})
    console.log(center.latitude, center.longitude)
  }
  const fadeDislike = useRef(new Animated.Value(0)).current;
  const fadeLike = useRef(new Animated.Value(1)).current;
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
  const [createMessage, { data: dataMesagge, loading: loadingMessage, error: errorMessage }] = useMutation(CREATE_MESSAGE)
  const [createRoom, { data, loading: loadingRoom, error }] = useMutation(CREATE_MUTATION);
  const fadeIn = (fadeControl) => {
    Animated.timing(fadeControl, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
  const fadeOut = (fadeControl) => {
    Animated.timing(fadeControl, {
      toValue: 0,
      duration: 500,
      useNativeDriver: true,
    }).start();
  }
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
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white', flex:1}}>
      <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
        <Text style={{fontWeight: 'bold'}}>{center.locationName}</Text>
        <AntDesign name="close" size={24} color="black" style={{alignSelf: 'flex-end'}} onPress={() => { goBack() }}/>
      </View>
      <View
        style={{
          position: 'relative',
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 7,
        }}
      >
        <Image
          source={{uri: center.image}}
          style={{width: '100%', height: 400}}
        />
      </View>

      {/* init */}

      <View style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingHorizontal: 10,paddingBottom: 10
      }}>
            <TouchableOpacity onPress={() => {
              addRemoveLike(!like, center.id)
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


      <View style={{paddingHorizontal: 10}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Feather name="activity" size={24} color="#48ABE3" />
            <Text style={{marginLeft: 10, fontStyle: 'italic'}}>{center.sport}</Text>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <AntDesign name="home" size={24} color="#48ABE3" />
            <Text style={{marginLeft: 10, fontStyle: 'italic'}}>{center.type}</Text>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10, justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', alignItems: 'center', width: '90%'}}>
            <Entypo name="address" size={24} color="#48ABE3" />
            <View style={{flexDirection: 'column'}}>
              <Text style={{marginLeft: 10,}}>{center.address}</Text>
              <View style={{flexDirection: 'row'}}>
                <Text style={{marginLeft: 10, fontStyle: 'italic'}}>{center.number},</Text>
                <Text style={{marginLeft: 10, fontStyle: 'italic'}}>{center.communeName}</Text>
              </View>
            </View>
          </View>
          <TouchableOpacity onPress={goToMap}>
            <MaterialCommunityIcons name="map-marker-radius" size={24} color="red" />
          </TouchableOpacity>
        </View>
        {center.phone !== '' && <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <FontAwesome name="phone" size={25} color="#48ABE3"/>
          <Text style={{marginLeft: 10}}>{center.sport}</Text>
        </View>}
        {center.email !== '' && <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <MaterialCommunityIcons name="email-outline" size={24} color="#48ABE3"/>
          <Text style={{marginLeft: 10}}>{center.sport}</Text>
        </View>}
        {center.web !== '' && <View style={{flexDirection: 'row', alignItems: 'center', marginTop: 10}}>
          <MaterialCommunityIcons name="web" size={24} color="#48ABE3"/>
          <Text style={{marginLeft: 10}}>{center.sport}</Text>
        </View>}
        <TouchableOpacity
          style={{marginTop: 10}}
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
    </SafeAreaView>
  )
}

export default Center

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