import { useQuery } from "@tanstack/react-query";
import { getAllChilds } from "../../../api/child";
import type {Child} from "../../../types/Child";

export function useChild () {
    return useQuery<Child[]>({
        queryKey: ["kare", "childs"],
        queryFn: () => getAllChilds(),
    })
}