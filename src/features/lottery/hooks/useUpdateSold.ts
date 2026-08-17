import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateSold } from "../../../api/lottery";
import { type Lottery} from "../../../types/Lottery";


export function useUpdateSold(id: number){
    const qc = useQueryClient();
    return useMutation<Lottery, Error, Lottery>({
        mutationFn: (payload) => updateSold(id, payload),
        onSuccess:() =>{
            qc.invalidateQueries({queryKey: ["kare", "lottery"]})
        }
    });
}


