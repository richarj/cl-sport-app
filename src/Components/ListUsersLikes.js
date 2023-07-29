import { Modal, View, Dimensions, FlashList } from "react-native";
import React, {useContext, useEffect, useState} from 'react'
import { stylesModal } from './SettingFilter'
import { AntDesign } from '@expo/vector-icons'
import useGetUsersLikes from '../Model/users/useGetUsersLikes'
import UserLike from './UserLike'
import EmptyList from '../Components/EmptyList'
import ActionsContext from "../Contexts/ActionsContext";

const ListUsersLikes = ({isVisible, setIsVisible, id, showComments}) => {
  const {action} = useContext(ActionsContext)
  const [refreshing, setRefreshing] = useState(false)
  const [getUsers, {data: dataUsers, loading: isLoading, error}] = useGetUsersLikes()
  const [hasNext, setHasNext] = useState(false)
  const [next, setNext] = useState('')
  const [users, setUsers] = useState([])
  const [onEndReachedCalledDuringMomentum, setOnEndReachedCalledDuringMomentum] = useState(true)
  const baseQuery = {
    locationIds: [id],
    limit: 10,
    next: '',
    previous: '',
    sortField: 'firstName',
    search: ''
  }
  const [query, setQuery] = useState({ ...baseQuery })
  useEffect(() => {
    if (!id) return
    getUsers({
      variables: {
        ...query,
        next
      }
    }).catch(e => console.log({error: e}))
  }, [id])
  useEffect(() => {
    if (!dataUsers) return
    setHasNext(dataUsers.getUsersPaginated.hasNext ?? false)
    setNext(dataUsers.getUsersPaginated.next)
    const temp = refreshing ? [] : users
    setUsers([
      ...temp,
      ...dataUsers.getUsersPaginated.docs.filter(user => user.id !== action?.userId)
    ])
    setRefreshing(false)
  }, [dataUsers])
  const clickNext = () => {
    if (hasNext) {
      getUsers({
        variables: {
          ...query,
          next
        }
      })
    }
  }
  const flattenData = users?.flatMap((page) => page) ?? [];
  return (
    <View style={{ flex: 1}}>
      <Modal
        animationType="fade"
        transparent={true}
        visible={isVisible}
        onRequestClose={() => {
          setIsVisible(!isVisible)
        }}
      >
        <View style={[stylesModal.centeredView, {flex: 1, height: '100%', width: Dimensions.get("screen").width}]}>
          <View style={[stylesModal.modalView, stylesModal.modalPadding, {height: '80%', paddingTop: 10, paddingLeft: 10, width: Dimensions.get("screen").width}]}>
            <AntDesign name="close" size={24} color="black" style={{alignSelf: 'flex-end'}} onPress={() => { setIsVisible(!isVisible) }}/>
            <View style={{flex: 1, height: '100%'}}>
              <FlashList
                keyExtractor={(item) => item.id}
                data={flattenData}
                renderItem={({ item }) => <UserLike data={item} key={item.id} onClickComments={(id, type) => {showComments(id, type)}} />}
                onEndReached = {()=>{

                  if (!onEndReachedCalledDuringMomentum) {
                    clickNext()
                    setOnEndReachedCalledDuringMomentum(true)
                  }
                }}
                estimatedItemSize={10}
                onEndReachedThreshold={0.001}
                onMomentumScrollBegin={() => { setOnEndReachedCalledDuringMomentum(false) }}
                refreshing={refreshing}
                contentContainerStyle={{ paddingBottom: 20 }}
                ListEmptyComponent={<EmptyList message='No se usuarios con like en este centro' />}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default ListUsersLikes

