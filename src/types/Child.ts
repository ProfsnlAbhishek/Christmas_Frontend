export interface Child{
    childID?: number;
    f_name: string;
    l_name: string;
    age?: number | null;
    sacwisID: number | null;
    gender: string | null;
    race: string;
    clothing_type?: number | null;
    size?: string;
    shoe_size?: string | null;
    gift_card?: string | null;
    workerID: number | null;
    donorID?: number | null;
    suggestion?: string;


}


export interface ChildSmall{
    childID : number;
    f_name: string;
    l_name : string;
}


export type ChildInput = Omit<Child, "childId">;