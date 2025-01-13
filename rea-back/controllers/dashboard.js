import express from 'express';
import User from '../model/User.js'
import tokenValidation from '../middlewares/tokenValidation.js';

const SALT = Number(process.env.SALT)
const JWT_KEY = process.env.JWT_KEY
const router = express.Router();

router.get ('/:username', tokenValidation, async (req,res) => {
   
    try{
        const {username} = req.params;
        // Check if userId is available
        if (!username) {
            return res.status(400).json({ error: 'Usename not found in request' });
        }
        //fetch user details
        const user = await User.findOne({username}).select('username city');

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json({ user});
        console.log(`showing dashboard of ${username}`);
    }catch (error){
        console.log(error);
        res.status(500).json({error: 'Error fetching dashboard data'});
    }
});


export default router