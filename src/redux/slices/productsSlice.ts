import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiUrl, getData, postData } from '../../utlis/services';

interface Product {
  id: number;
  name: string;
}

interface ProductsState {
  products: Product[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Estado de carga
  error: string | null;
}

const initialState: ProductsState = {
  products: [],
  loading: 'idle',
  error: null,
};

export const getAllProducts = createAsyncThunk(
  'products/getAllProducts',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData(`${apiUrl}/products`);
      if (response.error) {
        return rejectWithValue(response.message);
      }
      
      return response as Product[];
    } catch (err: any) {
      // Captura errores de red u otros errores no http 2xx
      return rejectWithValue(err.message || 'Error desconocido al obtener usuarios');
    }
  }
);

export const createProduct = createAsyncThunk<Product, { data: Partial<Product> }, { rejectValue: string }>(
  'products/createProduct',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/products`, data, 'POST')
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return response as Product;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al actualizar usuario');
    }
  }
);

export const updateProduct = createAsyncThunk<Product, { id: number; data: Partial<Product> }, { rejectValue: string }>(
  'products/updateProduct',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/products/${id}`, data, 'PUT')
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return response as Product;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al actualizar usuario');
    }
  }
);

export const deleteProduct = createAsyncThunk<number, number, { rejectValue: string }>(
  'products/deleteProduct',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/products/${id}`, {}, 'DELETE');
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al eliminar usuario');
    }
  }
);

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts: (state, action: PayloadAction<Product[]>) => {
      state.products = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get
      .addCase(getAllProducts.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(getAllProducts.fulfilled, (state, action: PayloadAction<Product[]>) => {
        state.loading = 'succeeded';
        state.products = action.payload;
      })
      .addCase(getAllProducts.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        state.products = [];
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = 'succeeded';
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })
      
      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action: PayloadAction<Product>) => {
        state.loading = 'succeeded';
        const index = state.products.findIndex(cat => cat.id === action.payload.id);
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = 'pending'; // Puedes usar un estado de carga más granular si lo prefieres
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = 'succeeded';
        // Elimina el usuario del array usando el ID devuelto por la thunk
        state.products = state.products.filter(cat => cat.id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
    },
});


export const { setProducts } = productsSlice.actions;
export default productsSlice.reducer;