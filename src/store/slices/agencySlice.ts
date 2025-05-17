import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import {
  getAgencies,
  getAgencyById,
  createAgency as apiCreateAgency,
  updateAgency as apiUpdateAgency,
  deleteAgency as apiDeleteAgency,
} from "../../api/agencyApi";
import {
  AgencyState,
  Agency,
  CreateAgencyRequest,
  UpdateAgencyRequest,
} from "../../types";

// Асинхронные экшены
export const fetchAgencies = createAsyncThunk(
  "agencies/fetchAgencies",
  async (_, { rejectWithValue }) => {
    try {
      const agencies = await getAgencies();
      return agencies;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch agencies"
      );
    }
  }
);

export const fetchAgencyById = createAsyncThunk(
  "agencies/fetchAgencyById",
  async (id: number, { rejectWithValue }) => {
    try {
      const agency = await getAgencyById(id);
      return agency;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch agency"
      );
    }
  }
);

export const createAgency = createAsyncThunk(
  "agencies/createAgency",
  async (agencyData: CreateAgencyRequest, { rejectWithValue }) => {
    try {
      const agency = await apiCreateAgency(agencyData);
      return agency;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create agency"
      );
    }
  }
);

export const updateAgency = createAsyncThunk(
  "agencies/updateAgency",
  async (
    { id, data }: { id: number; data: UpdateAgencyRequest },
    { rejectWithValue }
  ) => {
    try {
      const agency = await apiUpdateAgency(id, data);
      return agency;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update agency"
      );
    }
  }
);

export const deleteAgency = createAsyncThunk(
  "agencies/deleteAgency",
  async (id: number, { rejectWithValue }) => {
    try {
      await apiDeleteAgency(id);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete agency"
      );
    }
  }
);

const initialState: AgencyState = {
  items: [],
  currentAgency: null,
  loading: false,
  error: null,
};

const agencySlice = createSlice({
  name: "agencies",
  initialState,
  reducers: {
    clearCurrentAgency: (state) => {
      state.currentAgency = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Получение списка агентств
      .addCase(fetchAgencies.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAgencies.fulfilled,
        (state, action: PayloadAction<Agency[]>) => {
          state.loading = false;
          state.items = action.payload;
        }
      )
      .addCase(fetchAgencies.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Получение агентства по ID
      .addCase(fetchAgencyById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchAgencyById.fulfilled,
        (state, action: PayloadAction<Agency>) => {
          state.loading = false;
          state.currentAgency = action.payload;
        }
      )
      .addCase(fetchAgencyById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Создание агентства
      .addCase(createAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        createAgency.fulfilled,
        (state, action: PayloadAction<Agency>) => {
          state.loading = false;
          state.items.push(action.payload);
        }
      )
      .addCase(createAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Обновление агентства
      .addCase(updateAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        updateAgency.fulfilled,
        (state, action: PayloadAction<Agency>) => {
          state.loading = false;
          const index = state.items.findIndex(
            (item) => item.id === action.payload.id
          );
          if (index !== -1) {
            state.items[index] = action.payload;
          }
          if (state.currentAgency?.id === action.payload.id) {
            state.currentAgency = action.payload;
          }
        }
      )
      .addCase(updateAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Удаление агентства
      .addCase(deleteAgency.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        deleteAgency.fulfilled,
        (state, action: PayloadAction<number>) => {
          state.loading = false;
          state.items = state.items.filter(
            (item) => item.id !== action.payload
          );
          if (state.currentAgency?.id === action.payload) {
            state.currentAgency = null;
          }
        }
      )
      .addCase(deleteAgency.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentAgency, clearError } = agencySlice.actions;
export default agencySlice.reducer;
