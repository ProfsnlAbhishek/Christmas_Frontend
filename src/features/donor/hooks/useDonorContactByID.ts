import { useQuery } from "@tanstack/react-query";
import { getAllDonorContactsByID } from "../../../api/contacts";
import type {Contact} from "../../../types/DonorContact";


export function useDonorContactByID(id: number){
    return useQuery<Contact[]>({
        queryKey: ["kare", "donors", 'contact', id],
        queryFn: () =>getAllDonorContactsByID(id),
    });
}