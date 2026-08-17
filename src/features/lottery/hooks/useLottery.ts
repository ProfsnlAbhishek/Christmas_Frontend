import { useQuery } from "@tanstack/react-query";
import { getAllLottery } from "../../../api/lottery";
import type {Lottery} from '../../../types/Lottery';


export function useLottery(){
    return useQuery<Lottery[]>({
        queryKey: ["kare", "lottery"],
        queryFn: () => getAllLottery(),
    })
}