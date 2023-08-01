const moment = require("moment");
const transactionModel = require("../models/transactionModel");

const getAllTransaction = async (req, res) => {
    try {
        const { frequency, selectedDate, type } = req.body;
        const Transactions = await transactionModel.find({
            ...(frequency !== "custom"
                ? {
                      date: {
                          $gt: moment()
                              .subtract(Number(frequency), "d")
                              .toDate(),
                      },
                  }
                : {
                      date: {
                          $gte: selectedDate[0],
                          $lte: selectedDate[1],
                      },
                  }),
            userid: req.body.userid,
            ...(type !== "all" && { type }),
        });
        res.status(200).json(Transactions);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const deleteTransaction = async (req, res) => {
    try {
        await transactionModel.findByIdAndDelete({
            _id: req.body.transactionId,
        });
        res.status(200).send("Deleted Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const editTransaction = async (req, res) => {
    try {
        await transactionModel.findByIdAndUpdate(
            { _id: req.body.transactionId },
            req.body.payload
        );
        res.status(200).send("Edit Successfully");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

const addTransaction = async (req, res) => {
    try {
        const newTransaction = new transactionModel(req.body);
        await newTransaction.save();
        res.status(201).send("Transaction Added");
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

module.exports = {
    getAllTransaction,
    addTransaction,
    editTransaction,
    deleteTransaction,
};
