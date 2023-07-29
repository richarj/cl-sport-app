import { useState, useContext } from 'react';
import { Text, View, StyleSheet, Alert,} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';


import { useForm } from 'react-hook-form';
import CustomInput from '../../Components/CustomInput';
import { Button } from 'react-native-elements';

import { auth } from '../../Config/firebase';
import { deleteUser, signInWithEmailAndPassword } from "firebase/auth";

import {AuthenticatedUserContext} from "../../Providers/AuthenticatedUserProvider";

export default function SignOutScreen({ navigation }) {
  const { _, setUser } = useContext(AuthenticatedUserContext);
  const navigateSignIn = () => navigation.navigate('SignInScreen')
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit } = useForm({ mode: 'onBlur', reValidateMode:'onBlur',
    defaultValues: {
      email: '',
      password: '',
    }
  })



  const handleOnPress = ({ email, password}) => {
    setLoading(true);

    signInWithEmailAndPassword(auth, email, password)
      .then(({user}) => {
        setUser(null)
        deleteUser(user)
          .then(res => Alert.alert(null, 'Tu cuenta ha sido eliminada'))
          .catch(err => Alert.alert(null, 'Se ha producido un error'))
      })
      .catch(err => Alert.alert(null, 'Correo o clave incorrecta') )
      .finally(() => {
        setUser(null)
        navigateSignIn()
      })
  };

  return (
    <KeyboardAwareScrollView contentContainerStyle={styles.container} style={{backgroundColor: '#48ABE3'}}>

      <View style={styles.msgContainer}>
        <Text style={styles.txt}>
          Para darte de baja de Chile Hace Deporte ingresa tu correo y contraseña.
        </Text>
      </View>


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

      <Button title="Elimina tu cuenta" titleStyle={{ fontSize: 17, fontWeight: 'bold',}} containerStyle={{marginTop: 10, marginBottom: 5, borderRadius: 50,}} onPress={handleSubmit(handleOnPress)} loading={loading} buttonStyle={{ height: 48, backgroundColor: "#2D7CBF",}}/>
      <Button title="Volver" type="clear" titleStyle={{ fontSize: 17, color: 'white' }} containerStyle={{marginVertical: 5,}} onPress={navigateSignIn} buttonStyle={{ height: 48}}/>


    </KeyboardAwareScrollView>
  )
}


export const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '88%',
    alignSelf: 'center',
    justifyContent: 'center'
  },
  msgContainer: {
    marginVertical: 5,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderRadius: 30,
    marginBottom: 15,
  },
  txt: {
    fontSize: 17
  },
})
