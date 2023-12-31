import React, { useState, useEffect } from "react";
import { Input, Modal, Form, Select, message, Table, DatePicker } from "antd";
import {
    UnorderedListOutlined,
    AreaChartOutlined,
    EditOutlined,
    DeleteOutlined,
} from "@ant-design/icons";
import Layout from "./../components/Layout/Layout";
import axios from "axios";
import Spinner from "../components/Spinner";
import moment from "moment";
import Analytics from "../components/Analytics";
const { RangePicker } = DatePicker;

const HomePage = () => {
    const [showModal, setShowModal] = useState(false);
    const [loading, setLoading] = useState(false);
    const [allTransaction, setAllTransaction] = useState([]);
    const [frequency, setFrequency] = useState("7");
    const [selectedDate, setSelectedDate] = useState([]);
    const [type, setType] = useState("all");
    const [viewData, setViewData] = useState("table");
    const [editTable, setEditTable] = useState(null);

    //Table data
    const columns = [
        {
            title: "Date",
            dataIndex: "date",
            render: (text) => <span> {moment(text).format("YYYY-MM-DD")}</span>,
        },
        {
            title: "Amount",
            dataIndex: "amount",
        },
        {
            title: "Type",
            dataIndex: "type",
        },
        {
            title: "Category",
            dataIndex: "category",
        },
        {
            title: "Reference",
            dataIndex: "reference",
        },
        {
            title: "Actions",
            render: (text, record) => (
                <div>
                    <EditOutlined
                        onClick={() => {
                            setEditTable(record);
                            setShowModal(true);
                        }}
                    />
                    <DeleteOutlined
                        className="mx-2"
                        onClick={() => handleDelete(record)}
                    />
                </div>
            ),
        },
    ];

    //Get all Transactions

    //useEffect Hook
    useEffect(() => {
        const getAllTransaction = async () => {
            try {
                const user = JSON.parse(localStorage.getItem("user"));
                setLoading(true);
                const res = await axios.post(
                    "/api/v1/transactions/get-transaction",
                    {
                        userid: user._id,
                        frequency,
                        selectedDate,
                        type,
                    }
                );
                setAllTransaction(res.data);
                setLoading(false);
                console.log(res.data);
            } catch (error) {
                setLoading(false);
                console.log(error);
                message.error("Can't Find The Transaction");
            }
        };
        getAllTransaction();
    }, [frequency, selectedDate, type , setAllTransaction]);

    //Delete Handler
    const handleDelete = async (record) => {
        try {
            setLoading(true);
            await axios.post("/api/v1/transactions/delete-transaction", {
                transactionId: record._id,
            });
            const user = JSON.parse(localStorage.getItem("user"));
                setLoading(true);
                const res = await axios.post(
                    "/api/v1/transactions/get-transaction",
                    {
                        userid: user._id,
                        frequency,
                        selectedDate,
                        type,
                    }
                );
                setAllTransaction(res.data);
                setLoading(false);
            message.success("Transaction Deleted");
        } catch (error) {
            setLoading(false);
            console.log(error);
            message.error("Unable to delete");
        }
    };

    //form Handling
    const handleSubmit = async (values) => {
        try {
            const user = JSON.parse(localStorage.getItem("user"));
            setLoading(true);
            if (editTable) {
                await axios.post("/api/v1/transactions/edit-transaction", {
                    payload: {
                        ...values,
                        userid: user._id,
                    },
                    transactionId: editTable._id,
                });
                setLoading(false);
                message.success("Transaction Updated Successfully");
            } else {
                await axios.post("/api/v1/transactions/add-transaction", {
                    ...values,
                    userid: user._id,
                });
                setLoading(false);
                message.success("Transaction Added Successfully");
            }
            setShowModal(false);
            setEditTable(null);
            const res = await axios.post(
                "/api/v1/transactions/get-transaction",
                {
                    userid: user._id,
                    frequency,
                    selectedDate,
                    type,
                }
            );
            setAllTransaction(res.data);
        } catch (error) {
            setLoading(false);
            message.error("Failed to add transaction");
        }
    };

    return (
        <Layout>
            {loading && <Spinner />}
            <div className="filters bg-info">
                <div>
                    <h6>Select Frequency</h6>
                    <Select
                        value={frequency}
                        onChange={(values) => setFrequency(values)}>
                        <Select.Option value="7">Last 1 Week</Select.Option>
                        <Select.Option value="30">Last 1 Month</Select.Option>
                        <Select.Option value="365"> Last 1 Year</Select.Option>
                        <Select.Option value="custom"> custom</Select.Option>
                    </Select>
                    {frequency === "custom" && (
                        <RangePicker
                            value={selectedDate}
                            onChange={(values) => setSelectedDate(values)}
                        />
                    )}
                </div>
                <div className="filter-tab">
                    <h6>Select Type</h6>
                    <Select value={type} onChange={(values) => setType(values)}>
                        <Select.Option value="all">ALL</Select.Option>
                        <Select.Option value="income">INCOME</Select.Option>
                        <Select.Option value="expense"> EXPENSE</Select.Option>
                    </Select>
                </div>
                <div className="switch-icon">
                    <UnorderedListOutlined
                        className={`mx-2 ${
                            viewData === "table"
                                ? "active-icon"
                                : "inactive-icon"
                        }`}
                        onClick={() => setViewData("table")}
                    />
                    <AreaChartOutlined
                        className={`mx-2 ${
                            viewData === "analytics"
                                ? "active-icon"
                                : "inactive-icon"
                        }`}
                        onClick={() => setViewData("analytics")}
                    />
                </div>
                <div>
                    <button
                        className="btn btn-primary"
                        onClick={() => setShowModal(true)}>
                        Add New
                    </button>
                </div>
            </div>
            <div className="content ">
                {viewData === "table" ? (
                    <Table columns={columns} dataSource={allTransaction}/>
                ) : (
                    <Analytics allTransaction={allTransaction} />
                )}
            </div>

            <Modal
                title={editTable ? "Edit Transaction" : "Add Transaction"}
                open={showModal}
                onCancel={() => setShowModal(false)}
                footer={false}>
                <Form
                    layout="vertical"
                    autoComplete="off"
                    onFinish={handleSubmit}
                    initialValues={editTable}>
                    <Form.Item label="Amount" name="amount" required>
                        <Input  type="number" required />
                    </Form.Item>
                    <Form.Item label="Type" name="type" required>
                        <Select>
                            <Select.Option value="income">Income</Select.Option>
                            <Select.Option value="expense">
                                Expense
                            </Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Category" name="category">
                        <Select>
                            <Select.Option value="salary">Salary</Select.Option>
                            <Select.Option value="tip">Tip</Select.Option>
                            <Select.Option value="project">
                                Project
                            </Select.Option>
                            <Select.Option value="food">Food</Select.Option>
                            <Select.Option value="movie">Movie</Select.Option>
                            <Select.Option value="bills">Bills</Select.Option>
                            <Select.Option value="medical">
                                Medical
                            </Select.Option>
                            <Select.Option value="fee">Fee</Select.Option>
                            <Select.Option value="tax">Tax</Select.Option>
                        </Select>
                    </Form.Item>
                    <Form.Item label="Date" name="date" required>
                        <Input type="date" required />
                    </Form.Item>
                    <Form.Item label="Reference" name="reference">
                        <Input type="text" />
                    </Form.Item>
                    <Form.Item label="Description" name="description" required>
                        <Input type="text" required />
                    </Form.Item>

                    <div className="d-flex justify-content-end">
                        <button type="submit" className="btn btn-primary">
                            {" "}
                            SAVE
                        </button>
                    </div>
                </Form>
            </Modal>
        </Layout>
    );
};

export default HomePage;
