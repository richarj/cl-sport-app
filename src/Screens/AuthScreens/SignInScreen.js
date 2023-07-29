import React, {useContext, useEffect} from 'react';
import { StyleSheet, Image, Text, TouchableOpacity, View, Linking} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
import { useForm } from 'react-hook-form'
import { Button } from 'react-native-elements';
import { AntDesign } from '@expo/vector-icons'
import { signInWithEmailAndPassword } from "firebase/auth"
import { auth } from '../../Config/firebase'

import CustomInput from "../../Components/CustomInput"
import { gql, useLazyQuery } from "@apollo/client";
import {SingnedUserContext} from "../../Providers/SingnedUserProvider";
import ActionsContext from "../../Contexts/ActionsContext";

const GET_GREETING = gql`
  query($platForm: PlatFormEnum!) {
          me(platForm: $platForm) {
            userId
            firstName
            lastName
            roles
            avatar {
              baseCdn
            }
            settingsSearch {
              communeIds {
                id
              }
              regionIds {
                id
              }
              sportIds {
                id
              }
              isParalympic
            }
            likesLocations,
          }
        }
`;

const SignInScreen = ({ navigation }) => {
  const { setIsSingned } = useContext(SingnedUserContext);
  const {changeAction} = useContext(ActionsContext)
  const { control, handleSubmit } = useForm({ mode: 'onBlur', reValidateMode:'onBlur',
    defaultValues: {
      email: 'curso.lujano@gmail.com',
      password: 'casa9976',
    }
  })
  const [loadGreeting, { called, loading, data, error }] = useLazyQuery(
  GET_GREETING,
  { variables: { platForm: "WEB" } }
  )
  useEffect(() => {
    if (!data) return
    console.log({data})
    const basicData = {
      userId: data.me?.userId,
      firstName: data.me.firstName ?? null,
      lastName: data.me.lastName ?? null,
      avatar: data.me ?? null
    }
    changeAction(
      data.me?.settingsSearch
        ? { ...data.me?.settingsSearch, likes: data.me?.likesLocations ?? [], ...basicData }
        : { communeIds: [], regionIds: [], sportIds: [], likes: [], ...basicData }
      )
    setIsSingned(true)
  }, [data])
  const navigateSignUp = () => navigation.navigate('SignUpScreen')
  const navigateReset = () => navigation.navigate('ResetScreen')
  const navigateSignOut = () => navigation.navigate('SignOutScreen')
//   //const { setSignedIn } = useContext(AuthContext)
  const handleOnPress = (props) => {
    signInWithEmailAndPassword(auth, props.email, props.password)
      .then(
        data => {
          loadGreeting()
            .then(data => {})
            .catch(error => {
              console.log({errorCatch: error})
            })
        }
      )
      .catch(error => {
        console.log(error.message)
      });
  }
  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} style={{backgroundColor: '#48ABE3'}}>
      <Image style={styles.image}
        source={{uri: 'https://chilehacedeporte.cl/wp-content/uploads/2022/03/logo-blanco-04.png'}}/>
      <Text style={styles.title}>Bienvenidos/as</Text>
      <CustomInput placeholder="Correo" name="email" keyboardType="email-address" autoCapitalize="none" control={control}
        rules={{
          required: 'Ingresa tu correo',
          pattern: {value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message: 'Ingresa un correo válido'}
        }}/>
      <CustomInput placeholder="Contraseña" name="password" control={control} secureTextEntry={true}
        rules={{
          required: 'Ingresa tu contraseña',
          minLength: {value: 6, message: 'La contraseña debe tener almenos 6 caracteres'}
        }}/>
      <Button title="¿Olvidaste tu contraseña?" type="clear" titleStyle={{ fontSize: 17, color: 'white' }} containerStyle={{marginVertical: 5}} buttonStyle={{ justifyContent: 'flex-end' }} onPress={navigateReset}/>
      <Button title="Inicia sesión" titleStyle={{ fontSize: 17, fontWeight: 'bold' }} containerStyle={{marginVertical: 5, borderRadius: 50,}} onPress={handleSubmit(handleOnPress)} buttonStyle={{ height: 48, backgroundColor: "#2D7CBF",}}/>
      <Button title="Crea tu cuenta" type="clear" titleStyle={{ fontSize: 17, color: 'white', }} containerStyle={{marginVertical: 5}} onPress={navigateSignUp} buttonStyle={{ height: 48}}/>
      <View style={styles.card}>
        <Text style={styles.title2}>Revisa nuestras redes</Text>
        <View style={styles.rrss}>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.facebook.com/chilehacedeporte2020/')}>
            <AntDesign name="facebook-square" size={39} color="#1877F2" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://www.instagram.com/chilehacedeporte/')}>
            <AntDesign name="instagram" size={39} color="#C72E78" />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL('https://twitter.com/Chiledosport')}>
            <AntDesign name="twitter" size={39} color="#1D9BF0" />
          </TouchableOpacity>
        </View> 
      </View>
      <Button title="Elimina tu cuenta" type="clear" titleStyle={{ fontSize: 14, color: 'white' }} containerStyle={{marginVertical: 5}} buttonStyle={{ justifyContent: 'flex-end', height: 48 }} onPress={navigateSignOut}/>
    </KeyboardAwareScrollView>
    
  )
}

const styles = StyleSheet.create({

  container: {
    width: '88%',
    alignSelf: 'center',
    // backgroundColor: '#48ABE3'
    // justifyContent: 'center'

  },
  image: {
    alignSelf: 'center',
    marginBottom: 30,
    marginTop: 60,
    height: 'auto',
    width: '95%',
    aspectRatio: 1 /1,
  },
  title:{
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
    marginLeft:5,
  },
  title2:{
    fontSize: 17,
    color: 'black',
    marginLeft:5,
    marginTop: 20,
    textAlign: 'center'
  },
  card:{
    marginVertical: 5,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    borderRadius: 30,
  },
  rrss:{
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: 20,
    paddingBottom: 20,
    paddingHorizontal: 10,
  },
})

export default SignInScreen

