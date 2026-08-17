import { useQuery } from "@tanstack/react-query";
import { getAllRace } from "../../../api/child";

export function useRace(){
    return useQuery<string[]>({
        queryKey: ["kare", "race"],
        queryFn: () => getAllRace(),
    })
}