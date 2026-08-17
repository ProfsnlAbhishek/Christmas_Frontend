import { useMutation, useQueryClient } from "@tanstack/react-query";
import { associateDonorByChildID } from "../../../api/child";


export function useAssociateChildToDonor(childID: number, donorID: number) {
    const qc = useQueryClient();

    return useMutation<{ success: boolean }, Error, { donorID: number }>({
        mutationFn: (payload) => associateDonorByChildID(childID, payload),

        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["kare", "child", "unassociated", "donor" ]});
            qc.invalidateQueries({ queryKey: ["kare", "child", "donor", donorID] });
        }
    });
}