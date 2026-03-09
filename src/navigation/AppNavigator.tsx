import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useAuth } from '../contexts/AuthContext';
import TasksScreen from '../screens/TasksScreen';
import ProfileScreen from '../screens/ProfileScreen';
import LoginScreen from '../screens/LoginScreen';

const Tab = createBottomTabNavigator();

export default function AppNavigator() {
    const { session } = useAuth();

    // If no session, show login screen
    if (!session) return <LoginScreen />;

    // If session exists, show main app with bottom tabs
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                headerShown: false,
                tabBarStyle: styles.tabBar,
                tabBarActiveTintColor: '#6C63FF',
                tabBarInactiveTintColor: 'rgba(255,255,255,0.35)',
                tabBarLabelStyle: styles.tabLabel,
                tabBarIcon: ({ focused }) => {
                    const icons: Record<string, string> = {
                        Tasks: '📋',
                        Profile: '👤',
                    };
                    return (
                        <View style={[styles.tabIcon, focused && styles.tabIconActive]}>
                            <Text style={{ fontSize: 20 }}>{icons[route.name]}</Text>
                        </View>
                    );
                },
            })}
        >
            <Tab.Screen name="Tasks" component={TasksScreen} />
            <Tab.Screen name="Profile" component={ProfileScreen} />
        </Tab.Navigator>
    );
}

const styles = StyleSheet.create({
    tabBar: {
        backgroundColor: '#1A1A2E',
        borderTopColor: 'rgba(255,255,255,0.08)',
        borderTopWidth: 1,
        height: 80,
        paddingBottom: 12,
        paddingTop: 8,
    },
    tabLabel: { fontSize: 12, fontWeight: '600' },
    tabIcon: { padding: 4, borderRadius: 10 },
    tabIconActive: { backgroundColor: 'rgba(108,99,255,0.15)' },
});