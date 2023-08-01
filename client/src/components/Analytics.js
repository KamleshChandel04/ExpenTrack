import { Progress } from "antd";
import React from "react";

const Analytics = ({ allTransaction }) => {
    //Category
    const category = [
        "salary",
        "tip",
        "project",
        "food",
        "movie",
        "bills",
        "medical",
        "fee",
        "tax",
    ];

    //Total Transaction

    const totalTransaction = allTransaction.length;
    const totalIncomeTransaction = allTransaction.filter(
        (transaction) => transaction.type === "income"
    );
    const totalExpenseTransaction = allTransaction.filter(
        (transaction) => transaction.type === "expense"
    );
    const totalIncomePercent =
        (totalIncomeTransaction.length / totalTransaction) * 100;
    const totalExpensePercent =
        (totalExpenseTransaction.length / totalTransaction) * 100;

    //Total Turnover

    const totalTurnover = allTransaction.reduce(
        (acc, transaction) => acc + transaction.amount,
        0
    );

    const totalIncomeTurnover = allTransaction
        .filter((transaction) => transaction.type === "income")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalExpenseTurnover = allTransaction
        .filter((transaction) => transaction.type === "expense")
        .reduce((acc, transaction) => acc + transaction.amount, 0);

    const totalIncomeTurnoverPercent =
        (totalIncomeTurnover / totalTurnover) * 100;

    const totalExpenseTurnoverPercent =
        (totalExpenseTurnover / totalTurnover) * 100;

    return (
        <>
            <div className="row m-3">
                {/* for Transaction */}
                <div className="col-md-3">
                    <div className="card">
                        <div className="bg-primary p-2 text-light">
                            Total Transactions : {totalTransaction}
                        </div>

                        <div className="card-body">
                            <h5 className="text-success">
                                Income : {totalIncomeTransaction.length}
                            </h5>
                            <h5 className="text-danger">
                                Expense : {totalExpenseTransaction.length}
                            </h5>
                            <div className="d-flex flex-column aling-items-center">
                                <Progress
                                    type="circle"
                                    strokeColor={"green"}
                                    className="mx-2"
                                    percent={totalIncomePercent.toFixed(0)}
                                />
                                <Progress
                                    type="circle"
                                    strokeColor={"red"}
                                    className="mx-2 mt-3"
                                    percent={totalExpensePercent.toFixed(0)}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* for Transaction */}

                {/* for Turnover */}
                <div className="col-md-3">
                    <div className="card">
                        <div className="bg-primary p-2 text-light">
                            Total Turnover : {totalTurnover}
                        </div>

                        <div className="card-body">
                            <h5 className="text-success">
                                Income : {totalIncomeTurnover}
                            </h5>
                            <h5 className="text-danger">
                                Expense : {totalExpenseTurnover}
                            </h5>
                            <div>
                                <Progress
                                    type="circle"
                                    strokeColor={"green"}
                                    className="mx-2"
                                    percent={totalIncomeTurnoverPercent.toFixed(
                                        0
                                    )}
                                />
                                <Progress
                                    type="circle"
                                    strokeColor={"red"}
                                    className="mx-2 mt-3"
                                    percent={totalExpenseTurnoverPercent.toFixed(
                                        0
                                    )}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                {/* for Turnover */}

                {/* Category wise Income */}
                <div className=" col-md-3">
                    <h6 className="bg-warning p-2 text-light">Category Wise Income</h6>
                    {category.map((category) => {
                        const amount = allTransaction
                            .filter(
                                (transaction) =>
                                    transaction.type === "income" &&
                                    transaction.category === category
                            )
                            .reduce(
                                (acc, transaction) => acc + transaction.amount,
                                0
                            );

                        return (
                            amount > 0 && (
                                <div className="card mt-2">
                                    <div className="card-body">
                                        <h6>{category}</h6>
                                        <Progress
                                            percent={(
                                                (amount / totalIncomeTurnover) *
                                                100
                                            ).toFixed(0)}
                                        />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
                {/* Category wise Income */}

                {/* Category wise Expense */}
                <div className=" col-md-3">
                    <h6 className="bg-warning p-2 text-light">Category Wise Expense</h6>
                    {category.map((category) => {
                        const amount = allTransaction
                            .filter(
                                (transaction) =>
                                    transaction.type === "expense" &&
                                    transaction.category === category
                            )
                            .reduce(
                                (acc, transaction) => acc + transaction.amount,
                                0
                            );

                        return (
                            amount > 0 && (
                                <div className="card mt-2">
                                    <div className="card-body">
                                        <h6>{category}</h6>
                                        <Progress
                                            percent={(
                                                (amount / totalExpenseTurnover) *
                                                100
                                            ).toFixed(0)}
                                        />
                                    </div>
                                </div>
                            )
                        );
                    })}
                </div>
                {/* Category wise Expense */}
            </div>
            <div className="row mt-3 analytics"></div>
        </>
    );
};

export default Analytics;
