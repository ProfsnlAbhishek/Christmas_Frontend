import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteLottery } from "../../../api/lottery";

import {type Lottery} from "../../../types/Lottery";


export function useDeleteLottery(id: number){
const qc=useQueryClient();
return useMutation<Lottery, Error, Lottery>({
    mutationFn: (payload) => deleteLottery(id, payload),
    onSuccess:() =>{
        qc.invalidateQueries({queryKey: ["kare", "lottery"]})
    }
});
}