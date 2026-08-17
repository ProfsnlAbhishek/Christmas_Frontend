import api from "./axios";

import type {Lottery} from "../types/Lottery";

export const getAllLottery  = async(): Promise<Lottery[]> =>{
    const {data} = await api.get<Lottery[]>(`/lottery/`);
    return data;
}


export const updateSold = async (id: number, payload: Lottery): Promise<Lottery> =>{
    const {data} = await api.put(`/lottery/sold/${id}`, payload);
    return data;
}
export const updateLottery = async (id: number, payload: Lottery): Promise<Lottery> =>{
    const {data} = await api.put(`/lottery/${id}`, payload);
    return data;
}
export const deleteLottery = async (id: number, payload: Lottery): Promise<Lottery> =>{
    const {data} = await api.put(`/lottery/delete/${id}`, payload);
    return data;
}

export const archiveLottery = async (): Promise<{success: boolean}> =>{
    const {data} = await api.put('/lottery/archive/');
    return data;
}
