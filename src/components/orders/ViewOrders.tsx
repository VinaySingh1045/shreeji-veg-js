import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Space, DatePicker, Row, Col, Form, Button, message, Spin } from "antd";
import { fetchAllVegetables, fetchFavoriteVegetables } from "../../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../../redux/store";
import dayjs from "dayjs";
import { AddOrder, GetBillNo, GetLrNo } from "../../services/orderAPI";
import { useNavigate } from "react-router-dom";
import { fetchOrders } from "../../redux/actions/ordersAction";

interface Vegetable {
    Itm_Id: number;
    Itm_Name: string;
    Sale_Rate: number;
    data?: Vegetable[];
    Uni_ID?: number;
}

const ViewOrders = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { favorites, loading, all } = useSelector((state: RootState) => state.vegetables);
    const { RangePicker } = DatePicker;
    const [addLoading, setAddLoading] = useState(false);
    const [selectedDates, setSelectedDates] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);

    useEffect(() => {
        if (selectedDates) {
            console.log("selectedDates", selectedDates);
            const payload = {
                fromDate: selectedDates[0].format("YYYY-MM-DD"),
                toDate: selectedDates[1].format("YYYY-MM-DD"),
            };
            console.log("payload1", payload);

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
            dataIndex: "Itm_Name",
            key: "Itm_Name",
        },
        {
            title: "Order Number",
            dataIndex: "Itm_Name",
            key: "Itm_Name",
        },
        {
            title: "Order Date",
            dataIndex: "Uni_Name",
            key: "Uni_Name",
        },
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: unknown) => (
                <Button type="link" onClick={() => console.log("Show details for", record)}>
                    Details
                </Button>
            ),
        }
    ];

    return (
        <div className="p-4">
            {addLoading ? (
                <div className="flex justify-center items-center h-screen">
                    <Spin size="large" />
                </div>
            ) : (
                <>
                    <Row gutter={[16, 16]}>
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
                            dataSource={favorites}
                            rowKey={(record) => record.Itm_Id}
                            loading={loading}
                            pagination={{ pageSize: 20 }}
                            scroll={{ x: true }}
                            bordered
                        />

                    </Space>
                </>
            )}
        </div>
    );

};

export default ViewOrders;
