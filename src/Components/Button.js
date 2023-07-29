import { TouchableOpacity, } from 'react-native'

export default function Button({ OnPress, Icon, IconName, size, style }) {

  return <TouchableOpacity style={style} onPress={OnPress}>

    <Icon name={IconName} size={size} />

  </TouchableOpacity>
}