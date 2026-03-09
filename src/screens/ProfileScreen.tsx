import React, { useEffect, useState } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { supabase, Profile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export default function ProfileScreen() {
    const { user, signOut } = useAuth();
    const [profile, setProfile] = useState<Profile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const load = async () => {
            const { data: prof } = await supabase.from('profiles').select('*').eq('id', user?.id).single();
            setProfile(prof);
            setLoading(false);
        };
        load();
    }, []);

    const handleLogout = () => {
        Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Sign Out', style: 'destructive', onPress: signOut },
        ]);
    };

    if (loading) return (
        <View style={[styles.container, { justifyContent: 'center', backgroundColor: '#0F0F23' }]}>
            <ActivityIndicator color="#6C63FF" />
        </View>
    );

    const displayName = profile?.full_name || user?.email?.split('@')[0] || 'User';
    const initials = displayName.split(' ').map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);

    return (
        <View style={[styles.container, { backgroundColor: '#0F0F23' }]}>
            <ScrollView contentContainerStyle={styles.scroll}>

                {/* Avatar */}
                <View style={styles.avatarSection}>
                    <View style={[styles.avatar, { backgroundColor: '#6C63FF' }]}>
                        <Text style={styles.avatarText}>{initials}</Text>
                    </View>
                    <Text style={styles.name}>{displayName}</Text>
                    <Text style={styles.email}>{user?.email}</Text>
                </View>

                {/* Info Card */}
                <View style={styles.infoCard}>
                    <View style={styles.infoRow}>
                        <Text style={styles.infoLabel}>Account Type</Text>
                        <Text style={styles.infoValue}>
                            {user?.app_metadata?.provider === 'google' ? '🔵 Google' : '📧 Email'}
                        </Text>
                    </View>
                    <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                        <Text style={styles.infoLabel}>Member Since</Text>
                        <Text style={styles.infoValue}>
                            {user?.created_at
                                ? new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
                                : '—'}
                        </Text>
                    </View>
                </View>

                {/* Logout */}
                <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
                    <Text style={styles.logoutText}>🚪  Sign Out</Text>
                </TouchableOpacity>

            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1 },
    scroll: { padding: 24, paddingTop: 60 },
    avatarSection: { alignItems: 'center', marginBottom: 32 },
    avatar: {
        width: 90, height: 90, borderRadius: 30,
        alignItems: 'center', justifyContent: 'center', marginBottom: 14,
    },
    avatarText: { color: '#fff', fontSize: 32, fontWeight: '800' },
    name: { color: '#fff', fontSize: 24, fontWeight: '800' },
    email: { color: 'rgba(255,255,255,0.5)', fontSize: 14, marginTop: 4 },
    infoCard: {
        backgroundColor: 'rgba(255,255,255,0.07)',
        borderRadius: 16, padding: 20, marginBottom: 24,
        borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)',
    },
    infoRow: {
        flexDirection: 'row', justifyContent: 'space-between',
        paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.07)',
    },
    infoLabel: { color: 'rgba(255,255,255,0.5)', fontSize: 15 },
    infoValue: { color: '#fff', fontSize: 15, fontWeight: '600' },
    logoutBtn: {
        backgroundColor: 'rgba(239,68,68,0.15)',
        borderRadius: 16, padding: 18, alignItems: 'center',
        borderWidth: 1, borderColor: 'rgba(239,68,68,0.3)',
    },
    logoutText: { color: '#EF4444', fontWeight: '700', fontSize: 16 },
});
