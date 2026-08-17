import { useQuery } from "@tanstack/react-query";
import type {Donor} from "../../../types/Donor";
import { getAllDonors } from "../../../api/donor";

export function useDonor () {
    return useQuery<Donor[]>({
        queryKey: ["kare", "donors"],
        queryFn: () => getAllDonors(),
    
    })
}