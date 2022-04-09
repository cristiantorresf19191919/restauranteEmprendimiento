import {Document} from "mongoose";


export interface Account extends Document {
    email: string;
    password?: string;
    name?:string;
    phone?:string;
    selectedPlan?:string;
    selectedLocation?:{
        latitude:string;
        longitude:string;
    };
    imageUrl?:string;
}