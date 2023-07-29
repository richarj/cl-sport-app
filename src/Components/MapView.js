import { View } from "react-native"
import MapView ,{Marker, PROVIDER_GOOGLE} from "react-native-maps";


const MapScene = ({route}) => {
    const {center} = route.params
    const initialRegion = {
        latitude: center.latitude,
        longitude: center.longitude,
        latitudeDelta: 0.2,
        longitudeDelta: 0.2,
    }
    const region = {
      latitude: center.latitude,
      longitude: center.longitude,
      latitudeDelta: 0.2,
      longitudeDelta: 0.2,
    }
    console.log({region})
    return (
        <View style={{ flex: 1}}>
            <MapView initialRegion={initialRegion}
                 style={{flex:1}}
                 provider={PROVIDER_GOOGLE}
            >
                <Marker
                    coordinate={{ latitude: center.latitude, longitude: center.longitude }}
                />
            </MapView>
        </View>
    )
}

export default MapScene