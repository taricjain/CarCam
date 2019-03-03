import React from 'react';
import { Text, TouchableOpacity, View, 
        Alert, Vibration, CameraRoll } from 'react-native';
import TimerMixin from 'react-timer-mixin';
import { Camera, Permissions } from 'expo';
import { styles } from '../styles/HomeScreenStyles';

export default class HomeScreen extends React.Component {
    constructor(props){
        super(props)
        this.startRecording = this.startRecording.bind(this)
    }

    static navigationOptions = {
        title: 'Welcome',
    };

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
                <View style={styles.content}>
                    <Camera 
                        ref={ref => {this.camera = ref;}} 
                        style={styles.cameraView}
                        ratio={this.state.ratio}
                        flash={this.state.flash}
                        autoFocus={this.state.autoFocus}
                        zoom={this.state.zoom}
                        type={this.state.type}>
                        <View style={styles.row}>
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
                                        [{text: 'Okay!' }],
                                        {cancelable: false},
                                    );
                                    }}>
                                <Text style={styles.text}>Stop</Text>
                            </TouchableOpacity>
                        </View>
                    </Camera>
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
        Vibration.vibrate();
        this.camera.recordAsync(recordingConfig).then(async data => {
            Vibration.vibrate();
            this.pushAfterFifteen(data);
            //await CameraRoll.saveToCameraRoll(data.uri);
        })
    }

    pushAfterFifteen(data) {
        CameraRoll.saveToCameraRoll(data.uri);
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
