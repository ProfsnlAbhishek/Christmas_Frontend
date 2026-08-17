
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveChildren } from "../../../api/child";

export function useArchiveChild() {
    const qc = useQueryClient();
    return useMutation({
        mutationFn: () => archiveChildren(),
        onSuccess: () => {
               qc.invalidateQueries({queryKey: ["kare", "childs"]})
        }
        
    });
}
