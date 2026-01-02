import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet, Image, Text, Dimensions } from 'react-native';

const CustomSplashScreen = ({ onFinish }) => {
    const scaleAnim = useRef(new Animated.Value(1)).current;
    const fadeAnim = useRef(new Animated.Value(1)).current;
    const rotateAnim = useRef(new Animated.Value(0)).current;
    const bgColorAnim = useRef(new Animated.Value(0)).current; // New bg color value

    useEffect(() => {
        const initialDelay = setTimeout(() => {
            Animated.parallel([
                Animated.timing(scaleAnim, {
                    toValue: 10,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(rotateAnim, {
                    toValue: 1,
                    duration: 1200,
                    useNativeDriver: true,
                }),
                Animated.timing(bgColorAnim, {
                    toValue: 1,
                    duration: 800,
                    delay: 200,
                    useNativeDriver: false, // Color text/bg interpolation usually requires false
                }),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 800,
                    delay: 600, // Delay fade out to see purple briefly
                    useNativeDriver: true,
                }),
            ]).start(() => {
                if (onFinish) {
                    onFinish();
                }
            });
        }, 1000);

        return () => clearTimeout(initialDelay);
    }, []);

    const spin = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['0deg', '90deg'],
    });

    const backgroundColor = bgColorAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ['#1C1C1E', '#667eea'], // Dark Gray to Primary Purple
    });

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim, backgroundColor }]}>
            <Animated.Image
                source={require('../../assets/locaffy.png')}
                style={[styles.logo, { transform: [{ scale: scaleAnim }, { rotate: spin }] }]}
                resizeMode="contain"
            />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        ...StyleSheet.absoluteFillObject,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 9999,
    },
    logo: {
        width: 150,
        height: 150,
    },
});

export default CustomSplashScreen;
