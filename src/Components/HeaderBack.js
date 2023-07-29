import { Text, View, StyleSheet,} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Button from '../Components/Button'

export default function HeaderBack({ title, OnPress }) {
  return (
    <View style={styles.back}>
      <Button OnPress={OnPress} Icon={Ionicons} IconName='arrow-back-sharp' size={34}/>
      <Text style={styles.title}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back:{
    marginHorizontal: 17,
    // height: 44.5,
    height: 48,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },  
  title: {
    fontSize: 25,
    fontWeight: 'bold',
    flex:1,
    textAlign: 'right',
  },
})