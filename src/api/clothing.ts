import type { Clothing } from "../types/Clothing";
import api from "./axios";



export const getAllClothingTypes = async (): Promise<Clothing[]> =>{
    const { data } = await api.get<Clothing[]>(`/types/`);
    return data;
}

export const getAllClothingSize = async(id: number) : Promise<string[]> => {
    const {data} = await api.get<string[]>(`/sizes/${id}`);
    return data;
}