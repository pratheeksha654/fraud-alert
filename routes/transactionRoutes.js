const express = require("express");

const router = express.Router();

const User = require("../models/User");
const Transaction = require("../models/Transaction");
const Alert = require("../models/Alert");

module.exports = (io) => {

  router.post("/", async (req, res) => {

    try {

      const { user_id, amount, location } = req.body;

      const user = await User.findById(user_id);

      if (!user) {
        return res.status(404).json({
          message: "User not found",
        });
      }

   
      const transaction = await Transaction.create({
        user_id,
        amount,
        location,
      });

      let fraudMessage = "";

      if (amount > 50000) {
        fraudMessage = "High amount transaction detected!";
      }

     
      if (
        user.lastLocation &&
        user.lastLocation !== location
      ) {
        fraudMessage = "Transaction from different location!";
      }

     
      if (fraudMessage) {

       
        await Alert.create({
          txn_id: transaction._id,
          message: fraudMessage,
        });

        
        io.to(user_id).emit("fraud_alert", {
          txn_id: transaction._id,
          message: fraudMessage,
          amount,
          location,
        });

        console.log("Fraud alert emitted");
      }


      user.lastLocation = location;

      await user.save();

      res.status(201).json({
        transaction,
        fraud: fraudMessage || "No fraud detected",
      });

    } catch (error) {

      res.status(500).json({
        error: error.message,
      });

    }

  });

  return router;
};