import { useQuery } from "@tanstack/react-query";
import { getAllClothingTypes } from "../../../api/clothing";

import type {Clothing} from "../../../types/Clothing";


export function useClothingTypes(){
    return useQuery<Clothing[]>({
        queryKey: ["kare", "clotingTypes"],
        queryFn: () => getAllClothingTypes()
    });
}