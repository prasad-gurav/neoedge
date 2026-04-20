import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type { User } from '@/types/neoedge';

const STORAGE_KEY = 'neoedge.session';

export type SessionState = {
  user: User | null;
  selectedAccountId: string | null;
};

function loadInitialState(): SessionState {
  if (typeof window === 'undefined') {
    return { user: null, selectedAccountId: null };
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return { user: null, selectedAccountId: null };
    const parsed = JSON.parse(raw) as Partial<SessionState>;
    return {
      user: parsed.user ?? null,
      selectedAccountId: parsed.selectedAccountId ?? null,
    };
  } catch {
    return { user: null, selectedAccountId: null };
  }
}

function persist(state: SessionState) {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // ignore
  }
}

const sessionSlice = createSlice({
  name: 'session',
  initialState: loadInitialState(),
  reducers: {
    setUser(state, action: PayloadAction<User>) {
      state.user = action.payload;
      state.selectedAccountId = null;
      persist(state);
    },
    setSelectedAccountId(state, action: PayloadAction<string | null>) {
      state.selectedAccountId = action.payload;
      persist(state);
    },
    logout(state) {
      state.user = null;
      state.selectedAccountId = null;
      persist(state);
    },
  },
});

export const { setUser, setSelectedAccountId, logout } = sessionSlice.actions;

export default sessionSlice.reducer;
