import mongoose from 'mongoose'

const WalletAddress = mongoose.Schema(
  {
    bitcoin: String,
    ethereum: String,
  },
  { timestamps: true }
);


export default mongoose.model('WalletAddress', WalletAddress);