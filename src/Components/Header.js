import { Text, View, StyleSheet, } from 'react-native';

export default function Header({ title }) {

  return (
    <View style={styles.back}>
      <Text style={styles.title}>
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  back:{
    paddingHorizontal: 17,
    // height: 44.5,
    height: 48,

    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: 'white',
  },  
  title: {
    fontSize: 25,
    fontWeight: 'bold',
  },
})