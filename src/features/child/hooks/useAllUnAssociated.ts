import { useQuery } from "@tanstack/react-query";
import type {ChildSmall} from "../../../types/Child";
import { getAllUnAssociatedChild } from "../../../api/child";


export function useAllUnAssociated () {
    return useQuery<ChildSmall[]>({
        queryKey: ["kare", "child", "unassociated", "donor" ],
        queryFn: () => getAllUnAssociatedChild(),
    })
}