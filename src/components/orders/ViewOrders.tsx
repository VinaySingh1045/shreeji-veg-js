import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Space, DatePicker, Row, Col, Form, Button, message, Spin } from "antd";
import { AppDispatch, RootState } from "../../redux/store";
import dayjs from "dayjs";
import { fetchOrders } from "../../redux/actions/ordersAction";

const ViewOrders = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { orders, loading } = useSelector((state: RootState) => state.orders);
    const { user } = useSelector((state: RootState) => state.auth) as { user: { Ac_Name?: string, isAdmin: boolean } | null };
    const { RangePicker } = DatePicker;
    const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
    const [selectedOrderItems, setSelectedOrderItems] = useState<any[]>([]);

    console.log("selectedOrderItems", selectedOrderItems);

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
            title: "Sr No.",
            key: "serial",
            render: (_: unknown, __: unknown, index: number) => index + 1,
        },
        {
            title: "Account Name",
            dataIndex: "Ac_Name",
            key: "Ac_Name",
        },
        {
            title: "Order Number",
            dataIndex: "Bill_No",
            key: "Bill_No",
        },
        {
            title: "Order Date",
            dataIndex: "Bill_Date",
            key: "Bill_Date",
            render: (date: string) => dayjs(date).format("DD-MM-YYYY"),
        },
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: unknown) => (
                <Button type="link"
                    onClick={() => {
                        console.log("Show details for", record);
                        setSelectedOrderItems((record as any).Details || []);
                    }}
                >
                    Details
                </Button>
            ),
        }
    ];

    return (
        <div className="p-4">
            <>
                <Row gutter={[16, 16]}>
                    {
                        user && user.isAdmin && (
                            <Col xs={24} sm={12} md={8} lg={6}>

                                <Form.Item label="Account Name" colon={false}>
                                    <Input.Search
                                        placeholder="Account Name"
                                        value=""
                                        size="small"
                                        enterButton
                                        style={{ width: '100%' }}
                                    />
                                </Form.Item>
                            </Col>
                        )}

                    <Col xs={24} sm={12} md={8} lg={6}>
                        <Form.Item label="Select Date" colon={false}>
                            <RangePicker size="small" style={{ width: '100%' }}
                                //  onChange={(dates) => setSelectedDates(dates)} 
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
                </Row>

                <Space direction="vertical" style={{ width: "100%" }}>

                    <Table
                        columns={columns}
                        dataSource={orders || []}
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
                                dataSource={selectedOrderItems}
                                pagination={false}
                                bordered
                                // rowKey={(record) => record.Itm_Id}
                                size="small"
                                columns={[
                                    {
                                        title: "Sr No.",
                                        key: "serial",
                                        render: (_: unknown, __: unknown, index: number) => index + 1,
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
                                        render: (qty: number) => qty.toFixed(3),
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
