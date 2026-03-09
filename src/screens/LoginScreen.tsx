import React, { useState } from 'react';
import {
    View, Text, TextInput, TouchableOpacity, StyleSheet,
    KeyboardAvoidingView, Platform, ActivityIndicator, Alert, ScrollView,
} from 'react-native';
import { useAuth } from '../contexts/AuthContext';

export default function LoginScreen() {
    const { signInWithEmail, signUpWithEmail } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () => {
        if (!email || !password) return Alert.alert('Error', 'Please fill in all fields');
        if (!isLogin && !fullName) return Alert.alert('Error', 'Please enter your full name');
        setLoading(true);
        const { error } = isLogin
            ? await signInWithEmail(email, password)
            : await signUpWithEmail(email, password, fullName);
        setLoading(false);

        if (error) {
            Alert.alert('Error', error.message);
        } else if (!isLogin) {
            Alert.alert(
                'Account Created',
                'Successfully signed up! You can now sign in with your email and password.',
                [{ text: 'Sign In Now', onPress: () => setIsLogin(true) }]
            );
        }
    };

    return (
        <View style={[styles.gradient, { backgroundColor: '#0F0F23' }]}>
            <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.flex}>
                <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">

                    {/* Header */}
                    <View style={styles.header}>
                        <View style={styles.iconBox}>
                            <Text style={styles.icon}>✓</Text>
                        </View>
                        <Text style={styles.appName}>TaskMaster</Text>
                        <Text style={styles.tagline}>{isLogin ? 'Welcome back!' : 'Create your account'}</Text>
                    </View>

                    {/* Card */}
                    <View style={styles.card}>
                        {!isLogin && (
                            <View style={styles.inputGroup}>
                                <Text style={styles.label}>Full Name</Text>
                                <TextInput
                                    style={styles.input}
                                    placeholder="John Doe"
                                    placeholderTextColor="#888"
                                    value={fullName}
                                    onChangeText={setFullName}
                                    autoCapitalize="words"
                                />
                            </View>
                        )}

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Email</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="you@example.com"
                                placeholderTextColor="#888"
                                value={email}
                                onChangeText={setEmail}
                                keyboardType="email-address"
                                autoCapitalize="none"
                            />
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>Password</Text>
                            <TextInput
                                style={styles.input}
                                placeholder="••••••••"
                                placeholderTextColor="#888"
                                value={password}
                                onChangeText={setPassword}
                                secureTextEntry
                            />
                        </View>

                        <TouchableOpacity style={styles.submitBtn} onPress={handleSubmit} disabled={loading}>
                            <View style={[styles.submitGradient, { backgroundColor: '#6C63FF' }]}>
                                {loading
                                    ? <ActivityIndicator color="#fff" />
                                    : <Text style={styles.submitText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>}
                            </View>
                        </TouchableOpacity>

                        {/* Toggle */}
                        <TouchableOpacity onPress={() => setIsLogin(!isLogin)} style={styles.toggleRow}>
                            <Text style={styles.toggleText}>
                                {isLogin ? "Don't have an account? " : 'Already have an account? '}
                                <Text style={styles.toggleLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
                            </Text>
                        </TouchableOpacity>
                    </View>

                </ScrollView>
            </KeyboardAvoidingView>
        </View>
    );
}

const styles = StyleSheet.create({
    flex: { flex: 1 },
    gradient: { flex: 1 },
    container: { flexGrow: 1, justifyContent: 'center', padding: 24 },
    header: { alignItems: 'center', marginBottom: 32 },
    iconBox: {
        width: 70, height: 70, borderRadius: 22,
        backgroundColor: 'rgba(108,99,255,0.3)', alignItems: 'center',
        justifyContent: 'center', marginBottom: 12,
        borderWidth: 1.5, borderColor: 'rgba(108,99,255,0.6)',
    },
    icon: { fontSize: 36, color: '#fff' },
    appName: { fontSize: 32, fontWeight: '800', color: '#fff' },
    tagline: { color: 'rgba(255,255,255,0.6)', marginTop: 4, fontSize: 15 },
    card: {
        backgroundColor: 'rgba(255,255,255,0.05)',
        borderRadius: 24, padding: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    inputGroup: { marginBottom: 16 },
    label: { color: 'rgba(255,255,255,0.7)', marginBottom: 6, fontSize: 13, fontWeight: '600' },
    input: {
        backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: 12,
        padding: 14, color: '#fff', fontSize: 15,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.12)',
    },
    submitBtn: { borderRadius: 14, overflow: 'hidden', marginTop: 8 },
    submitGradient: { padding: 16, alignItems: 'center' },
    submitText: { color: '#fff', fontWeight: '700', fontSize: 16 },
    toggleRow: { alignItems: 'center', marginTop: 20 },
    toggleText: { color: 'rgba(255,255,255,0.5)', fontSize: 14 },
    toggleLink: { color: '#6C63FF', fontWeight: '700' },
});