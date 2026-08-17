import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createChild } from "../../../api/child";

import type {Child, ChildInput}  from "../../../types/Child";

export function useCreateChild(){
    const qc = useQueryClient();
    return useMutation<Child, Error, ChildInput>({
        mutationFn: createChild,
        onSuccess: () => {
            qc.invalidateQueries({queryKey: ["kare", "childs"]})
        }
    })
}