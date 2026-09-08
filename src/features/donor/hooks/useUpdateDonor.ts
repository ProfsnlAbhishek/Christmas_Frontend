import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateDonor } from "../../../api/donor";

import type {Donor, DonorInput}  from "../../../types/Donor";

export function useUpdateDonor(id: number){
    const qc = useQueryClient();
    return useMutation<Donor, Error, DonorInput>({
        mutationFn: (payload) => updateDonor(id, payload),
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["kare", "donors", id]});
            qc.invalidateQueries({queryKey: ["kare", "donors"]});
            qc.invalidateQueries({queryKey:  ["donors", "active"]});
        }
    });
    
}