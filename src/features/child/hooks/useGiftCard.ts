import { useQuery } from "@tanstack/react-query";
import { getAllGiftCard } from "../../../api/child";


export function useGiftCard(){
    return useQuery<string[]>({
        queryKey: ["kare", "gift_card_types"],
        queryFn: () => getAllGiftCard()
    })
}