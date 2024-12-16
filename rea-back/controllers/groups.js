import express from 'express';
import User from '../model/User.js'
import tokenValidation from '../middlewares/tokenValidation.js';

router.post("/groups", async (req,res)=>{
    
    try{
        const { name, product, organizer, city, target_farmers, price_per_person, end_date } = req.body;

        const newGroup = new Group({
            name,
            product,
            organizer,
            city,
            target_farmers,
            price_per_person,
            end_date,
            status: 'active', // Default status
          });
          await newGroup.save();

          res.status(201).json(newGroup);
    } catch (error){
        console.error(error);
        res.status(500).json({message: 'Server error'})
    }
})