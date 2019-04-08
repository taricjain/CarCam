import React from 'react';
import { Text, View, Alert, 
    TouchableHighlight, AsyncStorage } from 'react-native';
import { Camera, Permissions,
    BackgroundFetch, TaskManager,
    Constants, Accelerometer, Gyroscope } from 'expo';

import { styles } from '../styles/HomeScreenStyles';

export default class HomeScreen extends React.Component {
    constructor(props) { 
        super(props); 
    }

    static navigationOptions = { headerStyle: { display: 'none' } };

    state = {
        hasCameraPermissions: null,
        pressed: false,
        focusedScreen: false,
        counter: 0,
        cameraConfig: {
            autoFocus: 'on',
            ratio: '16:9',
            type: Camera.Constants.Type.back,
        },
        recordingConfig: {
            quality: Camera.Constants.VideoQuality['480p'],
            maxDuration: 30,
            mute: true,
        },
    };

    render() {
        return (
            <React.Fragment>
                <View style={{ flex: 1 }}>
                    {this.renderCamera()}
                </View>
            </React.Fragment>
        );
    }

    renderCamera() {
        let { hasCameraPermissions, focusedScreen, cameraConfig } = this.state;
        console.log('INFO: camera in focus? ' + focusedScreen);

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
            return (
                <Camera 
                    ref={ref => { this.camera = ref; }} 
                    style={styles.cameraView}
                    ratio={cameraConfig.ratio}
                    autoFocus={cameraConfig.autoFocus}
                    type={cameraConfig.type}>

                    <View style={styles.recordRow}>
                        <TouchableHighlight 
                            activeOpacity={1}
                            style={styles.recordButtonRing}
                            onPress={() => this.toggleRecording()}>
                            <View style={this.state.pressed
                                ? styles.recordButtonInnerPressed
                                : styles.recordButtonInner} />
                        </TouchableHighlight>
                    </View>
                </Camera>
            );
        }
    }

    async toggleRecording() {
        if (this.state.pressed) {
            this.camera.stopRecording();
        } else {
            this.camera.recordAsync(this.state.recordingConfig)
            .then(async data => {
                this._saveVideo(data);
                console.log('INFO: videos in camera = ' + this.state.counter);
            })
            .catch(function() {
                console.log('ERROR: error while recording.');
            });
        }
        this.setState({ pressed: !this.state.pressed });
    }

    _saveVideo = async (data) => {
        let timestampKey = new Date();
        console.log(timestampKey);
        try {
            await AsyncStorage.setItem(timestampKey, data.uri)
            .then(() => {
                console.log("INFO: I saved the video! key: " + timestampKey);
                Alert.alert('Stopped Recording',
                    'Video has been saved.',
                    [{text: 'Okay' }],
                );
                this.state.counter += 1;
            });
        } catch (error) {
            console.log("ERROR: error saving data.");
        }
    };

    async componentDidMount() {
        let { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.setState({ focusedScreen: true })
        );
        navigation.addListener('willBlur', () =>
            this.setState({ focusedScreen: false }),
        );

        let { status } = await Permissions.askAsync(
            Permissions.CAMERA, 
            Permissions.CAMERA_ROLL,
            Permissions.AUDIO_RECORDING);
        this.setState( { hasCameraPermissions: status === 'granted' } );

        let count = await AsyncStorage.getAllKeys();
        this.setState( { counter: count.length } );
    }
}