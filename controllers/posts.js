import PostMessage from "../models/postMessage.js";
import mongoose from 'mongoose'

export const createPost = async (req,res) => {
    // console.log("Req is ",req);
    const {name,userId,title,message,tags,selectedFile} = req.body
    const newPostMessage = new PostMessage({name,userId,title,message,tags,selectedFile,createdAt:new Date().toISOString()})

    try {
        await newPostMessage.save()
        // console.log("New message",newPostMessage);
        res.status(201).json(newPostMessage)
    } catch (error) {
        console.log(error);
        res.status(409).json({message:error.message})
    }

}

export const getPosts = async(req,res)=>{
    try {
        const postMessages = await PostMessage.find().sort({"createdAt":-1})
        res.status(200).json(postMessages)
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error.message})
    }
}

export const likePost = async(req,res)=>{

    const {post_id,user_id} = req.params
    // console.log(post_id);
    try {
        if(!mongoose.Types.ObjectId.isValid(post_id)) return res.status(404).send(`No post with id:${post_id}`)
        const post = await PostMessage.findById(post_id)
        const index = post.likes.findIndex((id)=>id===String(user_id))
        // console.log("Index is ",index);
        if(index===-1){
            // console.log(req);
            // console.log(user_id);
            post.likes.push(user_id)

        }else{
            post.likes=post.likes.filter((id)=>id!==String(user_id))
        }
        const updatedPost = await PostMessage.findByIdAndUpdate(post_id,post,{new:true})
        // console.log("Updated post is ",updatedPost);
        res.status(201).json(updatedPost)
    } catch (error) {
        console.log(error);
        res.status(500).json({message:"Something went wrong"})
    }
    
}

export const deletePost = async(req,res)=>{
    const {post_id}=req.params
    if(!mongoose.Types.ObjectId.isValid(post_id)) return res.status(404).send(`No post with id: ${post_id}`)
    await PostMessage.findByIdAndDelete(post_id)
    res.json({message:"Post Deleted Successfully"})
}

export const updatePost = async(req,res)=>{
    const {post_id}=req.params
    const updatedPost = req.body

    if(!mongoose.Types.ObjectId.isValid(post_id)) return res.status(404).send(`No post with id: ${post_id}`)
    
    await PostMessage.findByIdAndUpdate(post_id,updatedPost,{new:true})
    // console.log("Updated post is",updatedPost);
    res.json(updatedPost)
}

export const getPostBySearch = async(req,res)=>{
    const {searchQuery,tags}=req.query

    try {
        const title = new RegExp(searchQuery,'i') // here i stands for ignore means [tim,Tim,TIm] all are same
        const posts = await PostMessage.find({$or:[{title},{tags:{$in:tags.split(',')}}]})
        //here or means that find post in title or tags or both field, in tags if one of the tags is equal to tags
        res.status(200).json({data:posts})
    } catch (error) {
        console.log(error);
        res.status(404).json({message:error})
    }
}

export const commentPost = async(req,res)=>{
    const {post_id}=req.params
    const {comment}=req.body

    const post = await PostMessage.findById(post_id)
    post.comments.push(comment)
    const updatedPost = await PostMessage.findByIdAndUpdate(post_id,post,{new:true})
    res.json(updatedPost)
}