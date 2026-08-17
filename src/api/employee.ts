import type {Employee} from "../types/Employee";
import api from "./axios";


export const getEmpByID = async(id: number): Promise<Employee> => {
    const {data} = await api.get<Employee>(`/employees/${id}`);
    return data;
}

export const getAllActiveEmployees = async (): Promise<Employee[]> => {
    const {data} = await api.get<Employee[]>("/employees/");
    return data;
}

export const getAllChildAssociatedWorkers = async (): Promise<[]> => {
    const {data} = await api.get<[]>("/employees/childAssociated");
    return data;
}

