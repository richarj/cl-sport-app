import React, {useRef, useState} from 'react';
import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Animated,
  useWindowDimensions,
  TouchableOpacity,
  ImageBackground
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view'
import BottomSheet from '../../Components/BottomSheet';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons'
import CustomInput from '../../Components/CustomInput'
import {useForm} from 'react-hook-form'
import {Button} from 'react-native-elements'
import * as ImagePicker from 'expo-image-picker';
import { useMutation } from '@apollo/client'
import {ReactNativeFile} from 'apollo-upload-client'
//import Spinner from 'react-native-loading-spinner-overlay'
import emitter from '../../Emitter/emitter'
import Toast from 'react-native-root-toast'
import {
  getAuth,
  updatePassword,
  reauthenticateWithCredential,
  EmailAuthProvider,
} from 'firebase/auth';
import { SET_AVATAR, SET_BASIC_DATA } from '../../Model/users/queries'



const EditProfile = ({route}) => {
  const {resume} = route.params
  const [index, setIndex] = useState(0)
  const layout = useWindowDimensions();
  const [routes] = React.useState([
    { key: 'data', title: 'Datos Basicos' },
    { key: 'pass', title: 'Password' },
  ]);
  const [isSheetVisible, setIsSheetVisible] = useState(false)
  const { control, handleSubmit } = useForm({ mode: 'onBlur', reValidateMode:'onBlur',
    defaultValues: {
      firstName: resume?.firstName,
      lastName: resume?.lastName
    }})
  const { control: controlPassword, handleSubmit: handleSubmitPassword, watch } = useForm({ mode: 'onBlur', reValidateMode:'onBlur',
    defaultValues: {
      oldPassword: '123456789',
      password: '123456',
      repeatPassword: '123456'
    }
  })
  const toogleSheet = () => setIsSheetVisible(!isSheetVisible)
  const [mutate, {loading}] = useMutation(SET_AVATAR);
  const [setBasicData , {loading: loadingBasic}] = useMutation(SET_BASIC_DATA);
  const [image, setImage] = useState(resume?.avatar ? resume.avatar.baseCdn + resume.avatar.folder + '/' + resume.avatar.image : null);
  const bs = useRef();
  const FirstRoute = () => (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
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
      <View style={{backgroundColor: 'white', alignItems: 'center', marginTop: 10}}>
          <View
            style={{
              height: 100,
              width: 100,
              borderRadius: 50,
              justifyContent: 'center',
              alignItems: 'center',
            }}>
            <ImageBackground
              source={!image ? require('../../Storage/images/userProfile.png'): {uri: image}}
              style={{height: 100, width: 100}}
              imageStyle={{
                borderRadius: 50
              }}>
            </ImageBackground>
        </View>
        <TouchableOpacity onPress={() => {
          toogleSheet()
        }}>
          <View style={{width: 30, marginTop: 7}}>
            <Icon
              name="camera"
              size={30}
              color="#000"
              style={{
                opacity: 0.5,
                borderWidth: 0,
                borderColor: '#000',
              }}
            />
          </View>
        </TouchableOpacity>
      </View>
      <View style={{marginTop: 20, padding: 20}}>
      <CustomInput
        placeholder="Nombre"
        name="firstName"
        keyboardType="default"
        autoCapitalize="none"
        control={control}
        rules={{
          required: 'Ingresa tu nombre',
          pattern: {value: /^[a-z\s]{0,255}$/i, message: 'Ingresa un nombre válido'}
        }}
        color='black'
        // initialValue={resume.firstName}
        // keys='firstName'
      />
      <CustomInput
        placeholder="Apellido"
        name="lastName"
        keyboardType="default"
        autoCapitalize="none"
        control={control}
        rules={{
          required: 'Ingresa tu apellido',
          pattern: {value: /^[a-z\s]{0,255}$/i, message: 'Ingresa un apellido válido'}
        }}
        color='black'
        style={{marginTop: 10}}
      />
      <Button
        title="Guardar"
        titleStyle={{ fontSize: 17, fontWeight: 'bold' }}
        containerStyle={{marginVertical: 5, borderRadius: 50, marginTop: 20}}
        buttonStyle={{ height: 48, backgroundColor: '#2D7CBF'}}
        onPress={handleSubmit(handleOnPress)} loading={loadingBasic}
      />

      </View>
    </View>
  );
  const SecondRoute = () => (
    <View style={[{backgroundColor: 'white', flex: 1}]}>
      <View style={{marginTop: 20, padding: 20}}>
        <CustomInput
          placeholder="Contraseña Anterior"
          name="oldPassword"
          control={controlPassword}
          secureTextEntry={true}
          rules={{
            required: 'Ingresa tu contraseña anterior',
            minLength: {value: 6, message: 'La contraseña debe tener almenos 6 caracteres'}
          }}
          color='black'
        />
        <CustomInput
          placeholder="Nueva tu contraseña"
          name="password"
          control={controlPassword}
          secureTextEntry={true}
          rules={{
            required: 'Ingresa tu nueva contraseña',
            minLength: {value: 6, message: 'La contraseña debe tener almenos 6 caracteres'}
          }}
          color='black'
          style={{marginTop: 10}}
        />
        <CustomInput
          placeholder="Repite tu contraseña"
          name="repeatPassword"
          control={controlPassword}
          secureTextEntry={true}
          rules={{
            validate: value => value === watch('password') || 'Las contraseñas no coinciden'
          }}
          color='black'
          style={{marginTop: 10}}
        />
        <Button
          title="Cambiar Contraseña"
          titleStyle={{ fontSize: 17, fontWeight: 'bold' }}
          containerStyle={{marginVertical: 5, borderRadius: 50, marginTop: 20}}
          buttonStyle={{ height: 48, backgroundColor: '#2D7CBF'}}
          onPress={handleSubmitPassword(handleOnPressPassword)} loading={loadingBasic}
        />
      </View>
    </View>
  );
  const renderScene = SceneMap({
    data: FirstRoute,
    pass: SecondRoute,
  });
  const renderTabBar = (props) => {
    const inputRange = props.navigationState.routes.map((x, i) => i);
    const [color, setColor] = useState('white')
    const onPress = (i) => {
      setColor('white');
      setIndex(i)
    };
    return (
      <View style={styles.tabBar}>
        {props.navigationState.routes.map((route, i) => {
          const opacity = props.position.interpolate({
            inputRange,
            outputRange: inputRange.map((inputIndex) =>
              inputIndex === i ? 1 : 0.5
            ),
          });

          return (
            <TouchableOpacity
              style={[styles.tabItem, {backgroundColor: color}]}
              onPress={() => onPress(i)}
              key={i}
            >
              <Animated.Text style={{ opacity }}>{route.title}</Animated.Text>
            </TouchableOpacity>
          );
        })}
      </View>
    );
  };

  const takePhotoFromCamera = async () => {
    let result =  await ImagePicker.launchCameraAsync({
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.9,
      allowsEditing:false,
    })
    if(!result.canceled){
      setImage(result.assets[0].uri)
      const file = new ReactNativeFile({
        uri: result.assets[0].uri,
        name: 'a.jpg',
        type: 'image/jpg',
      });
      toogleSheet()
      mutate({ variables: { file } })
        .then(data => {
          emitter.emit('updateProfile')
          // setMessage({show: true, body: 'Datos basicos actualizados'})
        })
        .catch(error => console.log({error}))
    }
  }

  const choosePhotoFromLibrary = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      allowsEditing: false,
      maxWidth: 512,
      maxHeight: 512,
      quality: 0.9,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri)
      const file = new ReactNativeFile({
        uri: result.assets[0].uri,
        name: 'a.jpg',
        type: 'image/jpg',
      });
      toogleSheet()
      mutate({ variables: { file } })
        .then(data => {
          emitter.emit('updateProfile')
          // setMessage({show: true, body: 'Datos basicos actualizados'})
        })
        .catch(error => console.log({error}))
    }
  }
  const handleOnPress = ({ firstName, lastName}) => {
    setBasicData({variables: {input: {firstName, lastName}}})
      .then(data => {
        emitter.emit('updateProfile')
        Toast.show('Datos básicos actualizados correctamente', {
          duration: Toast.durations.LONG,
          position: Toast.positions.CENTER -100,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 250,
          backgroundColor: '#2D7CBF'
        });
      })
      .catch(console.log)
  }

  const handleOnPressPassword = async ({oldPassword, password, repeatPassword}) => {



    console.log({oldPassword, password, repeatPassword})
    const auth = getAuth();

    const user = auth.currentUser
    const newPassword = password

    const credential = EmailAuthProvider.credential(
      user.email,
      oldPassword
    );

    reauthenticateWithCredential(auth.currentUser, credential)
      .then(() => {
        updatePassword(user, newPassword)
          .then(() => {
            Toast.show('La contraseña se ha cambiado con éxito, la sessión de cerrará', {
              duration: Toast.durations.LONG + 1000,
              position: Toast.positions.CENTER -100,
              shadow: true,
              animation: true,
              hideOnPress: true,
              delay: 250,
              backgroundColor: '#2D7CBF',
              onHidden: () => {
                emitter.emit('closeSession')
              }
            });
          })
      })
      .catch((e) => {
        Toast.show('    La contraseña anterior no coincide    ', {
          duration: Toast.durations.LONG + 1000,
          position: Toast.positions.CENTER -100,
          shadow: true,
          animation: true,
          hideOnPress: true,
          delay: 250,
          backgroundColor: 'red'
        });
      })


  }
  return (
    <View style={{ flex: 1}}>
      <TabView
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        style={{backgroundColor: 'red'}}
        renderTabBar={renderTabBar}
      />
      {/* <Spinner
        visible={loading}
        textContent={'Actualizando...'}
        textStyle={{color: '#FFF'}}
      /> */}
    </View>
  )
}

export default EditProfile

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
});