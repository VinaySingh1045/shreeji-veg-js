import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Space, DatePicker, Row, Col, Form, Button, message, Modal } from "antd";
import { AppDispatch, RootState } from "../../redux/store";
import dayjs from "dayjs";
import { fetchOrders } from "../../redux/actions/ordersAction";
import { DeleteOutlined } from "@ant-design/icons";
import { Deleteorder } from "../../services/orderAPI";
import { useNavigate } from "react-router-dom";


interface OrderRecord {
    Bill_No: string;
}

const ViewOrders = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading } = useSelector((state: RootState) => state.orders) as { orders: any[] | null; loading: boolean };
    const { user } = useSelector((state: RootState) => state.auth) as { user: { Ac_Name?: string, isAdmin: boolean } | null };
    const { RangePicker } = DatePicker;
    // const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const today = dayjs();
    // If current month is before April (i.e., Jan–Mar), we're in the *last* financial year
    const fiscalYearStart = today.month() < 3
        ? dayjs(`${today.year() - 1}-04-01`).startOf("day")
        : dayjs(`${today.year()}-04-01`).startOf("day");

    const fiscalYearEnd = fiscalYearStart.add(1, "year").subtract(1, "day").endOf("day");

    const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>([
        fiscalYearStart,
        fiscalYearEnd
    ]);

    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedOrderItems, setSelectedOrderItems] = useState<any[]>([]);

    useEffect(() => {
        if (selectedDates) {
            const payload = {
                fromDate: selectedDates[0].format("YYYY-MM-DD"),
                toDate: selectedDates[1].format("YYYY-MM-DD"),
            };

            dispatch(fetchOrders(payload));
        }
    }, [selectedDates, dispatch]);


    const columns = [
        {
            title: "Order Id",
            key: "serial",
            render: (_: unknown, __: unknown, index: number) => index + 1,
        },
        ...(user && user.isAdmin
            ? [{
                title: "Account Name",
                dataIndex: "Ac_Name",
                key: "Ac_Name",
            }]
            : []),
        {
            title: "Bill Number",
            dataIndex: "Bill_No",
            key: "Bill_No",
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
                          <div className="flex items-center gap-1">
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
                        }));
                    }
                } catch {
                    message.error("Failed to delete order");
                }
            },
        });
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
                        <Form.Item label="Select Date" colon={false} className={user && user.isAdmin ? "date-select" : ""}>
                            <RangePicker size="small" style={{ width: '100%' }}
                                value={selectedDates}
                                onChange={(dates) => {
                                    if (dates && dates[0] && dates[1]) {
                                        setSelectedDates([dates[0], dates[1]]);
                                    } else {
                                        setSelectedDates(null);
                                    }
                                }}
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
                        // dataSource={orders || []}
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

                    {selectedOrderItems && (
                        <>
                            <h2 style={{ marginTop: "3px", marginBottom: "3px" }}>Item Details</h2>
                            <Table
                                // dataSource={selectedOrderItems}
                                dataSource={[...selectedOrderItems].sort((a, b) => a.SrNo - b.SrNo)}
                                pagination={false}
                                bordered
                                // rowKey={(record) => record.Itm_Id}
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
