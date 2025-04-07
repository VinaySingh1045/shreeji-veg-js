import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteVegetables } from "../../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../../redux/store";
import { Table, Input, Space, Button, message } from "antd";
import { useNavigate } from "react-router-dom";
import { RemoveFavorite } from "../../services/vegesAPI";
import { MinusCircleOutlined } from "@ant-design/icons";

interface Vegetable {
    Itm_Id: string;
    Itm_Name: string;
    Sale_Rate: number;
}
const FavoriteVeges = () => {
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const { favorites, loading } = useSelector((state: RootState) => state.vegetables);

    const [searchText, setSearchText] = useState("");
    const [filteredVeges, setFilteredVeges] = useState([]);

    const favoriteVeges = favorites?.data || [];

    useEffect(() => {
        dispatch(fetchFavoriteVegetables());
    }, [dispatch]);

    useEffect(() => {
        const filtered = favoriteVeges.filter((veg: Vegetable) =>
            veg.Itm_Name.toLowerCase().includes(searchText.toLowerCase())
        );

        // Only update state if filtered result has changed
        if (JSON.stringify(filtered) !== JSON.stringify(filteredVeges)) {
            setFilteredVeges(filtered);
        }
    }, [searchText, favoriteVeges]);


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
            title: "Sale Rate (₹)",
            dataIndex: "Sale_Rate",
            key: "Sale_Rate",
        },
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: Vegetable) => (
                <Button style={{ backgroundColor: "#fc5e5e" }} onClick={() => handleAddToFav(record)}>
                    Remove Favorite   <MinusCircleOutlined />
                </Button>
            ),
        },
    ];

    const handleAddToFav = async (record: Vegetable) => {
        console.log("record: ", record.Itm_Id);
        const res = await RemoveFavorite({ itemId: record.Itm_Id });
        console.log("res: ", res);
        dispatch(fetchFavoriteVegetables());
        message.success("Removed vege from favorites Successfully!");
    }

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Favorite Vegetables</h2>
                <Button onClick={() => navigate("/all/veges")} type="primary">Add More Favorite</Button>
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
                    pagination={{ pageSize: 5 }}
                    scroll={{ x: true }}
                    bordered
                />
            </Space>
        </div>
    );
};

export default FavoriteVeges;
