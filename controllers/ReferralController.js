import User from "../models/User.js"

export const validateReferral = async(req, res) => {
    const {referral} = req.params

    try{
        const user = await User.findOne(({referralCode : referral}))

    if(user && user.referralCode === referral){
        return res
          .status(200)
          .json({
            message: "referral code verified",
            referralCode: user.referralCode,
          });
    }else{
        return res.status(404).json({error : 'wrong referral code'})
    }
    }catch(error){
        return res.status(500).json({error : error.message})
    }
}