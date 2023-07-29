import React, {useContext, useEffect, useState} from 'react';
import {View, Text, ScrollView, StatusBar, SafeAreaView, TouchableOpacity, Image} from 'react-native';
import { ProfileBody } from './ProfileBody';
import Favorites from './Favorites';
import useGetUserProfileResume from "../../Model/users/useGetUserProfileResume";
import Avatar from "../../Components/Avatar";
import emitter from "../../Emitter/emitter";
import {signOut} from "firebase/auth";
import {auth} from "../../Config/firebase";
import {AuthenticatedUserContext} from "../../Providers/AuthenticatedUserProvider";

const ProfileScreen = (props) => {
  const { setUser } = useContext(AuthenticatedUserContext);
  const [getResume, {data: dataResume, loading: isLoading, refetch}] = useGetUserProfileResume()
  const [resume, setResume] = useState()
  emitter.addListener('updateProfile', (data) => {refetch().catch(console.log)})
  emitter.addListener('closeSession', () => {
    signOut(auth).catch(error => console.log('Error logging out: ', error));
    setUser(null)
  })
  useEffect(() => {
    getResume().catch(console.log)
  }, [])
  useEffect(() => {
    if (!dataResume) return
    console.log({dataResume})
    setResume(dataResume.getResumeProfile)
  }, [dataResume])
  const onPressEditProfile = () => {
    // setIsEdit(!isEdit)
    props.navigation.navigate("EditProfile", {resume})
  }
  const openChat = (roomId) => {
    props.navigation.push('Comments', {
      id: roomId,
      type: 'USER',
      roomId
    })
  }
  return (
    <SafeAreaView style={{paddingTop: StatusBar.currentHeight, backgroundColor: 'white'}}>
      <View style={{height: '100%', backgroundColor: 'white'}}>
        <View style={{padding: 10}}>
          <ProfileBody
            name={resume?.firstName ?? ''}
            accountName="mr_peobody"
            profileImage={resume?.avatar ? {uri: resume.avatar.baseCdn + resume.avatar.folder + '/' + resume.avatar.image} : require('../../Storage/images/userProfile.png')}
            followers={resume?.statistics?.messages}
            following={resume?.statistics?.meLikes}
            post={resume?.statistics?.centersLikes}
            onPressEditProfile={onPressEditProfile}
          />
        </View>
        <View>
          <Text
            style={{
              padding: 10,
              letterSpacing: 1,
              fontSize: 14,
            }}>
            Chats Activos
          </Text>
          <ScrollView
            horizontal={true}
            showsHorizontalScrollIndicator={false}
            style={{
              paddingVertical: 5,
              paddingHorizontal: 10,
            }}>
              <View style={{marginRight: 20}}>
                <TouchableOpacity onPress={() => {openChat('64401ccd7954c2b58d61a8c4')}}>
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
                      source={require('../../Storage/icons/icon.png')}
                      style={{
                        resizeMode: 'cover',
                        width: '92%',
                        height: '92%',
                        borderRadius: 100,
                        backgroundColor: 'orange',
                      }}
                    />
                  </View>
                  <Text style={{alignSelf: 'center'}}>General</Text>
                </TouchableOpacity>
              </View>
            {
              resume?.chats?.map(
                (ele, index) => (
                  <View key={ele.id} style={{marginLeft: index > 0 ? 10 : 0}}>
                    <TouchableOpacity onPress={() => {openChat(ele.id)}}>
                      <Avatar image={ele.avatar} />
                    </TouchableOpacity>
                  </View>
                )
              )
            }
          </ScrollView>
        </View>        
        <Favorites navigation={props.navigation}/>
      </View>      
    </SafeAreaView>
  );
};

export default ProfileScreen;
