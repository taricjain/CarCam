import {StyleSheet, Dimensions} from 'react-native';

var width = Dimensions.get('window').width; //full width
var height = Dimensions.get('window').height; //full height

export const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
    },
    content: {
        fontSize: 20,
        fontWeight: 'bold',
        padding: 30,
        textAlign: 'center',
    },
    galleryContainer: { 
        flex: 1,
    },
    galleryImageContainer: { 
        flex: 1,
        flexDirection: 'column',
        marginBottom: 15,
        elevation:4,
        shadowOffset: { width: 0, height: 1 },
        shadowColor: '#000',
        shadowOpacity: 0.3,
    },
    galleryImageParent: {
        justifyContent: 'center',
        alignItems: 'center',
        alignSelf: 'center',
        borderRadius: 10,
        overflow: 'hidden',
    },
    galleryImage: { 
        width: 350, 
        height: 350
    }, 
    centerContent: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    }, 
    text: { 
        fontSize: 20,
    },
    videoContainer: {
        display: 'flex',
        width: width,
        height: height
    },
    video: {
        zIndex: 0,
        width: width,
        height: height,
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    button: {
        backgroundColor: '#242424',
        borderRadius: 4,
        zIndex: 1,
        width: 60,
        alignSelf: 'center',
        marginTop: 15
    },
    buttonText: {
        fontSize: 20,
        color: '#fbfbfb',
        padding: 3,
        textAlign: 'center'
    },
    introText: {
        fontSize: 20,
        marginTop: 25
    },
    videoDate: {
        fontSize: 16,
        flex: 1,
        backgroundColor: '#c8c8c8',
        paddingTop: 5,
        paddingBottom: 5,
        paddingLeft: 10,
        marginBottom: 15
    }
});