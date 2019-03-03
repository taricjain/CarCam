import React from 'react';
import { Text, TouchableOpacity, View, Alert, FileSystem, Vibration, CameraRoll } from 'react-native';
import { Camera, Permissions } from 'expo';
import { styles } from '../styles/HomeScreenStyles';

export default class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    constructor(props){
        super(props)
        this.startRecording = this.startRecording.bind(this)
    }

    state = {
        hasCameraPermissions: null,
        flash: 'off',
        zoom: 0,
        autoFocus: 'on',
        whiteBalance: 'auto',
        ratio: '16:9',
        type: Camera.Constants.Type.back,
        isRecording: false,

    };

    render() {
        const { hasCameraPermissions } = this.state;
        if (hasCameraPermissions === null) {
            return <View />;
        } else if (hasCameraPermissions === false) {
            return <Text>Permissions were denied :(</Text>;
        } else {
            return (
                <View style={{flex: 1}}>
                    <View style={{flex: 1}}>
                        <Camera 
                            ref={ref => {this.camera = ref;}} 
                            style={styles.cameraView}
                            type={this.state.type}
                        />
                    </View>
                    <View style={styles.content}>
                        <TouchableOpacity style={styles.button}
                            onPress={this.toggleCameraView}>
                            <Text style={styles.text}>Flip View</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}
                            onPress={() => this.startRecording()}>
                            <Text style={styles.text}>Record</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.button}
                            onPress={() => {
                                this.stopRecording();
                                Alert.alert(
                                    'Alert!',
                                    'Recording stopped.',
                                    [
                                        {text: 'Okay!' },
                                    ],
                                    {cancelable: false},
                                );
                                }}>
                            <Text style={styles.text}>Stop</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            );
        }
    }

    startRecording() {
        const recordingConfig = {
            quality: Camera.Constants.VideoQuality['480p'],
            maxDuration: 30,
            mute: true,
        }
        this.camera.recordAsync(recordingConfig).then(async data => {
            Vibration.vibrate();
            let saveResult = await CameraRoll.saveToCameraRoll(data.uri);
            // this.state.videos.push(
            // {
            //     uri: data.uri,
            //     fs: `${FileSystem.documentDirectory}videos/Video_${Date.now()}.mov`,
            //     rollUri: saveResult
            // })
        })
    }

    stopRecording() {
        this.camera.stopRecording();
    }
 
    toggleCameraView = () => {
        this.setState({
            type: this.state.type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back,
        });
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.AUDIO_RECORDING, Permissions.CAMERA_ROLL);
        this.setState( { hasCameraPermissions: status === 'granted' });
    }

}
