// src/redux/features/users/usersSlice.ts
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getData, apiUrl, postData, postFormData } from '../../utlis/services';

// Definición de tipos
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
}

interface UsersState {
  users: User[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Estado de carga
  error: string | null;
}

const initialState: UsersState = {
  users: [],
  loading: 'idle',
  error: null,
};

export const getAllUsers = createAsyncThunk(
  'users/getAllUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData(`${apiUrl}/users`);
      if (response.error) {
        return rejectWithValue(response.message);
      }
      
      return response as User[];
    } catch (err: any) {
      // Captura errores de red u otros errores no http 2xx
      return rejectWithValue(err.message || 'Error desconocido al obtener usuarios');
    }
  }
);

export const createUser = createAsyncThunk<User, { data: Partial<User> }, { rejectValue: string }>(
  'users/createUser',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/users`, data, 'POST')
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return response as User;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al actualizar usuario');
    }
  }
);

export const updateUser = createAsyncThunk<User, { id: number; data: Partial<User> }, { rejectValue: string }>(
  'users/updateUser',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      // Reemplaza con la URL de tu API para actualizar un usuario específico
      const response = await postData(`${apiUrl}/users/${id}`, data, 'PUT')
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return response as User; // Asume que la API devuelve el usuario actualizado
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al actualizar usuario');
    }
  }
);

export const deleteUser = createAsyncThunk<number, number, { rejectValue: string }>( // Devuelve el ID del usuario eliminado
  'users/deleteUser',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/users/${id}`, {}, 'DELETE');
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al eliminar usuario');
    }
  }
);

export const createUsersCsv = createAsyncThunk<User, FormData, { rejectValue: string }>(
  'users/createUsersCsv',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await postFormData(`${apiUrl}/users/upload`, formData)
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return response as User;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al actualizar usuario');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.users = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get users
      .addCase(getAllUsers.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(getAllUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = 'succeeded';
        state.users = action.payload;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        state.users = [];
      })

      // Create users
      .addCase(createUser.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = 'succeeded';
        state.users.push(action.payload);
      })
      .addCase(createUser.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      // Create users csv
      .addCase(createUsersCsv.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createUsersCsv.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = 'succeeded';
        state.users = action.payload;
      })
      .addCase(createUsersCsv.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
  },
});

// Exporta las acciones síncronas si las sigues usando
export const { setUsers } = usersSlice.actions;

// Exporta el reducer por defecto
export default usersSlice.reducer;