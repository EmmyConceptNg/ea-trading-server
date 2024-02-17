import WalletAddress from "../models/WalletAddress.js";

export const index = (req, res) => {
  WalletAddress.find({})
    .then((walletAddress) =>
      res.status(200).json({ walletAddress: walletAddress })
    )
    .catch((error) => res.status(500).json({ error: error.message }));
};



export const createWallet = async(req, res) => {

const wallet = await WalletAddress.find({});
const {ethereumAddress, bitcoinAddress} = req.body;


try {
    
if (!wallet || wallet.length === 0) {
  WalletAddress.create({
    bitcoin: bitcoinAddress,
    ethereum: ethereumAddress,
  }).then((_wallet) => {
    res
      .status(200)
      .json({ wallet: _wallet, message: "wallet created successfully" });
  });
} else {
  await WalletAddress.findOneAndUpdate(
    {},
    {
      bitcoin: bitcoinAddress,
      ethereum: ethereumAddress,
    },
    { new: true }
  ).then((_wallet) => {
    res
      .status(200)
      .json({ wallet: _wallet, message: "wallet updated successfully" });
  });
}
} catch (error) {
    res.status(500).json({ error: error.message });
}


    
}