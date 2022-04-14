import mongoose from "mongoose";
import * as bcrypt from "bcrypt"


export const RestaurantSchema = new mongoose.Schema({
    email:{type:String, unique: true, required: true},
    password:{type:String, required: true},
    name:{type:String},
    phone:{type:String},
    selectedPlan:{type:String},
    selectedLocation:{
        longitude:String,
        latitude:String
    },
    image:{
        type:Object,
        id:String,
        url:String
    }
})

RestaurantSchema.pre('save', async function(next){
    try {    
        if (!this.isModified('password')) {
            return next();
        }
        const hashed = await bcrypt.hash(this['password'], 10)       
        this['password'] = hashed;
        return next();
    } catch (error) {
        return next(error);
    }
})

