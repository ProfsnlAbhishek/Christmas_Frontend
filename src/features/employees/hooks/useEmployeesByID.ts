import { useQuery } from "@tanstack/react-query";
import { getEmpByID } from "../../../api/employee";

import type {Employee} from "../../../types/Employee";


export function useEmployeesById(id: number){
    return useQuery<Employee>({
        queryKey: ["employee", id],
        queryFn: () => getEmpByID(id),
    });
}