import {StyleSheet} from 'react-native';

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
        flex: 1,
    },
    video: {
        position: 'absolute',
        top: 50,
        bottom: 0,
        left: 0,
        right: 0,
    },
    button: {
        height: 50,
        margin: 10,
        marginTop:0,
        backgroundColor: '#03244d',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top:0,
        left:0,
        right: 0,
        bottom: 0,
    },
    buttonText: {
        textAlign: 'center',
        fontSize: 20,
        color: '#fff',
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