import { useMutation, useQueryClient } from "@tanstack/react-query";
import { archiveLottery } from "../../../api/lottery";

export function useArchiveLottery(){
    const qc = useQueryClient();
    return useMutation<{success: boolean}, Error, void> ({
        mutationFn: () => archiveLottery(),
        onSuccess: ()=>{
            qc.invalidateQueries({queryKey: ["kare", "lottery"]})   
        }
    })
}