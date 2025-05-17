import api from "./axios";
import { Agency, CreateAgencyRequest, UpdateAgencyRequest } from "../types";

export const getAgencies = async (): Promise<Agency[]> => {
  try {
    const response = await api.get<Agency[]>("/agencies");
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const getAgencyById = async (id: number): Promise<Agency> => {
  try {
    const response = await api.get<Agency>(`/agencies/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const createAgency = async (
  agency: CreateAgencyRequest
): Promise<Agency> => {
  try {
    const response = await api.post<Agency>("/agencies", agency);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const updateAgency = async (
  id: number,
  agency: UpdateAgencyRequest
): Promise<Agency> => {
  try {
    const response = await api.patch<Agency>(`/agencies/${id}`, agency);
    return response.data;
  } catch (error) {
    throw error;
  }
};

export const deleteAgency = async (id: number): Promise<void> => {
  try {
    await api.delete(`/agencies/${id}`);
  } catch (error) {
    throw error;
  }
};
