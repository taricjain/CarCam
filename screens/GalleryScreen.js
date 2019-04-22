import React from 'react';
import { View, ScrollView, Text, 
   AsyncStorage, TouchableHighlight, 
   Modal, RefreshControl, Image } from 'react-native';
import Moment from 'moment';
import { Video } from 'expo';
import { styles } from '../styles/GalleryScreenStyles';

export default class GalleryScreen extends React.Component {
   constructor(props) {
      super(props);
   }
   static navigationOptions = { 
      title: 'Video Gallery',
   };

   state = {
      videos: [],
      focusedScreen: false,
      toPlay: null,
      modalVisible: false,
      refreshing: false,
      groupDate: null,
   };

   setModalVisible(visible) {
      this.setState({ modalVisible: visible });
   }

   _onRefresh = async() => {
      this.setState({ refreshing: true });
      
      this._fetchVideosAsync();
      
      this.setState({ refreshing: false });
      console.log("INFO: refresh complete!");
   }

   render() {
      let { focusedScreen, videos } = this.state;
      console.log("INFO: video count = " + videos.length);

      if (videos.length > 0 && focusedScreen) {
         return (
            <View style={{ flex: 1 }}>
               {this.renderGallery()}
               {this.renderModal(this.state.toPlay)}
            </View>
         );
      } else if (videos.length === 0 && focusedScreen) {
         return (
            <View style={styles.centerContent}>
               <ScrollView style={styles.flex}
                  refreshControl={
                     <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh} />
                  }>
                  <Text style={styles.introText}>
                     Start driving to save videos.
                  </Text>
                  <Text style={styles.introText}>
                     Pull down to refresh!
                  </Text>
               </ScrollView>
            </View>
         );
      } else {
         return (
            <View style={styles.centerContent}>
               <Text style={styles.introText}>
                  Start driving to save videos.
               </Text>
               <Text style={styles.introText}>
                  Pull down to refresh!
               </Text>
            </View>
         );
      }
   }

   renderModal(playThis) {
      return (
         <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            onRequestClose={() => {
               this.setModalVisible(!this.state.modalVisible);
               this._onRefresh;
            }}>
            <View style={styles.flex}>
               <Video
                  source={{ uri: playThis }} 
                  style={styles.video}
                  rate={1.0}
                  isMuted={true}
                  resizeMode='cover'
                  shouldPlay
                  useNativeControls
               />
               <TouchableHighlight
                  onPress={() => {
                     this.setModalVisible(!this.state.modalVisible);
                     this._onRefresh;
                  }}
                  style={styles.button}>
                     <Text style={styles.buttonText}>Exit</Text>
               </TouchableHighlight>
            </View>
         </Modal>
      );
   }

   getDay(timestamp) {
      return Moment(timestamp).format("dddd, MMMM Do YYYY");
   }

   getTime(timestamp) {
      return Moment(timestamp).format("h:mm:ss a");
   }

   renderGallery() {
      return (
         <ScrollView style={styles.flex}
            refreshControl={
               <RefreshControl
                  refreshing={this.state.refreshing}
                  onRefresh={this._onRefresh} />
            }>
            {this.state.videos.map( ({ timestamp, value }, index) => (
               this.renderByDay(timestamp, value, index)
            ))}
         </ScrollView>
      );
   }

   renderByDay(key, value, index) {
      let header;
      if (!Moment(Moment(key).format("YYYY-MM-DD")).isSame(this.state.groupDate) && index != 0) {
         header = <Text style={styles.videoDate}>{this.getDay(key)}</Text>;
         this.state.groupDate = Moment(Moment(key).format("YYYY-MM-DD"));
      } else if (index === 0) {
         header = <Text style={styles.videoDate}>{this.getDay(key)}</Text>;
      }

      return (
         <View style={styles.galleryCard} key={value.uri}>
            {header}
            <View style={styles.videoRow}>
               <Image
                  source={{ uri: value.uri }} 
                  rate={1.0}
                  isMuted={true}
                  resizeMode="cover"
                  style={styles.galleryImage} />
               <View style={{flexDirection: "column", alignItems: 'center', alignSelf: 'center'}}>
                  <Text style={{fontSize: 20}}>
                     {this.getTime(key)}
                  </Text>
                  <Text style={{fontSize: 20}}>
                     Flag: {JSON.stringify(value.flag)}
                  </Text>
               </View>
               <TouchableHighlight 
                  style={styles.viewModalButton}
                  onPress={() => {
                     this.setModalVisible(true);
                     this.setState({ toPlay: value.uri });
                  }}>
                  <Text style={styles.buttonText}>
                     Play
                  </Text>
               </TouchableHighlight>
            </View>
         </View>
      );
   }

   _fetchVideosAsync() {
      return new Promise((resolve, reject) => {
         AsyncStorage.getAllKeys((err, keys) => {
            let uris = [];
            AsyncStorage.multiGet(keys, (err, stores) => {
               stores.map((result, i, store) => {
                  let key = store[i][0];
                  let value = JSON.parse(store[i][1]);
                  const val = {
                     uri: value.uri,
                     flag: value.flag
                  }
                  uris.push({ timestamp: key, value: val });
               });
               this.setState({ videos: uris.reverse() });
               try {
                  this.setState({ groupDate: Moment(Moment(this.state.videos[0].timestamp).format("YYYY-MM-DD"))});
               } catch(e) {
                  this.setState({ groupDate: new Date() });
               }
            })
            .catch(() => {
               console.log("ERROR: couldn't get values");
            }); 
         })
         .catch(() => {
            console.log("ERROR: couldn't' get keys");
         });
      });
   }

   async componentDidMount() {
      this._fetchVideosAsync()
      .then((resp) => {
         console.log(resp);
      });

      let { navigation } = this.props;
      navigation.addListener('willFocus', () =>
         this.setState({ focusedScreen: true })
      );
      navigation.addListener('willBlur', () =>
         this.setState({ focusedScreen: false }),
      );
   }
}