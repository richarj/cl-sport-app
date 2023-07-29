import { useEffect, useContext, useState, useRef } from 'react'
import {
    View,
    Text,
    StatusBar,
    SafeAreaView,
    Dimensions,
    TouchableOpacity,
    StyleSheet,
    Animated,
    ImageBackground,
    FlashList
} from 'react-native'
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons'
import Bubble from './Bubble'
import { WebsocketContext } from '../Contexts/WebsocketContext'
import useGetMessages from '../Model/messages/useGetMessages'
import { Input, Overlay } from 'react-native-elements'
import { CREATE_MESSAGE } from '../Model/messages/createMessage'
import { useMutation } from '@apollo/client'
import * as ImagePicker from 'expo-image-picker';
import BottomSheet from './BottomSheet';
import {ReactNativeFile} from 'apollo-upload-client'
import EmptyList from '../Components/EmptyList'
import ActionsContext from '../Contexts/ActionsContext'
import Toast from 'react-native-root-toast'


const Comments = ({ route, navigation }) => {
  const { goBack } = navigation;
  const {action } = useContext(ActionsContext)
  const { roomId, isUserValid } = route.params
  const [messages, setMessages] = useState([])
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [getMessages, {data: dataMessages, loading: isLoading, error}] = useGetMessages()
  const [createMessage, { data: dataMesagge, loading, error: errorMessage }] = useMutation(CREATE_MESSAGE)
  console.log({errorMessage})
  const bs = useRef();
  const fall = new Animated.Value(1).current
  const [image, setImage] = useState(null);
  const socket = useContext(WebsocketContext)
  const[isPreimage, setIsPreimage] = useState(false)
  const [file, setFile] = useState(false)
  const [isSheetVisible, setIsSheetVisible] = useState(false)
  const baseQuery = {
      roomId,
      limit: 10,
      next: '',
      previous: '',
      sortField: 'createdAt',
  }
  const [next, setNext] = useState('')
  const [hasNext, setHasNext] = useState(false)
  const [query, setQuery] = useState({ ...baseQuery })
  const [content, setContent] = useState('')
  const addMessage = (data) => {
    const message = data.payload.message
    setMessages(
        prevState => prevState.concat({
            __typename: "Message",
            attachments: message.attachments,
            author: message.author,
            content: message.content,
            id: message._id,
            createdAt: message.createdAt
        })
    )
  }
  useEffect(() => {
    if (!roomId) return
    socket.on('connect', () => {
        console.log('Conected!')
    })
    socket.emit('joinroom', roomId, () => {
        console.log('coneted to room: ', roomId)
    })
    socket.on('onMessage', (data) => {
        addMessage(data)
    })        
    getMessages({
        variables: {
          ...query,
          next
        }
    }).catch(e => console.log({error: e}))
    return () => {
        console.log('unregistereing events')
        socket.off('joinroom')
        socket.off('onMessage')
        socket.off('connect')
    }
  }, [roomId])
  useEffect(() => {
    if (!dataMessages) return
    const data = dataMessages.getMessages
    setHasNext(data.hasNext ?? false)
    setNext(data.next)
    const temp = refreshing ? [] : messages
    setMessages([
      ...temp,
      ...data.docs
    ])
    setRefreshing(false)
  }, [dataMessages])    
  const clickNext = () => {
    if (hasNext) {
      getMessages({
        variables: {
          ...query,
          next
        }
      })
    }
  }
  const flattenData = messages?.flatMap((page) => page) ?? [];
  const sendMessage = () => {
    console.log({content})
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
    const body = {roomId, content}
    if (image) {
      body.file = file
    }
    createMessage({variables: body})
  }
  useEffect(() => {
    if (!dataMesagge) return
    setContent('')
    setIsPreimage(false)
    setImage(null)
  }, [dataMesagge])
  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.9,
    });    
    if (!result.canceled) {
      setImage(result.assets[0].uri)
      setFile(new ReactNativeFile({
        uri: result.assets[0].uri,
        name: 'a.jpg',
        type: 'image/jpg',
      }))
      toogleSheet()
      setTimeout(() => {
        toggleOverlay()
      }, 500)
    }
  }
  const takePhotoFromCamera = async () => {
    //const permissions = await ImagePicker.requestCameraPermissionsAsync()
    const permissions = true
    if(permissions){
      let result =  await ImagePicker.launchCameraAsync({
        maxWidth: 512,
        maxHeight: 512,
        quality: 0.9,
        allowsEditing:false,
      })
      if(!result.canceled){
        setImage(result.assets[0].uri)
        setFile(new ReactNativeFile({
          uri: result.assets[0].uri,
          name: 'a.jpg',
          type: 'image/jpg',
        }))
        toogleSheet()
        setTimeout(() => {
          toggleOverlay()
        }, 500)
      }
    }else{
      Alert.alert("you need to give up permission to work")
    }
  }
  const toggleOverlay = () => {
    setIsPreimage(!isPreimage);
    if (isPreimage) {
      setContent('')
      setImage(null)
    }
  };
  const toogleSheet = () => setIsSheetVisible(!isSheetVisible)

  return (
    <View style={{flex: 1, height: '100%'}}>
      <BottomSheet isVisible={isSheetVisible} setIsVisible={setIsSheetVisible}>
        <View style={[styles.panelHandle, {marginLeft: 'auto', marginRight: 'auto'}]} />
        <View style={styles.panel}>
          <View style={{alignItems: 'center', marginBottom: 15}}>
            <Text style={styles.panelTitle}>Anexar una Imagen</Text>
          </View>
          <TouchableOpacity style={[styles.panelButton]} onPress={takePhotoFromCamera}>
            <Text style={styles.panelButtonTitle}>Tomar una Foto</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.panelButton} onPress={choosePhotoFromLibrary}>
            <Text style={styles.panelButtonTitle}>Escoger desde la Libreria</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.panelButton, {marginTop: 30, backgroundColor: 'gray'}]}
            onPress={toogleSheet}>
            <Text style={styles.panelButtonTitle}>Cancelar</Text>
          </TouchableOpacity>
        </View>
      </BottomSheet>
      <Overlay isVisible={isPreimage} onBackdropPress={toggleOverlay} overlayStyle={{height: 400, width: '100%'}}>
        <View style={{width: '100%', height: 300, backgroundColor: 'gray'}}>
          <ImageBackground source={{uri: image}} style={{height: '100%', width: '100%'}}/>
        </View>
        <View style={{alignItems: 'center', marginTop: 20}}>
          <Input
            placeholder='Escribe un mensaje'
            rightIcon={
                <View style={{flexDirection: 'row'}}>
                    <MaterialCommunityIcons name="send" size={24} color="black" style={{marginLeft: 10}} onPress={sendMessage}/>
                </View>
            }
            onChangeText={newText => setContent(newText)}
            value={content}
          />
        </View>
      </Overlay>
      <SafeAreaView style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white', flex:1}}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 10}}>
          <Text style={{fontWeight: 'bold'}}>Chat</Text>
          <AntDesign name="close" size={24} color="black" style={{alignSelf: 'flex-end'}} onPress={() => { goBack() }}/>
        </View>
        <View style={{flex: 1, height: '100%', width: Dimensions.get("screen").width, paddingHorizontal: 10}}>
          <FlashList
            keyExtractor={(item) => item.id}
            data={flattenData}
            renderItem={({ item }) => <Bubble data={item} userOwn={{id: '15w'}} />}
            onEndReached = {()=>{
            if (!onEndReachedCalledDuringMomentum) {
                clickNext()
                setOnEndReachedCalledDuringMomentum(true)
            }
            }}
            estimatedItemSize={10}
            onEndReachedThreshold={0.001}
            onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
            refreshing={refreshing}
            contentContainerStyle={{ paddingBottom: 20 }}
            ListEmptyComponent={<EmptyList message='Aún no existen messages, en este chat' />}
          />
          <View style={{alignItems: 'center'}}>
            <Input
              placeholder='Escribe un mensaje'
              rightIcon={
                  <View style={{flexDirection: 'row'}}>
                      <MaterialCommunityIcons name="paperclip" size={24} color="black"
                          onPress={toogleSheet} />
                      <MaterialCommunityIcons name="send" size={24} color="black" style={{marginLeft: 10}} onPress={sendMessage}/>
                  </View>
              }
              onChangeText={newText => setContent(newText)}
              value={content}
            />
          </View>
        </View>
      </SafeAreaView>
    </View>
  )
}

