import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Space, DatePicker, Row, Col, Form, Button, message, Spin } from "antd";
import { fetchAllVegetables, fetchFavoriteVegetables } from "../../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../../redux/store";
import dayjs from "dayjs";
import { AddOrder, GetBillNo, GetLrNo } from "../../services/orderAPI";
import { useNavigate } from "react-router-dom";

interface Vegetable {
  Itm_Id: number;
  Itm_Name: string;
  Sale_Rate: number;
  data?: Vegetable[];
  Uni_ID?: number;
}

const AllOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { favorites, loading, all } = useSelector((state: RootState) => state.vegetables);
  const [quantities, setQuantities] = useState<Record<string, string>>({});
  const [billDate, setBillDate] = useState(dayjs(Date.now()));
  const [lrNo, setLrNo] = useState<string | null>(null);
  const [billNo, SetBillNo] = useState<string | null>(null);
  const [searchText, setSearchText] = useState("");
  const [filteredData, setFilteredData] = useState<Vegetable[]>([]);
  const [mergedData, setMergedData] = useState<Vegetable[]>([]);
  const [addLoding, setAddLoding] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Normalize 'all' data to match 'favorites' shape
    const normalizedAll = all.map(item => ({
      ...item,
      Itm_Id: item.Itm_ID, // convert to match favorites
    }));

    const map = new Map<number, Vegetable>();
    favorites.forEach(item => map.set(item.Itm_Id, item));
    normalizedAll.forEach(item => map.set(item.Itm_Id, item)); // Now keys match

    const merged = Array.from(map.values());
    setMergedData(merged);

    // Initially show only favorites
    setFilteredData(favorites);
  }, [favorites, all]);


  useEffect(() => {
    if (searchText.trim() === "") {
      // If no search, show only favorites
      setFilteredData(favorites);
    } else {
      const lowerSearch = searchText.toLowerCase();
      const filtered = mergedData.filter(item =>
        item.Itm_Name.toLowerCase().includes(lowerSearch)
      );
      setFilteredData(filtered);
    }
  }, [searchText, mergedData, favorites]);



  useEffect(() => {
    dispatch(fetchFavoriteVegetables());
    dispatch(fetchAllVegetables());
  }, [dispatch]);


  const handleManualInput = (itemId: number, value: string) => {
    if (value === "" || /^\d*\.?\d{0,3}$/.test(value)) {
      setQuantities((prev) => ({ ...prev, [itemId]: value }));
    }
  };

  const handleDateChange = async (date: dayjs.Dayjs | null) => {
    if (date) {
      const dateFormatted = date.format("YYYY-MM-DD");
      setBillDate(dayjs(dateFormatted));
      try {
        const formattedDate = date.format("YYYY-MM-DD");
        const res = await GetLrNo(formattedDate);
        setLrNo(res?.data?.Order_Count);
      } catch {
        setLrNo(null);
      }
    }
  };

  const handleGetBillNo = async () => {
    try {
      const res = await GetBillNo();
      console.log("res", res);
      SetBillNo(res?.data?.Bill_No);
    } catch {
      SetBillNo(null);
    }

  };

  useEffect(() => {
    handleDateChange(billDate);
    handleGetBillNo();
  }, []);

  // const handleAddOrder = () => {
  //   const orderDetails = favorites.map((item) => ({
  //     Itm_Id: item.Itm_Id,
  //     Itm_Name: item.Itm_Name,
  //     Sale_Rate: item.Sale_Rate,
  //     Quantity: quantities[item.Itm_Id] || "",
  //   }));
  //   console.log("Order Details:", orderDetails);
  // };

  const handleAddOrder = async () => {

    const details = mergedData
      .filter((item) => quantities[item.Itm_Id]) // include only if quantity exists
      .map((item) => ({
        Itm_Id: item.Itm_Id,
        Inward: parseFloat(quantities[item.Itm_Id]),
        Uni_ID: item.Uni_ID, // Assuming Uni_ID is fixed; update if dynamic
        Itm_Name: item.Itm_Name,
      }));


    const payload = {
      mode: "add",
      details,
      Bill_No: billNo,
      Order_Count: lrNo,
      Bill_Date: billDate.format("YYYY-MM-DD"),
    };

    try {
      setAddLoding(true);
      await AddOrder(payload);
      setQuantities({});
      await handleDateChange(billDate);
      await handleGetBillNo();
      message.success("Order added successfully");

    } catch (error) {
      message.error("Failed to add order");
      console.error("Error while adding order: ", error);
    } finally {
      setAddLoding(false);
    }
  };


  const columns = [
    {
      title: "Sr No.",
      key: "serial",
      render: (_: unknown, __: unknown, index: number) => index + 1,
    },
    {
      title: "Name",
      dataIndex: "Itm_Name",
      key: "Itm_Name",
    },
    {
      title: "Quantity",
      key: "quantity",
      render: (_: unknown, record: Vegetable) => (
        <Input
          placeholder="0"
          value={quantities[record.Itm_Id] || ""}
          onChange={(e) => handleManualInput(record.Itm_Id, e.target.value)}
          size="small"
          className="custom-input"
        />
      ),
    },
    {
      title: "Unit",
      dataIndex: "Uni_Name",
      key: "Uni_Name",
    },


  ];

  return (
    <div className="p-4">
      {addLoding ? (
        <div className="flex justify-center items-center h-screen">
          <Spin size="large" />
        </div>
      ) : (
        <>
          <div className="flex flex-wrap gap-2 mb-4">
            <DatePicker
              value={billDate}
              onChange={handleDateChange}
              format="dddd, DD-MM-YYYY"
              size="small"
            />

            <Form.Item label="Order No." colon={false} style={{ marginBottom: 0 }}>
              <Input
                placeholder="Order Number"
                value={billNo || ""}
                size="small"
                disabled
              />
            </Form.Item>

            <Form.Item label="Order Count" colon={false} style={{ marginBottom: 0 }}>
              <Input
                placeholder="Order Count"
                value={lrNo || ""}
                size="small"
                disabled
              />
            </Form.Item>

            <Button type="primary" onClick={() => navigate("/view-orders")}>
              View Orders
            </Button>
          </div>

          <div className="flex flex-wrap gap-3 justify-start mt-4 mb-4">
            <Button type="primary" onClick={handleAddOrder}>Add Order</Button>
            <Button type="primary">Modify Order</Button>
            <Button type="primary">Delete Order</Button>
          </div>
          <Space direction="vertical" style={{ width: "100%" }}>
            <Input.Search
              placeholder="Search by vegetable name"
              allowClear
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              enterButton
            />

            <Table
              columns={columns}
              dataSource={filteredData}
              rowKey={(record) => record.Itm_Id}
              loading={loading}
              pagination={{ pageSize: 20 }}
              scroll={{ x: true }}
              bordered
              size="small"
            />
          </Space>

          {/* <div className="flex flex-wrap gap-3 justify-start mt-4">
              <Button type="primary" onClick={handleAddOrder}>Add Order</Button>
              <Button type="primary">Modify Order</Button>
              <Button type="primary">Delete Order</Button>
            </div> */}
        </>
      )}
    </div>
  );

};

export default AllOrders;
