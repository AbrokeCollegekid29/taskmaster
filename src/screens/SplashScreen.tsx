import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

export default function SplashScreen({ onFinish }: { onFinish: () => void }) {
    const opacity = new Animated.Value(0);
    const scale = new Animated.Value(0.8);

    useEffect(() => {
        Animated.parallel([
            Animated.timing(opacity, { toValue: 1, duration: 800, useNativeDriver: true }),
            Animated.spring(scale, { toValue: 1, tension: 100, friction: 8, useNativeDriver: true }),
        ]).start();

        const timer = setTimeout(onFinish, 2500);
        return () => clearTimeout(timer);
    }, []);

    return (
        <View style={[styles.container, { backgroundColor: '#1A1A2E' }]}>
            <Animated.View style={[styles.logoContainer, { opacity, transform: [{ scale }] }]}>
                <View style={styles.iconBox}>
                    <Text style={styles.icon}>✓</Text>
                </View>
                <Text style={styles.title}>TaskMaster</Text>
                <Text style={styles.subtitle}>Get things done.</Text>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    logoContainer: { alignItems: 'center' },
    iconBox: {
        width: 90, height: 90, borderRadius: 28,
        backgroundColor: 'rgba(255,255,255,0.25)',
        alignItems: 'center', justifyContent: 'center',
        marginBottom: 20, borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
    },
    icon: { fontSize: 48, color: '#fff' },
    title: { fontSize: 40, fontWeight: '800', color: '#fff', letterSpacing: 1 },
    subtitle: { fontSize: 16, color: 'rgba(255,255,255,0.8)', marginTop: 8, letterSpacing: 2 },
});