import React from 'react';
import { 
    View, ScrollView, Text, 
    AsyncStorage, TouchableHighlight, 
    Modal, RefreshControl, SafeAreaView
} from 'react-native';
import { Video } from 'expo';
import { styles } from '../styles/GallaryScreenStyles';

export default class GallaryScreen extends React.Component {
    constructor(props) {
        super(props);
    }
    static navigationOptions = { 
        title: 'Video Gallery',
    };

    state = {
        videos: [],
        focusedScreen: false,
        toPlay: "default",
        modalVisible: false,
        refreshing: false,
    };

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }

    _onRefresh = async() => {
        console.log("INFO: refresh started!");
        this.setState({ refreshing: true });
        
        this._fetchVideosAsync();
        
        this.setState({ refreshing: false });
        console.log("INFO: refresh complete!");
    }

    render() {
        let focusedScreen = this.state;
        console.log("INFO: videos in gallery = " + this.state.videos.length);

        if (this.state.videos.length > 0 && focusedScreen.focusedScreen) {
            return (
                <View style={{ flex: 1 }}>
                    {this.renderGallery()}
                    {this.renderModal(this.state.toPlay)}
                </View>
            );
        } else if (this.state.videos.length === 0 && focusedScreen.focusedScreen) {
            return (
                <View style={styles.centerContent}>
                    <ScrollView style={styles.galleryContainer}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.refreshing}
                                onRefresh={this._onRefresh} />
                        }>
                    <Text style={styles.introText}>Start driving to save videos!</Text>
                </ScrollView>
                </View>
            );
        } else {
            return (
                <View style={styles.centerContent}>
                    <Text style={styles.introText}>Start driving to save videos!</Text>
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
                    console.log("INFO: modal closed.");
                }}>
                <SafeAreaView style={styles.videoContainer}>
                    <TouchableHighlight
                        onPress={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                        style={styles.button}>
                        <Text style={styles.buttonText}>Exit</Text>
                    </TouchableHighlight>
                    <Video
                        source={{ uri: playThis }} 
                        style={styles.video}
                        rate={1.0}
                        isMuted={true}
                        shouldPlay
                        useNativeControls
                    />
                </SafeAreaView>
            </Modal>
        );
    }

    formatDate(timestamp) {
        let date = new Date(timestamp);
        return date.toLocaleString();
    }

    renderGallery() {
        return(  
            <ScrollView
                style={styles.galleryContainer}
                refreshControl={
                    <RefreshControl
                        refreshing={this.state.refreshing}
                        onRefresh={this._onRefresh} />
                }>
                
                {this.state.videos.map(({ timestamp, uri }) => (
                    <View style={styles.galleryImageContainer} key={uri}>
                        <Text style={styles.videoDate}>{this.formatDate(timestamp)}</Text>
                        <TouchableHighlight
                            style={styles.galleryImageParent}
                            onPress={() => {
                                this.setModalVisible(true);
                                this.setState({ toPlay: uri });
                                console.log('INFO: ' + timestamp);
                            }}>
                            <Video
                                source={{ uri: uri }} 
                                rate={1.0}
                                isMuted={true}
                                resizeMode="cover"
                                style={styles.galleryImage}
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
                // let counter = 0;
                AsyncStorage.multiGet(keys, (err, stores) => {
                    stores.map((result, i, store) => {
                        let key = store[i][0];
                        let value = store[i][1];
                        uris.push({timestamp: key, uri: value});
                        // counter++;
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