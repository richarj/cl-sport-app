import {useState} from 'react'
import { Text, View, StyleSheet, Alert, ScrollView, TouchableOpacity } from 'react-native'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'

import { useForm } from 'react-hook-form'
import CustomInput from '../../Components/CustomInput'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth'
import { auth, app } from '../../Config/firebase'
import { getDatabase, ref, set } from 'firebase/database'
import { communesArray } from '../../Config/data/communes'
import createUserFromApp from '../../Model/users/createUserFromApp'
import { Button, Overlay, Divider, CheckBox } from 'react-native-elements';


export default function SignUpScreen({ navigation }) {
  const navigateSignIn = () => navigation.navigate('SignInScreen')
  const [communes, setCommunes] = useState([...communesArray])
  const [loading, setLoading] = useState(false)
  const { control, handleSubmit, watch, reset } = useForm({ mode: 'onBlur', reValidateMode:'onBlur',
    defaultValues: {
      // name: '',
      email: '',
      password: 'casa9976',
      repeatPassword: 'casa9976'
    }
  })

  const [visible, setVisible] = useState(false);
  const [commune, setCommune] = useState(null)
  const toggleOverlay = () => {
    setVisible(!visible);
  };
  //submit, loading, error, data
  const { submit: setUserToBackend, loading: loadingCreateUser } = createUserFromApp((result) => {    
    Alert.alert(null, 'Te hemos enviado un vínculo para verificar tu dirección de correo electrónico. Luego podrás iniciar sesión.')
    navigateSignIn()
  },
  (error) => {console.log({error: JSON.stringify(error)})}
  )
  const addUser = async (uuid, email, firstName, lastName, imageUrl) => {
    const db = getDatabase(app);
    set(ref(db, 'accounts/' + uuid), {
      uuid,
      email,
      firstName,
      lastName,
      profile_picture : imageUrl
    }).catch(
      err => {
        console.log('*** ', JSON.stringify(err))
      }
    )
  }

  const handleOnPress = ({ email, password}) => {
    setLoading(true);


    createUserWithEmailAndPassword(auth, email, password)
      .then(res => {
        addUser(res.user.uid, email, '', '', '')
        const newForm = {
          uuid: res.user.uid,
          email,
          firstName: '',
          lastName: '',
          regionId: '627ee09b520dd456c7d88857',
          communeId: commune._id
        }
        sendEmailVerification(res.use)
        setUserToBackend({userInput: newForm})
      })
      .catch(err => {
        console.log({err})
        Alert.alert(null, 'Dirección de correo ya se encuentra en uso')
        reset()
      })
      .finally(() => setLoading(false))
  }

  const changeCommune = (id) => {
    const newCommunes = communesArray.map((item) => ({...item, isSelected: false}))
    newCommunes[id].isSelected = true
    setCommunes(newCommunes)
    setCommune(newCommunes[id])
  }

  return (
    <>
      <KeyboardAwareScrollView contentContainerStyle={styles.container} style={{backgroundColor: '#48ABE3'}}>

        <View style={styles.msgContainer}>
          <Text style={styles.txt}>
            Crea tu cuenta y te enviaremos un vínculo para verificar tu dirección de correo electrónico.
          </Text>
        </View>


        <CustomInput placeholder="Correo" name="email" keyboardType="email-address" autoCapitalize="none" control={control}
                     rules={{
                       required: 'Ingresa tu correo',
                       pattern: {value: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, message: 'Ingresa un correo válido'}
                     }}/>

        <View

        >
          <View
            style={[styles.falseInput]}>
            <Text style={[styles.falsePlaceholder, {color: commune === null ? '#ABB2C9' : '#000'}]} onPress={toggleOverlay}>{commune?.name ?? 'Comuna'}</Text></View>
        </View>

        <CustomInput placeholder="Contraseña" name="password" control={control} secureTextEntry={true}
                     rules={{
                       required: 'Ingresa tu contraseña',
                       minLength: {value: 6, message: 'La contraseña debe tener almenos 6 caracteres'}
                     }}/>

        <CustomInput placeholder="Repite tu contraseña" name="repeatPassword" control={control} secureTextEntry={true}
                     rules={{
                       validate: value => value === watch('password') || 'Las contraseñas no coinciden'
                     }}/>

        <Button title="Crea tu cuenta" titleStyle={{ fontSize: 17, fontWeight: 'bold' }} containerStyle={{marginTop: 10, marginBottom: 5, borderRadius:50}} onPress={handleSubmit(handleOnPress)} loading={loading} buttonStyle={{ height: 48, backgroundColor: "#2D7CBF",}}/>
        <Button title="Inicia sesión" type="clear" titleStyle={{ fontSize: 17, color: 'white' }} containerStyle={{marginVertical: 5,}} onPress={navigateSignIn} buttonStyle={{ height: 48}}/>
      </KeyboardAwareScrollView>

      <Overlay isVisible={visible} onBackdropPress={toggleOverlay} overlayStyle={{width: '80%', height: '60%', borderRadius: 7}}>
        <Text style={styles.headerText}>Comunas</Text>
        <Divider orientation="horizontal" style={{marginTop: 2}} />
        <View style={{height: '90%'}}>
          <ScrollView>
            {
              communes.map(
                (item, index) => (
                  <CheckBox
                    key={`com-${index}`}
                    title={item.name}
                    checked={item.isSelected}
                    checkedIcon='dot-circle-o'
                    uncheckedIcon='circle-o'
                    containerStyle={{backgroundColor: 'transparent', borderColor: 'transparent', margin: 0, padding: 0, paddingVertical: 7, marginTop: index === 0 ? 10 : 0}}
                    onPress={() => {changeCommune(index)}}
                  />
                )
              )
            }
          </ScrollView>
        </View>
        <Divider orientation="horizontal" style={{marginTop: 5, marginBottom: 2}} />
        <View style={styles.containerBottom}>
          {/* <TouchableOpacity onPress={toggleOverlay}>
          <Text style={styles.buttonText}>Seleccionar</Text>
        </TouchableOpacity> */}
          <TouchableOpacity onPress={toggleOverlay}>
            <Text style={[styles.buttonText, styles.noBlod]}>Aceptar</Text>
          </TouchableOpacity>
        </View>
      </Overlay>
    </>
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
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    marginTop: 10,
    backgroundColor: '#0066cc',
    borderRadius: 10,
    padding: 15,
    width: '80%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
  },
  containerBottom: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  noBlod: {
    fontWeight: 'normal'
  },
  falseInput: {
    paddingHorizontal: 20,
    height: 48,
    fontSize: 18,
    marginVertical: 5,
    width: "100%",
    backgroundColor: "white",
    borderRadius: 50,
    justifyContent: 'center',
  },
  falsePlaceholder: {
    fontSize: 17
  }
})