import { useQuery } from "@tanstack/react-query";
import { getAllChildAssociatedWorkers } from "../../../api/employee";

export function useChildAssociatedWorker(){
    return useQuery<[]>({
        queryKey: ["kare", "employee", "childAssociated"],
        queryFn: () => getAllChildAssociatedWorkers(),
    })
}