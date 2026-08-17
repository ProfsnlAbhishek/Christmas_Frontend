import { useMutation, useQueryClient } from "@tanstack/react-query";
import { dissociateDonorByChildID } from "../../../api/child";



export function useDissociateChildFromDonor(childID: number, donorID: number) {
    const qc = useQueryClient();

    return useMutation<{ success: boolean }, Error, { childID: number }>({
        mutationFn: () => dissociateDonorByChildID(childID),

        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["kare", "child", "unassociated", "donor" ]});
            qc.invalidateQueries({ queryKey: ["kare", "child", "donor", donorID] });
        }
    });
}