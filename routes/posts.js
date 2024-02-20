import express from 'express'
import { commentPost, createPost, deletePost, getPostBySearch, getPosts, likePost, updatePost } from '../controllers/posts.js'
import auth from '../middleware/auth.js'

const router = express.Router()

router.post('/',auth,createPost)
router.get('/',getPosts)
router.patch('/:post_id/:user_id/likePost',auth,likePost)
router.patch('/:post_id',auth,deletePost)
router.patch('/:post_id/updatePost',auth,updatePost)
router.get('/search',getPostBySearch)
router.post('/:post_id/commentPost',auth,commentPost)

export default router