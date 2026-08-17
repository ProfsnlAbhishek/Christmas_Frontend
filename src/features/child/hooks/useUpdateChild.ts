import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateChild } from "../../../api/child";

import type {Child, ChildInput} from "../../../types/Child";

export function useUpdateChild(id:number){
    const qc = useQueryClient();
    return useMutation<Child, Error, ChildInput>({
        mutationFn: (payload) => updateChild(id, payload),
        onSuccess: () => 
            qc.invalidateQueries({queryKey: ["kare", "childs"]})
    })
}

