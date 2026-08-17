import { useQuery } from "@tanstack/react-query";
import type {Employee} from "../../../types/Employee";
import { getAllActiveEmployees } from "../../../api/employee";


export function useAllActiveEmployees() {
    return useQuery<Employee[]>({
        queryKey: ["kare", "employees"],
        queryFn: () => getAllActiveEmployees(),
    })
}