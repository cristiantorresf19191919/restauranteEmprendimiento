import {Document} from "mongoose";


export interface Restaurant extends Document {
    email: string;
    password?: string;
    name?:string;
    phone?:string;
    selectedPlan?:string;
    selectedLocation?:{
        latitude:string;
        longitude:string;
    };
    image?:{
        id?:string,
        url?:string
    }
}