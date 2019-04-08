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
        flex: 1
    },
    galleryImageContainer: { 
        width: 75,
        height: 75, 
        marginRight: 5 
    },
    galleryImage: { 
        width: 75, 
        height: 75 
    }, 
    default: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center'
    }, 
    text: { 
        fontSize: 20
    }
});