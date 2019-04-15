import React from 'react';
import { Camera, Permissions, Location } from 'expo';
import { Text, View, Alert, TouchableHighlight, 
   AsyncStorage } from 'react-native';

import { styles } from '../styles/HomeScreenStyles';

export default class HomeScreen extends React.Component {
   constructor(props) { 
      super(props);
      this.render = this.render.bind(this);
   }

   static navigationOptions = { 
      headerStyle: { 
         display: 'none' 
      } 
   };

   state = {
      hasCameraPermissions: null,
      focusedScreen: false,
      pressed: false,
      counter: 0,
      flag: null,
      prevLocation: {
         latitude: 0,
         longitude: 0,
         accuracy: 0,
         heading: 0,
         speed: 0,
         timestamp: 0
      },
      currLocation: {
         latitude: 0,
         longitude: 0,
         accuracy: 0,
         heading: 0,
         speed: 0,
         timestamp: 0
      },
      cameraConfig: {
         type: Camera.Constants.Type.back,
         autoFocus: 'on',
         ratio: '16:9',
      },
      recordingConfig: {
         quality: Camera.Constants.VideoQuality['480p'],
         maxDuration: 30,
         mute: true,
      },
      currentPositionConfig: {
         accuracy: Location.Accuracy.High,
         maximumAge: 2000,
      }
   };

   render() {
      return (
         <View style={{ flex: 1 }}>
            {this.renderCamera()}
         </View>
      );
   }

   renderCamera() {
      const { 
         hasCameraPermissions, 
         focusedScreen, 
         cameraConfig } = this.state;
      if (hasCameraPermissions === null || !focusedScreen) {
         return <View style={styles.content} />;
      } else if (hasCameraPermissions === false) {
         return (
            <View style={styles.content}>
               <Text style={styles.permissionsText}>
                  Please enable permissions to access the camera.
               </Text>
            </View>
         );
      } else if (focusedScreen) {
         this._watchPosition();
         return (
            <Camera 
               ref={(ref) => this.camera = ref } 
               style={styles.cameraView}
               ratio={cameraConfig.ratio}
               autoFocus={cameraConfig.autoFocus}
               type={cameraConfig.type}>
               
               <Text style={styles.text}>
                  {this.state.currLocation.speed}
               </Text>

               <View style={styles.recordRow}>
                  <TouchableHighlight 
                     activeOpacity={1}
                     style={styles.recordButtonRing}
                     onPress={() => this._toggleRecording()}>
                     
                     <View style={this.state.pressed
                        ? styles.recordButtonInnerPressed
                        : styles.recordButtonInner} />
                  </TouchableHighlight>
               </View>
            </Camera>
         );
      }
   }

   async _toggleRecording() {
      if (this.state.pressed) {
         clearInterval();
         this.camera.stopRecording();
      } else if (!this.state.pressed){
         this._startRecording();
         setInterval(async() => {
            console.log('started')
            await this._startRecording();
            console.log('another');
         }, 30000);
      }
      this.setState({ pressed: !this.state.pressed });
   }

   async _startRecording() {
      this.camera.recordAsync(this.state.recordingConfig)
      .then(async data => {
         this._saveVideo(data);
         console.log('INFO: videos = ' + this.state.counter);
      })
      .catch(function() {
         console.log('ERROR: error while recording.');
      });
      this.camera.stopRecording();
   }

   _saveVideo = async (data) => {
      let key = new Date();
      const value = JSON.stringify({ 
            uri: data.uri, 
            flag: this.state.flag 
         });
      try {
         await AsyncStorage.setItem(key, value)
         .then(() => {
            Alert.alert(
               'Recording stopped',
               'Video has been saved.',
               [{ text: 'Okay' }],
            );
            this.state.counter += 1;
         });
      } catch (error) {
         console.log("ERROR: error saving data.");
      }
   };

   async _watchPosition() {
      Location.watchPositionAsync( 
         { timeInterval: 2000, distanceInterval: 10,
         accuracy: Location.Accuracy.High },
         this.locationChanged);
      this._speedChanges(this.state.currLocation, 
         this.state.prevLocation);
   }

   locationChanged = (location) => {
      this.setState({ prevLocation: this.state.currLocation });
      locationUpdate = {
         latitude: location.coords.latitude,
         longitude: location.coords.longitude,
         accuracy: location.coords.accuracy,
         heading: location.coords.heading,
         speed: location.coords.speed,
         timestamp: location.timestamp,
      };
      this.setState({ currLocation: locationUpdate });
   }
   
   async _speedChanges(currLocation, prevLocation) {
      if ((prevLocation.speed - currLocation.speed) >= 2.0) {
         Alert.alert(
            'Uh Oh! Looks like you may have been in an accident.',
            'Are you safe?',
            [
               { text: 'Yes', onPress: () => { this.setState({ flag: false }) }}, 
               { text: 'No', onPress: () => { this.setState({ flag: true }) }}
            ],
         );
      }
   }

   async componentDidMount() {
      let { status } = await Permissions.askAsync(
         Permissions.AUDIO_RECORDING,
         Permissions.CAMERA,
         Permissions.LOCATION);
      this.setState({ hasCameraPermissions: status === 'granted' });
      
      let { navigation } = this.props;
      navigation.addListener('willFocus', () =>
         this.setState({ focusedScreen: true })
      );
      navigation.addListener('willBlur', () =>
         this.setState({ focusedScreen: false })
      );

      let count = await AsyncStorage.getAllKeys();
      this.setState({ counter: count.length });

      this._watchPosition();
   }
}
