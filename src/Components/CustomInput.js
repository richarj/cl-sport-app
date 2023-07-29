import { Text, TextInput, StyleSheet } from 'react-native'
import { Controller} from 'react-hook-form'

const CustomInput = ({control, name, placeholder, secureTextEntry, rules, keyboardType, autoCapitalize, color, style, initialValue, keys}) => {
  return <Controller
    control={control}
    name={name}
    rules={rules}
    //defaultValue={initialValue}
    render={({ field: { onChange, onBlur, value }, fieldState: { error }}) => (
      <>
        <TextInput
          // autoComplete="off"
          value={value}
          onChangeText={onChange}
          onBlur={onBlur}
          placeholder={placeholder}
          secureTextEntry={secureTextEntry}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          style={[!color ? styles.input :styles.inputBlack, style]}/>

        {error && (<Text style={styles.warning}>{error.message || 'error'}</Text>)}
      </>
    )}/>
}

export default CustomInput

const styles = StyleSheet.create({
  input: {
    paddingHorizontal: 20,
    height: 48,
    fontSize: 17,
    marginVertical: 5,

    borderRadius: 50,
    width: "100%",
    backgroundColor: "white",
  },
  warning:{
    alignSelf:"flex-start",
    fontSize: 16,
    marginHorizontal: 5,
    marginBottom: 10,
    color: 'white'
    // color:"whitesmoke",
  },
  inputBlack: {
    paddingHorizontal: 20,
    height: 48,
    fontSize: 17,
    marginVertical: 5,

    borderRadius: 50,
    width: "100%",
    backgroundColor: "whitesmoke",
  }
});