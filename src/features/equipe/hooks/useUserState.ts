import { useState, useEffect } from 'react';
import { User, UserRole } from '../../../types';
import { mockUsers } from '../../../db/mockDb';
import { supabase, isSupabaseConfigured } from '../../../lib/supabase';

const STORAGE_KEY = 'jc_clinic_users';

export function useUserState() {
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to parse users from localStorage', e);
    }
    return mockUsers;
  });

  // Fetch users from Supabase if configured
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    async function fetchCloudUsers() {
      try {
        const { data, error } = await supabase!.from('usuarios').select('*');
        if (!error && data && data.length > 0) {
          const mapped: User[] = data.map((item) => ({
            id: item.id,
            name: item.name,
            email: item.email,
            role: item.role as UserRole,
            specialty: item.specialty,
            crefito: item.crefito,
            avatarUrl: item.avatar_url,
            status: item.status || 'active',
            password: item.password || '123',
            createdAt: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : undefined,
          }));
          setUsers(mapped);
        }
      } catch (err) {
        console.warn('Supabase users fetch error:', err);
      }
    }

    fetchCloudUsers();
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    } catch (e) {
      console.error('Failed to save users to localStorage', e);
    }
  }, [users]);

  const addUser = (userData: Omit<User, 'id'>) => {
    const newUser: User = {
      ...userData,
      id: `u_${Date.now()}`,
      avatarUrl: userData.avatarUrl || 'https://images.unsplash.com/photo-1622253692010-333f2da6031d?w=300&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [newUser, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('usuarios').upsert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specialty: newUser.specialty,
        crefito: newUser.crefito,
        avatar_url: newUser.avatarUrl,
        status: newUser.status || 'active',
        password: newUser.password || '123',
      }).then(({ error }) => {
        if (error) console.error('Supabase user save error:', error.message);
      });
    }

    return newUser;
  };

  const updateUser = (id: string, updatedData: Partial<User>) => {
    setUsers((prev) =>
      prev.map((user) => {
        if (user.id === id) {
          const updated = { ...user, ...updatedData };
          if (isSupabaseConfigured && supabase) {
            supabase.from('usuarios').update({
              name: updated.name,
              email: updated.email,
              role: updated.role,
              specialty: updated.specialty,
              crefito: updated.crefito,
              avatar_url: updated.avatarUrl,
              status: updated.status,
              password: updated.password,
            }).eq('id', id).then(({ error }) => {
              if (error) console.error('Supabase user update error:', error.message);
            });
          }
          return updated;
        }
        return user;
      })
    );
  };

  const deleteUser = (id: string) => {
    setUsers((prev) => prev.filter((user) => user.id !== id));
    if (isSupabaseConfigured && supabase) {
      supabase.from('usuarios').delete().eq('id', id);
    }
  };

  const registerUser = (userData: Omit<User, 'id' | 'status'> & { requestedRole?: UserRole }) => {
    const newUser: User = {
      ...userData,
      id: `u_${Date.now()}`,
      role: userData.requestedRole || userData.role || 'physio',
      status: 'pending',
      createdAt: new Date().toLocaleDateString('pt-BR'),
      avatarUrl:
        userData.avatarUrl ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=300&auto=format&fit=crop&q=80',
    };
    setUsers((prev) => [newUser, ...prev]);

    if (isSupabaseConfigured && supabase) {
      supabase.from('usuarios').upsert({
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        specialty: newUser.specialty,
        crefito: newUser.crefito,
        avatar_url: newUser.avatarUrl,
        status: 'pending',
        password: newUser.password || '123',
      }).then(({ error }) => {
        if (error) console.error('Supabase user registration error:', error.message);
      });
    }

    return newUser;
  };

  const approveUser = (id: string, assignedRole?: UserRole) => {
    setUsers((prev) =>
      prev.map((u) => {
        if (u.id === id) {
          const updatedRole = assignedRole || u.role;
          if (isSupabaseConfigured && supabase) {
            supabase.from('usuarios').update({
              status: 'active',
              role: updatedRole,
            }).eq('id', id);
          }
          return {
            ...u,
            status: 'active',
            role: updatedRole,
          };
        }
        return u;
      })
    );
  };

  const rejectUser = (id: string) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
    if (isSupabaseConfigured && supabase) {
      supabase.from('usuarios').delete().eq('id', id);
    }
  };

  const activeUsers = users.filter((u) => u.status !== 'pending' && u.status !== 'rejected');
  const pendingUsers = users.filter((u) => u.status === 'pending');

  const getPhysios = () => {
    return activeUsers.filter((u) => u.role === 'physio');
  };

  return {
    users,
    activeUsers,
    pendingUsers,
    addUser,
    registerUser,
    approveUser,
    rejectUser,
    updateUser,
    deleteUser,
    getPhysios,
  };
}

