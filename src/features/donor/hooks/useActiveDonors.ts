import { useQuery } from "@tanstack/react-query";
import { getAllActiveDonors } from "../../../api/donor";
import type { Donor } from "../../../types/Donor";

export function useActiveDonors(){
    return useQuery<Donor[]>({
        queryKey: ["donors", "active"],
        queryFn: () => getAllActiveDonors(),
    });
}