export default Comments

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    tabBar: {
      flexDirection: 'row',
      paddingTop: StatusBar.currentHeight,
    },
    tabItem: {
      flex: 1,
      alignItems: 'center',
      padding: 16,
      backgroundColor: 'white'
    },
    commandButton: {
      padding: 15,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginTop: 10,
    },
    panel: {
      padding: 20,
      backgroundColor: '#FFFFFF',
      paddingTop: 20,
      // borderTopLeftRadius: 20,
      // borderTopRightRadius: 20,
      // shadowColor: '#000000',
      // shadowOffset: {width: 0, height: 0},
      // shadowRadius: 5,
      // shadowOpacity: 0.4,
    },
    header: {
      backgroundColor: '#FFFFFF',
      shadowColor: '#333333',
      shadowOffset: {width: -1, height: -3},
      shadowRadius: 2,
      shadowOpacity: 0.4,
      // elevation: 5,
      paddingTop: 20,
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
    },
    panelHeader: {
      alignItems: 'center',
    },
    panelHandle: {
      width: 40,
      height: 8,
      borderRadius: 4,
      backgroundColor: '#00000040',
      marginBottom: 10,
    },
    panelTitle: {
      fontSize: 27,
      height: 35,
    },
    panelSubtitle: {
      fontSize: 14,
      color: 'gray',
      height: 30,
      marginBottom: 10,
    },
    panelButton: {
      padding: 13,
      borderRadius: 10,
      backgroundColor: '#FF6347',
      alignItems: 'center',
      marginVertical: 7,
    },
    panelButtonTitle: {
      fontSize: 17,
      fontWeight: 'bold',
      color: 'white',
    },
    action: {
      flexDirection: 'row',
      marginTop: 10,
      marginBottom: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f2f2f2',
      paddingBottom: 5,
    },
    actionError: {
      flexDirection: 'row',
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#FF0000',
      paddingBottom: 5,
    },
    textInput: {
      flex: 1,
      marginTop: Platform.OS === 'ios' ? 0 : -12,
      paddingLeft: 10,
      color: '#05375a',
    },
  })

