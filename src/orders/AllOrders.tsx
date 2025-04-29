import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Table, Input, Space, DatePicker } from "antd";
import { fetchFavoriteVegetables } from "../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../redux/store";
import dayjs from "dayjs";

interface Vegetable {
  Itm_Id: number;
  Itm_Name: string;
  Sale_Rate: number;
  data?: Vegetable[];
}

const AllOrders = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { favorites, loading } = useSelector((state: RootState) => state.vegetables);
  const [searchText, setSearchText] = useState("");
  const [filteredVeges, setFilteredVeges] = useState<Vegetable[]>([]);
  const [quantities, setQuantities] = useState<Record<string, string>>({});

  const favoriteVeges = favorites || [];

  useEffect(() => {
    dispatch(fetchFavoriteVegetables());
  }, [dispatch]);

  useEffect(() => {
    const filtered = favoriteVeges.filter((veg: Vegetable) =>
      veg.Itm_Name.toLowerCase().includes(searchText.toLowerCase())
    );

    setFilteredVeges(filtered);
  }, [searchText, favoriteVeges]);

  // const handleQuantityChange = (itemId: string, type: "increment" | "decrement") => {
  //   setQuantities((prev) => {
  //     const current = prev[itemId] || 0;
  //     const updated = type === "increment" ? current + 1 : Math.max(0, current - 1);
  //     return { ...prev, [itemId]: updated };
  //   });
  // };

  const handleManualInput = (itemId: number, value: string) => {
    if (value === "" || /^\d*\.?\d{0,3}$/.test(value)) {
      setQuantities((prev) => ({ ...prev, [itemId]: value }));
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
    }

  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <DatePicker
            value={dayjs()}
            // disabled
             format="dddd, DD-MM-YYYY"
          />
        </div>
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
          dataSource={filteredVeges}
          rowKey={(record) => record.Itm_Id}
          loading={loading}
          pagination={{ pageSize: 20 }}
          scroll={{ x: true }}
          bordered
        />
      </Space>
    </div>
  );
};

export default AllOrders;
