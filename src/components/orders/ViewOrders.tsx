import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Space, DatePicker, Row, Col, Form, Button, message, Modal, Select } from "antd";
import { AppDispatch, RootState } from "../../redux/store";
import dayjs, { Dayjs } from "dayjs";
import { fetchOrders } from "../../redux/actions/ordersAction";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import { Deleteorder, GetAllYear } from "../../services/orderAPI";
import { useNavigate } from "react-router-dom";


interface OrderRecord {
    Bill_No: string;
}

const ViewOrders = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading } = useSelector((state: RootState) => state.orders) as { orders: any[] | null; loading: boolean };
    const { user } = useSelector((state: RootState) => state.auth) as { user: { Ac_Name?: string, isAdmin: boolean } | null };
    const { RangePicker } = DatePicker;
    const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const { Option } = Select;
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrderItems, setSelectedOrderItems] = useState<any[]>([]);
    const [allYear, setAllYear] = useState<{ db_name: string; year1: string; year2: string; year_type: string }[] | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | undefined>();

    useEffect(() => {
        const fetchAllYear = async () => {
            try {
                const res = await GetAllYear();
                const data = res?.data || [];
                setAllYear(data);

                const currentYear = data.find((item: { db_name: string; year1: string; year2: string; year_type: string }) => item.year_type === "C");
                if (currentYear) {
                    setSelectedYear(currentYear.db_name);
                    let startDate;
                    let endDate;

                    if (currentYear.year_type === "C") {
                        const today = dayjs().startOf('day');
                        startDate = today;
                        endDate = today;
                    } else {
                        startDate = dayjs(`${currentYear.year1}-04-01`).startOf("day");
                        endDate = dayjs(`${currentYear.year2}-03-31`).endOf("day");
                    }

                    setSelectedDates([startDate, endDate]);
                }
            } catch (error) {
                console.error("Error fetching year data:", error);
            }
        }
        fetchAllYear();
    }, [])

    useEffect(() => {
        if (selectedDates) {
            const payload = {
                fromDate: selectedDates[0].format("YYYY-MM-DD"),
                toDate: selectedDates[1].format("YYYY-MM-DD"),
                db_name: selectedYear,
            };

            dispatch(fetchOrders(payload));
        }
    }, [selectedDates, dispatch, selectedYear]);


    const columns = [
        ...(user && user.isAdmin
            ? [{
                title: "Order Id",
                dataIndex: "Ac_Code",
                key: "Ac_Code",
            }]
            : []),
        ...(user && user.isAdmin
            ? [{
                title: "Account Name",
                dataIndex: "Ac_Name",
                key: "Ac_Name",
            }]
            : []),
        {
            title: "Order Number",
            dataIndex: "Bill_No",
            key: "Bill_No",
            sorter: (a: any, b: any) => {
                const aNum = parseInt(a.Bill_No);
                const bNum = parseInt(b.Bill_No);
                return aNum - bNum;
            },
        },
        {
            title: "Order Date",
            dataIndex: "Bill_Date",
            key: "Bill_Date",
            render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
        },
        ...(user && !user.isAdmin
            ? [
                {
                    title: "Action",
                    key: "action",
                    render: (_: unknown, record: OrderRecord) => (
                        <div className="flex items-center gap-3">
                            <Button
                                size="small"
                                onClick={() => handleEdit(record)}
                            >
                                <EditOutlined style={{ fontSize: "14px" }} />
                            </Button>
                            <Button
                                size="small"
                                danger
                                onClick={() => handleDelete(record)}
                            >
                                <DeleteOutlined style={{ fontSize: "14px" }} />
                            </Button>
                        </div>
                    ),
                },
            ]
            : []),
    ];


    const handleEdit = (record: any) => {
        if (record.Bill_No) {
            // Passing data via state
            navigate("/add-orders", { state: { orderData: record } });
        } else {
            message.error("Invalid Bill Number");
        }
    };


    const handleDelete = async (record: OrderRecord) => {
        if (!record?.Bill_No) {
            message.error("Invalid Bill Number");
            return;
        }

        Modal.confirm({
            title: "Are you sure you want to delete this order?",
            content: `Order No: ${record.Bill_No}`,
            okText: "Yes",
            okType: "danger",
            cancelText: "Cancel",
            onOk: async () => {
                try {
                    await Deleteorder(record.Bill_No);
                    message.success("Order deleted successfully");
                    setSelectedOrderItems([]);
                    if (selectedDates) {
                        dispatch(fetchOrders({
                            fromDate: selectedDates[0].format("YYYY-MM-DD"),
                            toDate: selectedDates[1].format("YYYY-MM-DD"),
                            db_name: selectedYear,
                        }));
                    }
                } catch {
                    message.error("Failed to delete order");
                }
            },
        });
    };

    const handleYearChange = (value: string) => {
        setSelectedYear(value);
        const selected = allYear?.find((item) => item.db_name === value);
        if (selected) {
            const start = dayjs(`${selected.year1}-04-01`).startOf("day");
            const end = dayjs(`${selected.year2}-03-31`).endOf("day");
            setSelectedDates([start, end]);
        }
    };

    const disableOutsideRange = (current: Dayjs) => {
        if (!selectedDates) return true;
        const [start, end] = selectedDates;
        return current < start.startOf('day') || current > end.endOf('day');
    };

    return (
        <div className="p-4">
            <>
                <Row>
                    {
                        user && user.isAdmin && (
                            <Col xs={24} sm={12} md={8} lg={6}>

                                <Form.Item label="Account Name" colon={false}>
                                    <Input.Search
                                        placeholder="Account Name"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        size="small"
                                        enterButton
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        )}
                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item label="Select Year" colon={false} className={user && user.isAdmin ? "date-select" : "select-year"}>
                            <Select
                                value={selectedYear}
                                onChange={handleYearChange}
                                placeholder="Select Financial Year"
                                style={{ width: "100%" }}
                            >
                                {allYear?.map((year) => (
                                    <Option key={year.db_name} value={year.db_name}>
                                        {`${year.year1}-${year.year2}`}
                                    </Option>
                                ))}
                            </Select>
                        </Form.Item>
                    </Col>

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item label="Select Date" colon={false} className={user && user.isAdmin ? "date-select" : ""}>
                            <RangePicker size="small" style={{ width: '100%' }}
                                format="DD-MM-YYYY"
                                value={selectedDates}
                                onChange={(dates) => {
                                    if (dates && dates[0] && dates[1]) {
                                        setSelectedDates([dates[0], dates[1]]);
                                    } else {
                                        setSelectedDates(null);
                                    }
                                }}
                                disabledDate={disableOutsideRange}
                            />
                        </Form.Item>
                    </Col>
                    {user && !user.isAdmin && (
                        <Col xs={24} sm={12} md={8} lg={6}>
                            <Button className="ml-0 md:ml-3" type="primary" onClick={() => navigate("/add-orders")}>
                                Add Orders
                            </Button>
                        </Col>
                    )}
                </Row>

                <Space direction="vertical" style={{ width: "100%" }}>

                    <Table
                        columns={columns}
                        rowKey={(record) => record.Bill_No}
                        dataSource={
                            orders?.filter((order) =>
                                order.Ac_Name?.toLowerCase().includes(searchTerm.toLowerCase())
                            ) || []
                        }
                        onRow={(record) => ({
                            onClick: () => setSelectedOrderItems((record as any).Details || []), // Add row click functionality
                        })}
                        loading={loading}
                        scroll={{ x: true }}
                        pagination={false}
                        bordered
                        size="small"
                    />

                    {selectedOrderItems.length > 0 && (
                        <>
                            <h2 style={{ marginTop: "3px", marginBottom: "3px" }}>Item Details</h2>
                            <Table
                                dataSource={[...selectedOrderItems].sort((a, b) => a.SrNo - b.SrNo)}
                                pagination={false}
                                bordered
                                rowKey={(record) => record.SrNo}
                                size="small"
                                columns={[
                                    {
                                        title: "Sr No.",
                                        dataIndex: "SrNo",
                                        key: "SrNo",
                                    },
                                    {
                                        title: "Item Name",
                                        dataIndex: "Itm_Name",
                                        key: "Itm_Name",
                                    },
                                    {
                                        title: "Group Name",
                                        dataIndex: "IGP_NAME",
                                        key: "IGP_NAME",
                                    },
                                    {
                                        title: "Quantity",
                                        dataIndex: "Qty",
                                        key: "Qty",
                                    },
                                    {
                                        title: "Unit",
                                        dataIndex: "Uni_Name",
                                        key: "Uni_Name",
                                    },
                                ]}
                            />
                        </>
                    )}

                </Space>
            </>
        </div>
    );

};

export default ViewOrders;
