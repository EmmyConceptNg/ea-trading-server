import Subscription from "../models/Subscription.js"

export const index =(req, res)=>{
    const {userId} = req.params;
   const page = parseInt(req.query.page) || 1;
   const limit = 10;

   // Query to count total subsriptions
   Subscription.countDocuments({ userId })
     .then((totalSubscriptions) => {
       // Calculate total pages
       const totalPages = Math.ceil(totalSubscriptions / limit);

       // Query to find subsriptions for the current page
       Subscription.find({ userId })
         .sort({ createdAt: -1 })
         .skip((page - 1) * limit)
         .limit(limit)
         .then((subscriptions) => {
           res
             .status(200)
             .json({ subscriptions, currentPage: page, totalPages });
         })
         .catch((error) => {
           res.status(400).json({ error: error.message });
         });
     })
     .catch((error) => {
       res.status(400).json({ error: error.message });
     });
}