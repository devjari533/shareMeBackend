import mongoose from 'mongoose'

const postSchema = mongoose.Schema({
    name:String,
    userId:String,
    title:String,
    message:String,
    tags:[String],
    selectedFile:String,
    likes:{
        type:[String],
        default:[],
    },
    comments:{
        type:[String],
        default:[],
    },
    createdAt:{
        type:Date,
        default: new Date(),
    },
})

export default mongoose.model('PostMessage',postSchema)