import { View, Text, Image, StyleSheet, ImageBackground } from 'react-native'
// import { moderateScale } from 'react-native-size-matters'
// import { Path, Svg } from 'react-native-svg'

const Bubble = ({data, userOwn}) => {
    
    // let ImageView = <></>;
    // if (data.attachments.length) {
    //     ImageView = <View style={{width: 200, height: 200, marginBottom: 10}}>
    //                     <ImageBackground source={{uri: data.attachments[0].baseCdn}} style={{height: '100%', width: '100%'}}/>
    //                 </View>;
    // }
    return (
        <View>
            <Text>Hola</Text>
        </View>
        // <View style={{marginTop: 7}}>
        //     {
        //         data.author.id === userOwn.id
        //             ?
        //                 <View style={[styles.item, styles.itemIn, {alignItems: 'center'}]}>
        //                     <View
        //                         style={{
        //                             width: 48,
        //                             height: 48,
        //                             backgroundColor: 'white',
        //                             borderWidth: 1.8,
        //                             borderRadius: 100,
        //                             borderColor: '#c13584',
        //                             justifyContent: 'center',
        //                             alignItems: 'center',
        //                             marginRight: 7
        //                         }}>
        //                         <Image
        //                             source={data?.author?.avatar ? {uri: data?.author?.avatar} : require('../Storage/images/userProfile.png')}
        //                             style={{
        //                             resizeMode: 'cover',
        //                             width: '92%',
        //                             height: '92%',
        //                             borderRadius: 100,
        //                             backgroundColor: 'orange',
        //                             }}
        //                         />
        //                     </View>
        //                     <View style={[styles.balloon, {backgroundColor: 'grey'}]}>
        //                         <Text style={{paddingTop: 5, color: 'white'}}>{data.content}</Text>
        //                         <View
        //                             style={[
        //                                 styles.arrowContainer,
        //                                 styles.arrowLeftContainer,
        //                             ]}
        //                         >
        //                             <Svg style={styles.arrowLeft} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.484 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
        //                                 <Path
        //                                     d="M38.484,17.5c0,8.75,1,13.5-6,17.5C51.484,35,52.484,17.5,38.484,17.5z"
        //                                     fill="grey"
        //                                     x="0"
        //                                     y="0"
        //                                 />
        //                             </Svg>
        //                         </View>
        //                     </View>                                
        //                 </View>
        //             :
        //                 <View style={[styles.item, styles.itemOut, {alignItems: 'center'}]}>
        //                     <View style={[styles.balloon, {backgroundColor: '#1084ff'}]}>
        //                         <View>
        //                             {ImageView}
        //                             <Text style={{paddingTop: 5, color: 'white'}}>{data.content}</Text>
        //                         </View>
        //                         <View
        //                             style={[
        //                                 styles.arrowContainer,
        //                                 styles.arrowRightContainer,
        //                             ]}
        //                         >
        //                             <Svg style={styles.arrowRight} width={moderateScale(15.5, 0.6)} height={moderateScale(17.5, 0.6)} viewBox="32.485 17.5 15.515 17.5"  enable-background="new 32.485 17.5 15.515 17.5">
        //                                 <Path
        //                                     d="M48,35c-7-4-6-8.75-6-17.5C28,17.5,29,35,48,35z"
        //                                     fill="#1084ff"
        //                                     x="0"
        //                                     y="0"
        //                                 />
        //                             </Svg>
        //                         </View>
        //                     </View>
        //                     <View
        //                         style={{
        //                             width: 48,
        //                             height: 48,
        //                             backgroundColor: 'white',
        //                             borderWidth: 1.8,
        //                             borderRadius: 100,
        //                             borderColor: '#c13584',
        //                             justifyContent: 'center',
        //                             alignItems: 'center',
        //                             marginLeft: 7
        //                         }}>
        //                         <Image
        //                             source={data?.author?.avatar ? {uri: data?.author?.avatar} : require('../Storage/images/userProfile.png')}
        //                             style={{
        //                             resizeMode: 'cover',
        //                             width: '92%',
        //                             height: '92%',
        //                             borderRadius: 100,
        //                             backgroundColor: 'orange',
        //                             }}
        //                         />
        //                     </View>
        //                 </View>
            
        //     }
        // </View>
    )
}

export default Bubble

// const styles = StyleSheet.create({
//     item: {
//         marginVertical: moderateScale(7, 2),
//         flexDirection: 'row'
//      },
//      itemIn: {
//          marginLeft: 0
//      },
//      itemOut: {
//         alignSelf: 'flex-end',
//         marginRight: 0
//      },
//      balloon: {
//         maxWidth: '100%',
//         width: 'auto',
//         paddingHorizontal: moderateScale(10, 2),
//         paddingTop: moderateScale(5, 2),
//         paddingBottom: moderateScale(7, 2),
//         borderRadius: 20,
//      },
//      arrowContainer: {
//          position: 'absolute',
//          top: 0,
//          left: 0,
//          right: 0,
//          bottom: 0,
//          zIndex: -1,
//          flex: 1
//      },
//      arrowLeftContainer: {
//          justifyContent: 'flex-end',
//          alignItems: 'flex-start'
//      },
 
//      arrowRightContainer: {
//          justifyContent: 'flex-end',
//          alignItems: 'flex-end',
//      },
 
//      arrowLeft: {
//          left: moderateScale(-6, 0.5),
//      },
 
//      arrowRight: {
//          right:moderateScale(-6, 0.5),
//      }
// })