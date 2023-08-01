const express = require("express");
const {
    addTransaction,
    getAllTransaction,
    editTransaction,
    deleteTransaction,
} = require("../controllers/transactionController");

//router object
const router = express.Router();

//routers
//add Trandaction POST Method
router.post("/add-transaction", addTransaction);

//edit Trandaction POST Method
router.post("/edit-transaction", editTransaction);

//delete Trandaction POST Method
router.post("/delete-transaction", deleteTransaction);

//get Transactions
router.post("/get-transaction", getAllTransaction);

module.exports = router;
