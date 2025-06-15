import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiUrl, getData, postData } from '../../utlis/services';

interface Category {
  id: number;
  name: string;
}

interface CategoriesState {
  categories: Category[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Estado de carga
  error: string | null;
}

const initialState: CategoriesState = {
  categories: [],
  loading: 'idle',
  error: null,
};

export const getAllCategories = createAsyncThunk(
  'categories/getAllCategories',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData(`${apiUrl}/categories`);
      if (response.error) {
        return rejectWithValue(response.message);
      }
      
      return response as Category[];
    } catch (err: any) {
      // Captura errores de red u otros errores no http 2xx
      return rejectWithValue(err.message || 'Error desconocido al obtener usuarios');
    }
  }
);

export const createCategory = createAsyncThunk<Category, { data: Partial<Category> }, { rejectValue: string }>(
  'categories/createCategory',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/categories`, data, 'POST')
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return response as Category;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al actualizar usuario');
    }
  }
);

export const updateCategory = createAsyncThunk<Category, { id: number; data: Partial<Category> }, { rejectValue: string }>(
  'categories/updateCategory',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/categories/${id}`, data, 'PUT')
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return response as Category;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al actualizar usuario');
    }
  }
);

export const deleteCategory = createAsyncThunk<number, number, { rejectValue: string }>(
  'categories/deleteCategory',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/categories/${id}`, {}, 'DELETE');
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al eliminar usuario');
    }
  }
);

const categoriesSlice = createSlice({
  name: 'categories',
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get
      .addCase(getAllCategories.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(getAllCategories.fulfilled, (state, action: PayloadAction<Category[]>) => {
        state.loading = 'succeeded';
        state.categories = action.payload;
      })
      .addCase(getAllCategories.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        state.categories = [];
      })

      // Create
      .addCase(createCategory.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = 'succeeded';
        state.categories.push(action.payload);
      })
      .addCase(createCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      
      // Update
      .addCase(updateCategory.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateCategory.fulfilled, (state, action: PayloadAction<Category>) => {
        state.loading = 'succeeded';
        const index = state.categories.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.categories[index] = action.payload;
        }
      })
      .addCase(updateCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteCategory.pending, (state) => {
        state.loading = 'pending'; // Puedes usar un estado de carga más granular si lo prefieres
        state.error = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = 'succeeded';
        // Elimina el usuario del array usando el ID devuelto por la thunk
        state.categories = state.categories.filter(cat => cat.id !== action.payload);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
    },
});


export const { setCategories } = categoriesSlice.actions;
export default categoriesSlice.reducer;