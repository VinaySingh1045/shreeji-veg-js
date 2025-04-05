import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFavoriteVegetables } from "../../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../../redux/store";
import { Table, Input, Space, Button } from "antd";
import { useNavigate } from "react-router-dom";

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

    // useEffect(() => {
    //     const filtered = favoriteVeges.filter((veg) =>
    //         veg.Itm_Name.toLowerCase().includes(searchText.toLowerCase())
    //     );

    //     setFilteredVeges(filtered);
    // }, [searchText, favoriteVeges]);
    useEffect(() => {
        const filtered = favoriteVeges.filter((veg) =>
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
            render: (_: any, __: any, index: number) => index + 1,
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
    ];

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Favorite Vegetables</h2>
                <Button onClick={()=> navigate("/all/veges")} type="primary">Add More Favorite</Button>
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
                    rowKey={(record) => record.Itm_ID}
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
