import React from 'react';
import { Text, View, Alert,
    TouchableHighlight, AsyncStorage } from 'react-native';
import { Camera, Permissions, Location } from 'expo';
import { styles } from '../styles/HomeScreenStyles';

export default class HomeScreen extends React.Component {
    constructor(props) { 
        super(props); 
    }

    static navigationOptions = { headerStyle: { display: 'none' } };

    state = {
        hasCameraPermissions: null,
        focusedScreen: false,
        pressed: false,
        counter: 0,
        prevLocation: {
            latitude: 0,
            longitude: 0,
        },
        currLocation: {
            latitude: 0,
            longitude: 0,
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
        watchPositionConfig: {
            accuracy: Location.Accuracy.High,
            timeInterval: 2000,
            distanceInterval: 50,
        },
        currentPositionConfig: {
            accuracy: Location.Accuracy.High,
            maximumAge: 2000,
        }
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

                    {console.log(this.state.currLocation)}

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
                Alert.alert(
                    'Stopped Recording',
                    'Video has been saved.',
                    [{text: 'Okay' }],
                );
                this.state.counter += 1;
            });
        } catch (error) {
            console.log("ERROR: error saving data.");
        }
    };

    locationChanged(location) {
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
        if ((prevLocation.speed - currLocation.speed) >= 6) {
            Alert.alert(
                'Uh Oh! Were you in an accident?',
                'Are you safe?',
                [{text: 'Yes' }, {text: 'No'}],
            );
        }
    } 

    async componentDidMount() {
        let { status } = await Permissions.askAsync(
            Permissions.CAMERA, 
            Permissions.LOCATION);
        this.setState( { hasCameraPermissions: status === 'granted' } );

        let { navigation } = this.props;
        navigation.addListener('willFocus', () =>
            this.setState({ focusedScreen: true })
        );
        navigation.addListener('willBlur', () =>
            this.setState({ focusedScreen: false }),
        );

        let count = await AsyncStorage.getAllKeys();
        this.setState( { counter: count.length } );
        
        Location.getCurrentPositionAsync(this.state.currentPositionConfig)
        .then((location) => {
            Location.watchPositionAsync(
                this.state.watchPositionConfig,
                this.locationChanged(location));
        })
        .catch((err) => {
            console.log("ERROR: location error. " + err);
        });
    }
}