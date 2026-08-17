import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDonorContact } from "../../../api/contacts";

import type {Contact, ContactInput} from "../../../types/DonorContact";




export function useCreateDonorContact(){
    const qc = useQueryClient();
    return useMutation<Contact, Error, ContactInput>({
        mutationFn: createDonorContact,
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ['kare', "donors", "contact"]})
        }
    })
}