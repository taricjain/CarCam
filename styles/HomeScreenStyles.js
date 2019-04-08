import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
    content: {
        flex: 1,
        backgroundColor: '#fff',
        display: 'flex',
    },
    cameraView: {
        flex: 1,
        backgroundColor: 'transparent',
    },
    recordRow: {
        justifyContent: 'flex-end',
        alignSelf: 'center',
        flex: 1,
    },
    recordButtonRing: {
        borderColor:'#fff',
        borderWidth: 6,
        borderRadius: 1000,
        width: 90,
        height: 90,
        marginBottom: 15,
    },
    recordButtonInner: {
        backgroundColor: '#9e1919',
        flex: 1,
        borderRadius: 1000,
        margin: 5,
    },
    recordButtonInnerPressed: {
        backgroundColor: '#9e1919',
        flex: 1,
        borderRadius: 10,
        margin: 12,
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
    row: {
        flexDirection: 'row',
        backgroundColor: 'transparent',
        paddingLeft: 15,
        paddingTop: 10,
    },
    permissionsText: {
        color: '#fbfbfb',
        fontSize: 24,
        textAlign: 'center',
        marginTop: 100,
    },
});