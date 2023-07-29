import { Modal, StyleSheet, View } from 'react-native'
import { useSafeAreaInsets } from 'react-native-safe-area-context';

let inet = 0

const BottomSheet = props => {
    const {isVisible} = props
    const insets = useSafeAreaInsets();
    inet = insets
    return (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isVisible}
          onRequestClose={() => {
            
          }}
        >
            <View style={stylesModal.centeredView}>
                <View style={stylesModal.modalView}>
                    {props.children}
                </View>
            </View>
        </Modal>
    )
}

export default BottomSheet

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
      borderTopRightRadius: 20,
      borderTopLeftRadius: 20,
      padding: 35,
      paddingTop: 10,
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