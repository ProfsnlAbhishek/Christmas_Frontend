import api from "./axios";
import type {Donor, DonorInput } from "../types/Donor";


export const getAllDonors = async (): Promise <Donor[]> => {
    const {data} = await api.get<Donor[]>(`/donor/`);
    return data;
};

export const getAllDonorsChildAssociated = async (): Promise<[]> =>{
    const {data} = await api.get<[]>(`/donor/childAssociated/`);
    return data;        
}


export const createDonor = async (payload: DonorInput): Promise<Donor> => {
    const {data} = await api.post<Donor>(`/donor/`, payload);
    return data;
};

export const updateDonor = async (id : number, payload: DonorInput): Promise<Donor> =>{
    const {data} = await api.put<Donor>(`/donor/${id}`, payload);
    return data;
};

export const archiveDonors = async () : Promise<void> => {
    await api.get(`/donor/archive`);
}

