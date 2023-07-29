import { StyleSheet, View } from 'react-native'
import MapView, {PROVIDER_GOOGLE} from "react-native-maps";

const MapScreen = props => {
    return (
        <View style={styles.container}>
            <MapView style={styles.map} provider={PROVIDER_GOOGLE}/>
        </View>
    )
}

export default MapScreen

const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    map: {
      width: '100%',
      height: '100%',
    },
});