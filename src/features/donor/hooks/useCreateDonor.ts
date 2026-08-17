import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createDonor } from "../../../api/donor";

import type {Donor, DonorInput}  from "../../../types/Donor";

export function useCreateDonor(){
    const qc = useQueryClient();
    return useMutation<Donor, Error, DonorInput>({
        mutationFn: createDonor,
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["kare", "donors"]})
        }
    })
}