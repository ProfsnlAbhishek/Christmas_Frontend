import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateLottery } from "../../../api/lottery";

import {type Lottery} from "../../../types/Lottery" ;

export function useUpdateLottery(id : number){
 const qc = useQueryClient();
 return useMutation<Lottery, Error, Lottery>({
    mutationFn: (payload) => updateLottery(id, payload),
    onSuccess: () => {
        qc.invalidateQueries({queryKey : ["kare", "lottery"]})
    }
 })
}