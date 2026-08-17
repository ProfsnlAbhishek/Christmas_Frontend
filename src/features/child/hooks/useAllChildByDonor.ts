import { useQuery } from "@tanstack/react-query";
import type {ChildSmall} from "../../../types/Child";
import { getAllChildByDonorID } from "../../../api/child";

export function useAllChildByDonor (id: number) {
    return useQuery<ChildSmall[]>({
        queryKey: ["kare", "child", "donor", id],
        queryFn: () => getAllChildByDonorID(id),
        enabled : !!id, 
    })
}