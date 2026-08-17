import api from "./axios";
import type {Contact} from "../types/DonorContact";


export const getAllDonorContactsByID = async(id: number) : Promise <Contact[]> =>{
    const {data} = await api.get<Contact[]>(`/contacts/${id}`);
    return data ?? [];
}

export const createDonorContact = async (payload: Contact): Promise<Contact> =>{
    const {data} = await api.post<Contact>(`/contact/`, payload);
    return data;
}


export const deleteDonorContact = async (id: number): Promise<void> =>{
    await api.delete(`/contact/${id}`);
}