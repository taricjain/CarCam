import React from 'react';
import { View, ScrollView, Text, AsyncStorage, TouchableHighlight, Modal, Button } from 'react-native';
import { Video } from 'expo';

import { styles } from '../styles/SettingsScreenStyles';

export default class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {
        videos: [],
        focusedScreen: false,
        toPlay: "default",
        modalVisible: false,
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    render() {
        let focusedScreen = this.state;
        console.log("INFO: videos in gallery = " + this.state.videos.length);
        console.log("INFO: gallery in focus? " + focusedScreen.focusedScreen);

        if (this.state.videos.length > 0 && focusedScreen.focusedScreen) {
            return (
                <View style={{ flex: 1 }}>
                    {this.renderGallery()}
                    {this.renderModal(this.state.toPlay)}
                </View>
                
            );
        }
        else if (this.state.videos.length === 0 && focusedScreen.focusedScreen) {
            return (
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize:20}}>Start Driving to Save Videos!</Text>
                </View>
            );
        }
        else {
            return (
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize:20}}>Start Driving to Save Videos!</Text>
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
                    console.log("INFO: Modal Closed.");
                }}>
                <View style={styles.videoContainer}>
                    <Video
                        source={{ uri: playThis }} 
                        style={styles.video}
                        rate={1.0}
                        volume={0.0}
                        isMuted={true}
                        resizeMode="cover"
                        shouldPlay
                        isLooping
                    />
                    <Button
                        title='Go Back'
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={styles.button}
                    />
                </View>
            </Modal>
        );
    }

    renderGallery() {
        return(  
            <ScrollView 
                horizontal={true}
                style={styles.galleryContainer}>

                {this.state.videos.map(({ uri }) => (
                    <View style={styles.galleryImageContainer} key={uri}>
                        <TouchableHighlight
                            onPress={() => {
                                this.setModalVisible(true);
                                this.setState({ toPlay: uri });
                            }}>
                            <Video
                                source={{ uri: uri }} 
                                style={styles.galleryImage}
                                rate={1.0}
                                volume={0.0}
                                isMuted={true}
                                resizeMode="cover"
                                shouldPlay
                                isLooping
                                />
                        </TouchableHighlight>
                    </View>
                ))}
            </ScrollView>
        );
    }

    _fetchVideosAsync() {
        return new Promise((resolve, reject) => {
            AsyncStorage.getAllKeys((err, keys) => {
                let uris = [];
                let counter = 0;
                AsyncStorage.multiGet(keys, (err, stores) => {
                    stores.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    uris.push({key: counter, uri: value});
                    // console.log(value);
                    counter++;
                });
                this.setState({videos:uris});
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