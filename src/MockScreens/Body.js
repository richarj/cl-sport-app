import React from 'react'
import { Text, View } from 'react-native'

const Body = props => {
    const {content} = props
    return (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>{content}</Text>
        </View>
    )
}

export default Body