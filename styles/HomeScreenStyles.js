import { StyleSheet } from 'react-native';
import Colors from '../constants/Colors';

export const styles = StyleSheet.create({
    content: {
        flex: 1,
        margin: 20,
        backgroundColor: 'transparent',
        flexDirection: 'row',
    },
    button: {
        flex: 0.3,
        alignSelf: 'flex-end',
        alignItems: 'center',
        backgroundColor: Colors.blue,
        borderRadius: 50,
        padding: 10,
    },
    text: {
        fontSize: 18,
        color: 'white',
        fontWeight: 'bold',
    },
    cameraView: {
        flex: 1,
        flexDirection: 'column',
        margin: 10,
        backgroundColor: 'transparent',
    },
});