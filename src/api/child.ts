import api from "./axios";
import type {Child, ChildInput, ChildSmall } from "../types/Child";


export const getAllChilds = async (): Promise <Child[]> => {
    const {data} = await api.get<Child[]>(`/children/`);
    return data;
};

export const createChild = async (payload: ChildInput): Promise<Child> => {
    const {data} = await api.post<Child>(`/child/`, payload);
    return data;
};

export const updateChild = async (id : number, payload: ChildInput): Promise<Child> =>{
    const {data} = await api.put<Child>(`/child/${id}`, payload);
    return data;
};


export const getAllRace = async(): Promise<string[]> =>{
    const data = await api.get<string[]>(`/lookups/race/`);
    return data.data;
}
export const getAllGiftCard = async(): Promise<string[]> =>{
    const data = await api.get<string[]>(`/lookups/gift_card_types/`);
    return data.data;
}

export const deleteChild = async (id:number): Promise<void> =>{
    await api.delete(`/child/${id}`);


}


export const archiveChildren = async (): Promise<void> =>{
    await api.get(`/children/archive/`);
}


export const getAllChildByDonorID = async (childID: number): Promise<ChildSmall[]> =>{
    const {data} = await api.get<ChildSmall[]>(`/children/all/${childID}`);
    return data;
}


export const getAllUnAssociatedChild = async (): Promise<ChildSmall[]> => {
    const {data} = await api.get<ChildSmall[]>(`/child/allUnassociated/`);
    return data;

}




export const associateDonorByChildID = async (
  id: number,
  payload: { donorID: number }
): Promise<{ success: boolean }> => {
  const { data } = await api.put(`/child/associateDonor/${id}`, payload);
  return data;
};

export const dissociateDonorByChildID = async (
  id: number,
): Promise<{ success: boolean }> => {
  const { data } = await api.put(`/child/dissociateDonor/${id}`);
  return data;
};

