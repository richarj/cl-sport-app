import {TouchableOpacity, Text, View} from "react-native";
import {MaterialCommunityIcons} from "@expo/vector-icons";
import React from "react";
import Avatar from "./Avatar";

const UserLike = ({data, onClickComments}) => {
  const displayComments = (id, type) => {
    onClickComments(id, type)
  }
  return (
    <View
      key={data.id}
      style={{marginTop: 12}}
    >
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          width: '100%',
          justifyContent: 'space-between'
        }}>
          <View style={{flexDirection: 'row'}}>
          <Avatar image={data.avatar} />
          <View style={{paddingLeft: 10, flexDirection: 'column'}}>
            <Text
              style={{
                fontSize: 16,
                opacity: data.id == 0 ? 1 : 0.5,
              }}>
              {data.firstName} {data.lastName}
            </Text>
            <View style={{
              width: '100%', marginTop: 8, flexDirection: 'row'
            }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <MaterialCommunityIcons name="comment-multiple-outline" size={22} color="black" />
                <Text> Commentarios: {data.comments}</Text>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', marginLeft: 14}}>
                <MaterialCommunityIcons name="heart-multiple" size={22} color='red'/>
                <Text> likes: {data.likesLocations.length}</Text>
              </View>
            </View>
          </View>
        </View>
        <TouchableOpacity onPress={() => {displayComments(data.id, 'USER')}}>
          <MaterialCommunityIcons name="comment-multiple-outline" size={22} color="black" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default  UserLike