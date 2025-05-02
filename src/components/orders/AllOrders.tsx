import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Space, DatePicker, Form, Button, message, Spin } from "antd";
import { fetchAllVegetables, fetchFavoriteVegetables } from "../../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../../redux/store";
import dayjs from "dayjs";
import { AddOrder, GetBillNo, GetLrNo } from "../../services/orderAPI";
import { Vegetable } from "../../redux/slice/vegesSlice";

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

  useEffect(() => {
    const normalizedAll = all.map(item => ({
      ...item,
      Itm_Id: item.Itm_ID,
    }));

    const map = new Map<number, Vegetable>();
    favorites.forEach(item => {
      if (item.Itm_Id !== undefined) {
        map.set(item.Itm_Id, item);
      }
    });
    normalizedAll.forEach(item => {
      if (item.Itm_Id !== undefined) {
        map.set(item.Itm_Id, item);
      }
    });

    const merged = Array.from(map.values());
    setMergedData(merged);

    // Initially show only favorites
    setFilteredData(favorites);
  }, [favorites, all]);

  useEffect(() => {
    const lowerSearch = searchText.trim().toLowerCase();
    console.log("lowerSearch", lowerSearch);
  
    const searchMatched = mergedData.filter(item =>
      item.Itm_Name.toLowerCase().includes(lowerSearch)
    );
    const quantityItems = mergedData.filter(item => {
      const quantity = item.Itm_Id !== undefined ? parseFloat(quantities[item.Itm_Id] || "0") : 0;
      return quantity > 0;
    });
    const favoriteWithQuantity = favorites.filter(item => {
      const quantity = item.Itm_Id !== undefined ? parseFloat(quantities[item.Itm_Id] || "0") : 0;
      return quantity > 0 || item.Itm_Id === item.Itm_Id;;
    });
  
    let merged = [];
  
    if (lowerSearch) {
      // When user types something, show search matched, favorites and quantity > 0 items
      merged = [
        ...searchMatched,
        ...quantityItems.filter(
          item => !searchMatched.some(i => i.Itm_Id === item.Itm_Id)
        ),
      ];
    } else {
      // No search: show only favorites and quantity items
      merged = [
        ...favoriteWithQuantity,
        ...quantityItems.filter(item => !favoriteWithQuantity.some(i => i.Itm_Id === item.Itm_Id))
      ];
    }
  
    setFilteredData(merged);
  }, [searchText, mergedData, favorites, quantities]);
  
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
      .filter((item) => item.Itm_Id !== undefined && quantities[item.Itm_Id]) // include only if Itm_Id exists and quantity exists
      .map((item) => ({
        Itm_Id: item.Itm_Id,
        Inward: item.Itm_Id !== undefined ? parseFloat(quantities[item.Itm_Id] || "0") : 0,
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
          value={quantities[record.Itm_Id ?? ""] || "0"}
          onChange={(e) => record.Itm_Id !== undefined && handleManualInput(record.Itm_Id, e.target.value)}
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
