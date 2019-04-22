import React from 'react';
import { Camera, Permissions, Accelerometer } from 'expo';
import { Text, View, Alert, TouchableHighlight, 
   AsyncStorage, Vibration } from 'react-native';

import { styles } from '../styles/HomeScreenStyles';

export default class HomeScreen extends React.Component {
   constructor(props) { 
      super(props);
      this._saveVideo = this._saveVideo.bind(this);
   }

   static navigationOptions = { 
      headerStyle: { 
         display: 'none' 
      } 
   };

   state = {
      hasCameraPermissions: null,
      focusedScreen: false,
      isRecording: false,
      counter: 0,
      flag: null,
      interval: null,
      cameraConfig: {
         type: Camera.Constants.Type.back,
         autoFocus: 'on',
         ratio: '16:9',
      },
      recordingConfig: {
         quality: Camera.Constants.VideoQuality['480p'],
         maxDuration: 60,
         mute: true,
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
         cameraConfig, isRecording } = this.state;
         
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
         // this._watchPosition();
         return (
            <Camera 
               ref={(ref) => this.camera = ref } 
               style={styles.cameraView}
               ratio={cameraConfig.ratio}
               autoFocus={cameraConfig.autoFocus}
               type={cameraConfig.type}>

               <View style={styles.recordRow}>
                  <TouchableHighlight 
                     activeOpacity={1}
                     style={styles.recordButtonRing}
                     onPress={() => { 
                        this._toggleRecording()
                        this.setState({ isRecording: !isRecording })
                     }}>
                     
                     <View style={this.state.isRecording
                        ? styles.recordButtonInnerPressed
                        : styles.recordButtonInner} />
                  </TouchableHighlight>
               </View>
            </Camera>
         );
      }
   }

   _toggleRecording() {
      // if we are recording then stop because the button was pressed
      this.state.isRecording 
         ? this._stopRecording()
         : this._startRecording();
   }

   _stopRecording() {
      this.setState({ isRecording: false });
      this.camera.stopRecording();
      console.log('DEBUG: stopped recording in stop')
   }

   _startRecording() {
      try {
         this.setState({ isRecording: true });
         this.camera.recordAsync(this.state.recordingConfig)
         .then((data) => {
            this._saveVideo(data);
            console.log('INFO: videos = ' + this.state.counter);
         });
      } catch(error) {
         console.log('ERROR: error with recordAsync(): ' + error);
      }
   }

   _saveVideo = (data) => {
      let key = new Date();
      const value = JSON.stringify({
         uri: data.uri,
         flag: this.state.flag 
      });
      try {
         AsyncStorage.setItem(key, value)
         .then(() => {
            Alert.alert(
               'Recording stopped',
               'Video has been saved.',
               [
                  { text: 'Okay' }, 
                  { text: 'Go To Gallery', 
                     onPress: () => {
                        this.props.navigation.navigate('Gallery')
                     }
                  }
               ],
            );
            Vibration.vibrate();
            console.log('DEBUG: video saved');
            this.state.counter++;
         })
         .catch((err) => {
            console.log('err while saving: ' + err);
         });
      } catch (error) {
         console.log("ERROR: error saving data.");
      }
   };

   async componentDidMount() {
      let { status } = await Permissions.askAsync(
         Permissions.AUDIO_RECORDING,
         Permissions.CAMERA);
   
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
      // this._watchPosition();
   }
}
