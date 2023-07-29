import { Modal, Pressable, StyleSheet, Text, View, ScrollView} from "react-native";
import React, {useState} from "react";
import { communesArray } from '../Config/data/communes'
import {CheckBox, Chip, Divider, ListItem, Switch as SwitchSport} from "react-native-elements";
import {FontAwesome} from "@expo/vector-icons";



import {
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
 let inet = 0
const SettingFilter = (props) => {
  const {isVisibleFilters, setIsVisibleFilters, filters, setFilters, sports: sportsArray} = props
  const [communes, setCommunes] = useState(communesArray.map(e => ({...e, isSelected: filters ? filters.communeIds.filter(c => c.id === e._id).length : false})))
  const [listControls, setListControls] = useState({control: '', isVisible: false})
  const [sports, setSports] = useState(
    !filters.isParalympic
      ?
        sportsArray.map(e => ({...e, isSelected: filters ? filters.sportIds.filter(c => c.id === e.id).length : false}))
      :
        sportsArray.filter(ele => ele.isParalympic === true).map(e => ({...e, isSelected: filters ? filters.sportIds.filter(c => c.id === e.id).length : false}))
  )
  const [listTemp, setListTemp] = useState([])
  const [isParalympic, setIsParalympic] = useState(filters.isParalympic)
  const insets = useSafeAreaInsets();
  const [backup, setBackup] = useState([])
  inet = insets

  const ToggleVisible = () => {
    setListControls({...listControls, isVisible: !listControls.isVisible})
  }

  const RemoveItem = (id, control) => {
    switch (control) {
      case "communes":
        setCommunes(
          communes.map(item =>
            item._id === id
              ? {...item, isSelected: false}
              : item
          )
        )
        break
      default:
        setSports(
          sports.map(item =>
            item.id === id
              ? {...item, isSelected: false}
              : item
          )
        )
    }
  }
  const changeList = (id, index) => {
    switch (listControls.control) {
      case "communes":
        const newCommunes = [...communes]
        newCommunes[index].isSelected = !newCommunes[index].isSelected
        setCommunes(newCommunes)
        if (!listTemp.filter(e => e.id === id).length) {
          listTemp.push({id, isSelected: !newCommunes[index].isSelected})
        }
        break
      default:
        const newSports = [...sports]
        newSports[index].isSelected = !newSports[index].isSelected
        setSports(newSports)
        if (!listTemp.filter(e => e.id === id).length) {
          listTemp.push({id, isSelected: !newSports[index].isSelected})
        }
    }
  }

  const cancel = () => {
    switch (listControls.control) {
      case "communes":
        setCommunes(communesArray.map(e => ({...e, isSelected: filters ? filters.communeIds.filter(c => c.id === e._id).length : false}))
                                 .map(
                                   item => {
                                     const temp = listTemp.find(ele => ele.id === item._id)
                                     if (!temp) return item
                                     return {...item, isSelected: temp.isSelected}
                                   }
                                 )
        )
        ToggleVisible()
        break
      default:
        setSports(sportsArray.map(e => ({...e, isSelected: filters ? filters.communeIds.filter(c => c.id === e.id).length : false}))
                             .map(
                               item => {
                                 const temp = listTemp.find(ele => ele.id === item.id)
                                 if (!temp) return item
                                 return {...item, isSelected: temp.isSelected}
                               }
                             )
        )
        ToggleVisible()
    }
  }
  const openControl = (control) => {
    setListControls({control: control, isVisible: true})
    setListTemp([])
  }
  const applyFilters = () => {
    setFilters({communes: communes.filter(e => e.isSelected), sports: sports.filter(e => e.isSelected), isParalympic})
    setIsVisibleFilters(!isVisibleFilters)
  }

  const filterParalimpyc = () => {
    if (!isParalympic) {
      setBackup([...sports])
      setSports(sports.filter(e => e.isParalympic === true))
    } else {
      if (backup.length) {
        setSports(backup)
        setBackup([])
      } else {
        setSports(sportsArray.map(e => ({...e, isSelected: filters ? filters.sportIds.filter(c => c.id === e.id).length : false})))
      }
    }
    setIsParalympic(!isParalympic)
  }
  return (
    <View>
      {!listControls.isVisible && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isVisibleFilters}
          onRequestClose={() => {
            setIsVisibleFilters(!isVisibleFilters);
          }}
        >
          <View style={stylesModal.centeredView}>
            <View style={stylesModal.modalView}>
              <ScrollView >
                
                <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 20}}>
                  <Text style={stylesModal.modalText}>Comunas</Text>
                  <FontAwesome
                    name="plus"
                    size={24}
                    color="black"
                    onPress={() => {openControl('communes')}}/>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20 }}>
                  {
                    communes.filter(e => e.isSelected)
                            .map((ele, i) => {
                              return (<Chip
                                key={ele._id}
                                title={ele.name}
                                icon={stylesModal.ver}
                                iconRight
                                containerStyle={{marginLeft: 6, marginTop: 5}}
                                onPress={() => {RemoveItem(ele._id, 'communes')}}
                              />)
                            })
                  }
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                  <Text style={stylesModal.modalText}>Deportes</Text>
                  <FontAwesome
                    name="plus"
                    size={24}
                    color="black"
                    onPress={() => {openControl('sports')}}/>
                </View>
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', paddingBottom: 20 }}>
                  {
                    sports.filter(e => e.isSelected)
                      .map((ele, i) => {
                        return (<Chip
                          key={ele.id}
                          title={ele.name}
                          icon={stylesModal.ver}
                          iconRight
                          containerStyle={{marginLeft: 6, marginTop: 5}}
                          onPress={() => {RemoveItem(ele.id, 'sports')}}
                        />)
                      })
                  }
                </View>
              </ScrollView>
              <Divider orientation="horizontal" />
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 7}}>
                <Pressable
                  style={[stylesModal.button, {backgroundColor: 'black'}]}
                  onPress={() => setIsVisibleFilters(!isVisibleFilters)}>
                  <Text style={stylesModal.textStyle}>Cancelar</Text>
                </Pressable>
                <Pressable
                  style={[stylesModal.button, stylesModal.buttonClose]}
                  onPress={() => applyFilters()}>
                  <Text style={stylesModal.textStyle}>Aplicar Filtros</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </Modal>
      )}

      <Modal
        animationType="fade"
        transparent={true}
        visible={listControls.isVisible}
        onRequestClose={() => {
          ToggleVisible()
        }}
      >
        <View style={[stylesModal.centeredView, {justifyContent: 'flex-start'}]}>
          <View style={[stylesModal.modalView, {elevation: 10, paddingTop: insets.top,
            paddingLeft: 10,
            paddingRight: 10, paddingBottom: 10}]}>
            <Text style={stylesModal.modalText}>{listControls.control === 'communes' ? 'Comunas' : 'Deportes'}</Text>
            
            <ScrollView>
              {
                listControls.control !== 'communes' && (
                  <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', paddingRight: 10}}>
                    <SwitchSport value={isParalympic} color="orange" onChange={filterParalimpyc}/>
                    <Text style={[stylesModal.modalText, {marginTop: 10, marginLeft: 10}]}>Filtrar Deportes paralimpicos</Text>
                  </View>
                )
              }            
              {
                listControls.control === 'communes'
                  ?
                    communes.map((ele, index) => {
                      return (
                        <ListItem key={ele._id} bottomDivider>
                          <ListItem.Content>
                            <ListItem.Title>{ele.name}</ListItem.Title>
                          </ListItem.Content>
                          <CheckBox
                            checked={ele.isSelected}
                            containerStyle={{margin: 0, padding: 0}}
                            onPress={() => {changeList(ele._id, index)}}
                          />
                        </ListItem>
                      )
                    })
                  :
                    sports.map((ele, index) => {
                      return (
                        <ListItem key={ele.id} bottomDivider>
                          <ListItem.Content>
                            <ListItem.Title>{ele.name}</ListItem.Title>
                          </ListItem.Content>
                          <CheckBox
                            checked={ele.isSelected}
                            containerStyle={{margin: 0, padding: 0}}
                            onPress={() => {changeList(ele.id, index)}}
                          />
                        </ListItem>
                      )
                    })
              }
            </ScrollView>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: 7}}>
              <Pressable
                style={[stylesModal.button, {backgroundColor: 'black'}]}
                onPress={cancel}>
                <Text style={stylesModal.textStyle}>Cancelar</Text>
              </Pressable>
              <Pressable
                style={[stylesModal.button, stylesModal.buttonClose]}
                onPress={ToggleVisible}>
                <Text style={stylesModal.textStyle}>Seleccionar</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  )
}

export default SettingFilter

export const stylesModal = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    //marginTop: 22,
  },
  modalView: {
    //margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    //alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 1,
      height: 2,
    },
    shadowOpacity: 0.55,
    shadowRadius: 4,
    elevation: 5,
    height: '50%',
    width: '100%'
  },
  button: {
    borderRadius: 10,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: '#F194FF',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center'
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'left',
    fontWeight: 'bold',
    fontSize: 18
  },
  ver: {
    name: "close",
    type: "font-awesome",
    size: 20,
    color: "white",
  },
  modalPadding: {
    elevation: 10,
    paddingTop: inet.top,
    paddingLeft: 10,
    paddingRight: 10, paddingBottom: 10
  }
});