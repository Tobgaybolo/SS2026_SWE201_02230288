import { useEffect, useState } from 'react';
import { supabase } from '../supabase';

export type UserRole = 'student' | 'supervisor' | null;

export interface AuthUser {
  id: string;
  email: string | undefined;
  role: UserRole;
  name: string;
}

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    // Get initial session
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const authUser = await resolveUser(session.user.id, session.user.email);
        setUser(authUser);
      }
      setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const authUser = await resolveUser(session.user.id, session.user.email);
          setUser(authUser);
        } else {
          setUser(null);
        }
        setLoading(false);
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  return { user, loading };
}

async function resolveUser(userId: string, email: string | undefined): Promise<AuthUser> {
  if (!supabase) return { id: userId, email, role: null, name: email?.split('@')[0] || 'User' };

  // Fetch role
  const { data: roleRow } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();

  const role = (roleRow?.role as UserRole) || null;

  // Fetch name from appropriate profile table
  let name = email?.split('@')[0] || 'User';

  if (role === 'student') {
    const { data: profile } = await supabase
      .from('student_profiles')
      .select('name')
      .eq('user_id', userId)
      .single();
    if (profile?.name) name = profile.name;
  } else if (role === 'supervisor') {
    const { data: profile } = await supabase
      .from('supervisor_profiles')
      .select('name')
      .eq('user_id', userId)
      .single();
    if (profile?.name) name = profile.name;
  }

  return { id: userId, email, role, name };
}

export async function getUserRole(userId: string): Promise<UserRole> {
  if (!supabase) return null;
  const { data } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', userId)
    .single();
  return (data?.role as UserRole) || null;
}
