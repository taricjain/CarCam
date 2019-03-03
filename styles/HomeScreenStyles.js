import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    content: {
        flex: 1,
        margin: 1,
        flexDirection: 'column',
    },
    button: {
        flex: 0.4,
        alignItems: 'center',
        backgroundColor: 'transparent',
        borderWidth: 1,
        borderColor: 'white',
        borderRadius: 50,
        padding: 10,
        margin: 5,
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    cameraView: {
        flex: 1,
        margin: 10,
        backgroundColor: 'transparent',
    },
    row: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        justifyContent: 'space-evenly',
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
    },
});