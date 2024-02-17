import mongoose from 'mongoose'

const Bot = mongoose.Schema({
    name : String,
    amount : String,
    roi : Number,
    months:String,
},{timestamps : true})

export default mongoose.model('Bot', Bot)