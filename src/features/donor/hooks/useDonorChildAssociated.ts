import { useQuery } from "@tanstack/react-query";
import { getAllDonorsChildAssociated } from "../../../api/donor";

export function useDonorChildAssociated(){
    return useQuery<[]>({
        queryKey: ["kare", "donors", "childAssociated"],
        queryFn: () => getAllDonorsChildAssociated(),
    })
}