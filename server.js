import mongoose from 'mongoose'
import express from 'express'
import cors from 'cors'

import * as dotenv from 'dotenv';

const app = express()
app.use(cors())
dotenv.config()
app.use(express.json())

import AdminWalletAddress from "./routes/admin/WalletAddressRoutes.js";
import Auth from './routes/AuthRoutes.js'
import AdminUsers from './routes/admin/UsersRoutes.js'
import Subscriptions from  './routes/SubscriptionsRoutes.js'
import AdminSubscriptions from "./routes/admin/AdminSubscriptionsRoutes.js";
import AdminSettings from './routes/admin/SettingsRoutes.js'
import ROI from './routes/ROIRoutes.js'
import Dashboard from "./routes/DashboardRoutes.js";
import AdminDashboard from "./routes/admin/AdminDashboardRoutes.js";
import Withdrawals from "./routes/WithdrawalsRoutes.js";
import AdminWithdrawals from "./routes/admin/AdminWithdrawalsRoutes.js";
import Referral from './routes/ReferralRoutes.js'



app.use('/api/auth', Auth)
app.use('/api/subscriptions', Subscriptions)
app.use('/api/roi', ROI)
app.use('/api/dashboard', Dashboard)
app.use('/api/withdrawals', Withdrawals)
app.use('/api/referral', Referral)






// Admin Routes
app.use("/api/admin/users", AdminUsers);
app.use('/api/admin/subscriptions', AdminSubscriptions)
app.use("/api/admin/wallet-address", AdminWalletAddress);
app.use("/api/admin/settings", AdminSettings);
app.use("/api/admin/withdrawals", AdminWithdrawals);
app.use("/api/admin/dashboard", AdminDashboard);




const PORT = process.env.PORT || 4000;
app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  console.log("connecting to mongodb...");
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("connected 👍🏽");
  } catch (e) {
    console.log("error connecting to mongodb: " + e.message);
  }
});