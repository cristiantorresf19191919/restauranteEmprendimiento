import mongoose from "mongoose";
import * as bcrypt from "bcrypt"


export const AccountSchema = new mongoose.Schema({
    email:{type:String, unique: true, required: true},
    password:{type:String, required: true},
    name:{type:String},
    phone:{type:String},
    selectedPlan:{type:String},
    selectedLocation:{
        longitude:String,
        latitude:String
    },
    imageUrl:{type:String}
})

AccountSchema.pre('save', async function(next){
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

