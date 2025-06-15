import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { apiUrl, getData, postData } from '../../utlis/services';

interface Cart {
  id: number;
  name: string;
  product_id: number;
  quantity: number
}

interface CartState {
  cart: Cart[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed'; // Estado de carga
  error: string | null;
}

const initialState: CartState = {
  cart: [],
  loading: 'idle',
  error: null,
};

export const getAllCart = createAsyncThunk(
  'cart/getAllCart',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getData(`${apiUrl}/cart`);
      if (response.error) {
        return rejectWithValue(response.message);
      }
      
      return response as Cart[];
    } catch (err: any) {
      // Captura errores de red u otros errores no http 2xx
      return rejectWithValue(err.message || 'Error desconocido al obtener usuarios');
    }
  }
);

export const createCart = createAsyncThunk<Cart, { data: Partial<Cart> }, { rejectValue: string }>(
  'cart/createCart',
  async ({ data }, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/cart`, data, 'POST')
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return response as Cart;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al actualizar usuario');
    }
  }
);

export const deleteCart = createAsyncThunk<number, number, { rejectValue: string }>(
  'cart/deleteCart',
  async (id, { rejectWithValue }) => {
    try {
      const response = await postData(`${apiUrl}/cart/${id}`, {}, 'DELETE');
      if (response.error) {
        return rejectWithValue(response.message);
      }
      return id;
    } catch (err: any) {
      return rejectWithValue(err.message || 'Error desconocido al eliminar usuario');
    }
  }
);

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    setCart: (state, action: PayloadAction<Cart[]>) => {
      state.cart = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get
      .addCase(getAllCart.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(getAllCart.fulfilled, (state, action: PayloadAction<Cart[]>) => {
        state.loading = 'succeeded';
        state.cart = action.payload;
      })
      .addCase(getAllCart.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
        state.cart = [];
      })

      // Create
      .addCase(createCart.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(createCart.fulfilled, (state, action: PayloadAction<Cart>) => {
        state.loading = 'succeeded';
        console.log(action.payload)
      })
      .addCase(createCart.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      })

      // Delete
      .addCase(deleteCart.pending, (state) => {
        state.loading = 'pending';
        state.error = null;
      })
      .addCase(deleteCart.fulfilled, (state, action: PayloadAction<number>) => {
        state.loading = 'succeeded';
        state.cart = state.cart.filter(cat => cat.id !== action.payload);
      })
      .addCase(deleteCart.rejected, (state, action) => {
        state.loading = 'failed';
        state.error = action.payload as string;
      });
    },
});


export const { setCart } = cartSlice.actions;
export default cartSlice.reducer;