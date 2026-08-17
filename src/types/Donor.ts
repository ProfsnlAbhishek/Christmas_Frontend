export interface Donor{
    donorID?: number;
    donor_name : string;
    address1: string;
    address2: string;
    city: string;
    state : string;
    zip : string;
    pick_date?: string;
    pick_assigned_to: string;
    pick_det: string;
    kids_tag?: number;
    age0_11: number,
    age12abv: number,
    gift_tag?: number;
    inf_boy?: number;
    inf_girl?: number;
    tod_boy?: number;
    tod_girl?: number;
    age6_10b?: number;
    age6_10g?: number;
    age11_14b?: number;
    age11_14g?: number;
    age15_18b?: number;
    age15_18g?: number;
    toy_dr: boolean;
    instruction?: string;
    active?: boolean;
}

export type DonorInput = Omit<Donor, "donorID">;