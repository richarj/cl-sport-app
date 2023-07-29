import { View, Text } from "react-native"

const EmptyList = ({message}) => {
    return (
        <View style={{alignItems: 'center'}}>
            <Text style={{fontWeight: '700', fontSize: 16, marginTop: 20}}>{message}</Text>
        </View>
    )
}

export default EmptyList