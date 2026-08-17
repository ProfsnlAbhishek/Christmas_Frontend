import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteDonorContact } from "../../../api/contacts";


  type DeleteVariables = {
    contactID: number;
    donorID: number
  }


export function useDeleteDonorContact() {
    const qc = useQueryClient();

    return useMutation<void, Error, DeleteVariables>({
        mutationFn: ({contactID}) => deleteDonorContact(contactID),
        onSuccess:(_, variables) =>{
           qc.invalidateQueries({ queryKey: ["kare", "childs"],});
            qc.invalidateQueries({queryKey: ["kare", "donors", 'contact', variables.donorID]});
         
        }
    })
}