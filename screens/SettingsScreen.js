import React from 'react';
import { View, ScrollView, Image, Text, AsyncStorage } from 'react-native';
import {Audio, Video} from 'expo';
import { styles } from '../styles/SettingsScreenStyles';

export default class SettingsScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    state = {
        videos: [],
        focusedScreen: false,
    };
    render() {
        console.log("INFO: videos in gallery = " + this.state.videos.length);
        let focusedScreen = this.state;
        if (this.state.videos.length > 0 && focusedScreen) {
            return (
                <View style={{ flex: 1 }}>
                    {this.renderGallery()}
                </View>
            );
        }
        else if (this.state.videos.length === 0 && focusedScreen) {
            return (
                <View style={{flex: 1, alignItems: "center", justifyContent: "center"}}>
                    <Text style={{fontSize:20}}>Start Driving to Save Videos!</Text>
                </View>
            );
        }
    }

    renderGallery() {
        return(  
            <ScrollView 
                horizontal={true}
                style={styles.galleryContainer}>

                {this.state.videos.map(({ uri }) => (
                    <View style={styles.galleryImageContainer} key={uri}>
                        <Video
                            source={{ uri }} 
                            style={styles.galleryImage}
                            rate={1.0}
                            volume={1.0}
                            isMuted={false}
                            resizeMode="cover"
                            shouldPlay
                            isLooping
                            />
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
                    // this.state.videos.push(value);
                    console.log(value);
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
    async _fetchVideos() {
        try {
            AsyncStorage.getAllKeys((err, keys) => {
                let uris = [];
                let counter = 0;
                AsyncStorage.multiGet(keys, (err, stores) => {
                    stores.map((result, i, store) => {
                    let key = store[i][0];
                    let value = store[i][1];
                    uris.push({key: counter, uri: value});
                    // this.state.videos.push(value);
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
            console.log('INFO: now we have ' + this.state.videos.length + ' videos!');
        } catch (error) {
            console.log("ERROR: couldn't retrieve anything");
        }
    };

    async componentDidMount() {
        // await this._fetchVideos();
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