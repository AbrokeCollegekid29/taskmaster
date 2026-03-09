import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});

export type Task = {
    id: string;
    user_id: string;
    title: string;
    description: string | null;
    is_completed: boolean;
    created_at: string;
    updated_at: string;
};

export type Profile = {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
};