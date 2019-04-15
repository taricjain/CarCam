import { StyleSheet } from 'react-native';

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
    flex: {
        flex: 1
    },
    galleryCard: { 
        flex: 1,
        flexDirection: 'column',
        backgroundColor: '#cdcdcd',
        elevation: 5,
        shadowOffset: { width: 5, height: 5 },
        shadowColor: '#eee',
        shadowRadius: 5,
        shadowOpacity: 0.3,
        borderRadius: 10,
        margin: 10,
    },
    videoRow: {
        alignItems: 'flex-start',
        margin: 5,
        flex: 1,
        borderRadius: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        overflow: 'hidden',
    },
    galleryImage: { 
        width: 100, 
        height: 100,
        margin: 5,
        borderRadius: 10,
    }, 
    centerContent: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center',
    }, 
    text: { 
        fontSize: 20,
    },
    video: {
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    viewModalButton: {
        height: 50,
        width: 120,
        justifyContent: 'center',
        alignSelf: 'center',
        alignContent: 'flex-end',
        borderRadius: 5,
        margin: 10,
        backgroundColor: '#03244d',
    },
    button: {
        height: 50,
        marginTop:0,
        backgroundColor: '#03244d',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
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
        fontSize: 20,
        flex: 1,
        backgroundColor: '#eee',
        padding: 10,
        borderRadius: 10,
        marginBottom: -10,
        marginLeft: 5,
        marginRight: 5,
        marginTop: 10,
        textAlign: 'center',
        fontWeight: 'bold',
    }
});