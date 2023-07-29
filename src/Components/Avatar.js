import React from 'react'
import {Image, View} from 'react-native'

const Avatar = ({image}) => {
  return (
    <View
      style={{
        width: 68,
        height: 68,
        backgroundColor: 'white',
        borderWidth: 1.8,
        borderRadius: 100,
        borderColor: '#c13584',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <Image
        source={image ? {uri: image.baseCdn + image.folder + '/' + image.image} : require('../Storage/images/userProfile.png')}
        style={{
          resizeMode: 'cover',
          width: '92%',
          height: '92%',
          borderRadius: 100,
          backgroundColor: 'orange',
        }}
      />
    </View>
  )
}

export default  Avatar