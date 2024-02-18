import mongoose from 'mongoose';

const Referral = mongoose.Schema({
    UserId : String,
    count : {type : Number, default : 0}
},{timestamps : true})


export default mongoose.model('Referral', Referral)