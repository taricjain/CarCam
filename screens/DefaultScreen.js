import React from 'react';
import { View, Text, Image, ScrollView } from 'react-native';
import { styles } from '../styles/DefaultScreenStyles';

export default class DefaultScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome',
    };

    render() {
        return(
            <View style={styles.container}>
                <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
                    <View style={styles.welcomeContainer}>
                        <Image
                            source={
                                __DEV__
                                ? require('../assets/images/robot-dev.png')
                                : require('../assets/images/robot-prod.png')
                            }
                            style={styles.welcomeImage}
                        />
                    </View>

                    <Text style={styles.welcomeText}>Welcome to your very own dashboard camera provided
                        to you by your friendly neighborhood company CarCam Inc.</Text>
                </ScrollView>
            </View>
        );
    }
}