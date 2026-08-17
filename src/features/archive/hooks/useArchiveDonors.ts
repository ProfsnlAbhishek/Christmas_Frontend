
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveDonors } from "../../../api/donor";

export function useArchiveDonors() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => archiveDonors(),
        onSuccess: () => {
               qc.invalidateQueries({queryKey: ["kare", "donors"]})
        }
        
    });
}
