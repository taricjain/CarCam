import React from 'react';
import { 
    Text, TouchableOpacity, View, StatusBar,
    Alert, Vibration, CameraRoll, SafeAreaView,
    TouchableHighlight, Platform,
} from 'react-native';
import { Camera, Permissions, Icon } from 'expo';
import TimerMixin from 'react-timer-mixin';
import { styles } from '../styles/HomeScreenStyles';
import Colors from '../constants/Colors';

export default class HomeScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    static navigationOptions = {
        headerStyle: {
            display: 'none',
          },
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
        pressed: false,
    };

    render() {
        const { hasCameraPermissions } = this.state;
        if (hasCameraPermissions === null) {
            return <SafeAreaView style={styles.content}/>;
        } else if (hasCameraPermissions === false) {
            return (
                <SafeAreaView style={styles.content}>
                    <StatusBar translucent={true} barStyle="light-content" />
                    <Text style={styles.permissionsText}>Please enable permissions to access the camera.</Text>
                </SafeAreaView>
            );
        } else {
            return (
                <SafeAreaView style={styles.content}>
                    <StatusBar translucent={true} barStyle="light-content" />
                    <Camera 
                        ref={ref => {this.camera = ref;}} 
                        style={styles.cameraView}
                        ratio={this.state.ratio}
                        flash={this.state.flash}
                        autoFocus={this.state.autoFocus}
                        zoom={this.state.zoom}
                        type={this.state.type}>
                        <View style={styles.row}>
                            <TouchableOpacity
                                onPress={this.toggleCameraView}>
                                <Icon.Ionicons
                                    name={
                                        Platform.OS === 'ios'
                                          ? 'ios-reverse-camera'
                                          : 'md-reverse-camera'
                                      }
                                    size={45}
                                    color={Colors.noticeText}
                                ></Icon.Ionicons>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.recordRow}>
                            <TouchableHighlight 
                                activeOpacity={1}
                                style={styles.recordButtonRing}
                                onPress={() => this.toggleRecording()}>
                                <View style={this.state.pressed
                                    ? styles.recordButtonInnerPressed
                                    : styles.recordButtonInner}></View>
                            </TouchableHighlight>
                        </View>
                    </Camera>
                </SafeAreaView>
            );
        }
    }

    toggleRecording() {
        if (this.state.pressed) {
            this.camera.stopRecording();
            Alert.alert(
                'Stopped Recording',
                'Video has been saved to your camera roll.',
                {cancelable: false},
            );
        } else {
            const recordingConfig = {
                quality: Camera.Constants.VideoQuality['480p'],
                maxDuration: 30,
                mute: true,
            };
            Vibration.vibrate();
            this.camera.recordAsync(recordingConfig).then(async data => {
                Vibration.vibrate();
                this.pushAfterFifteen(data);
                //await CameraRoll.saveToCameraRoll(data.uri);
            });
        }
        this.setState({ pressed: !this.state.pressed });
    }

    pushAfterFifteen(data) {
        CameraRoll.saveToCameraRoll(data.uri);
    }
 
    toggleCameraView = () => {
        this.setState({
            type: this.state.type === Camera.Constants.Type.back
            ? Camera.Constants.Type.front
            : Camera.Constants.Type.back,
        });
    }

    async componentDidMount() {
        const { status } = await Permissions.askAsync(Permissions.CAMERA, Permissions.CAMERA_ROLL);
        this.setState( { hasCameraPermissions: status === 'granted' });
    }

}
