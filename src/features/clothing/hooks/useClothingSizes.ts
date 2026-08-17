import { useQuery } from "@tanstack/react-query";
import { getAllClothingSize } from "../../../api/clothing";


export function useClothingSizes(id: number | null){
    return useQuery<string[]>({
        queryKey: ["kare", "clothingSizes", id],
        queryFn: () => getAllClothingSize(id!),
        enabled: id !== null,
    })
}