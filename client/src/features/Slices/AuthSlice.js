import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { toast } from 'react-toastify'

// Get user from localStorage
const user = JSON.parse(localStorage.getItem('user'))

const initialState = {
  user: user ? user : null,
  isError: false,
  isSuccess: false,
  isLoading: false,
  message: '',
}

// Register user
export const register = createAsyncThunk(
  'auth/register',
  async (user, thunkAPI) => {
    try {
      const response = await axios.post('http://localhost:8000/auth/register/', user)
      if (response.data) {
        localStorage.setItem('user', JSON.stringify(response.data))
      }
      toast.success(response.data.msg)
      return response.data.msg
    } catch (error) {
      const message = error.response.data.msg
      console.log(message)
      return thunkAPI.rejectWithValue(message)
    }
  }
)

// Login user
export const login = createAsyncThunk('auth/login', async (user, thunkAPI) => {
  try {
    const response = await axios.post('http://localhost:8000/auth/login/', user)
    if (response.data) {
      localStorage.setItem('user', JSON.stringify(response.data))
    }
    toast.success(response.data.msg)
    return response.data.msg
  } catch (error) {
    const message = error.response.data.msg
    console.log(message);
    return thunkAPI.rejectWithValue(message)
  }
})

export const logout = createAsyncThunk('auth/logout', async () => {
  await localStorage.removeItem('user')
  toast.error('Logged out')
})

export const verifyEmail = createAsyncThunk(
  'auth/verifyEmail',
  async (token) => {
    const response = await fetch(`http://localhost:8000/auth/verify-email/${token}/`);
    const data = await response.json();
    return data;
  }
);

export const confirmEmail = createAsyncThunk(
  'auth/confirmEmail',
  async (token) => {
    const response = await fetch(`/auth/confirm-email/${token}/`);
    const data = await response.json();
    return data;
  }
);

export const requestPasswordReset = createAsyncThunk(
  'auth/requestPasswordReset',
  async (email) => {
    const response = await fetch('http://localhost:8000/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });
    const data = await response.json();
    return data;
  }
);


export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }) => {
    const response = await fetch(`http://localhost:8000/auth/reset-password/${token}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password }),
    });
    const data = await response.json();
    return data;
  }
);

export const changePassword = createAsyncThunk("auth/changePassword", async ({ currentPassword, newPassword }, thunkAPI) => {
  try {
    const token = thunkAPI.getState().auth.user["access"];
    console.log(token);
    const response = await axios.put('http://localhost:8000/auth/change-password/', { currentPassword, newPassword }, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
    toast.success(response.data.msg)
    return response.data.msg
  } catch (error) {
    const message = error.response.data.msg
    toast.error(message)
    return thunkAPI.rejectWithValue(message)
  }
});



export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    reset: (state) => {
      state.isLoading = false
      state.isSuccess = false
      state.isError = false
      state.message = ''
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.isLoading = true
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
        state.user = null
      })
      .addCase(login.pending, (state) => {
        state.isLoading = true
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null
      })
      .addCase(verifyEmail.pending, (state) => {
        state.isLoading = true
      })
      .addCase(verifyEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(verifyEmail.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(confirmEmail.pending, (state) => {
        state.isLoading = true
      })
      .addCase(confirmEmail.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(confirmEmail.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(requestPasswordReset.pending, (state) => {
        state.isLoading = true
      })
      .addCase(requestPasswordReset.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(requestPasswordReset.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

      .addCase(resetPassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(resetPassword.fulfilled, (state, action) => {
        state.isLoading = false
        state.isSuccess = true
        state.user = action.payload
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })
      .addCase(changePassword.pending, (state) => {
        state.isLoading = true
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.isLoading = false
        state.isSuccess = true
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.isLoading = false
        state.isError = true
        state.message = action.payload
      })

  },
})

export const { reset } = authSlice.actions
export default authSlice.reducer