import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllVegetables,
    fetchFavoriteVegetables,
} from "../../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../../redux/store";
import { Table, Input, Space, Button, message } from "antd";
import { AddToFavorite } from "../../services/vegesAPI";

interface Vegetable {
    Itm_ID: string;
    Itm_Name: string;
    Sale_Rate: number;
}

interface APIError {
    response?: {
        data?: {
            message?: string;
        };
    };
}

const AllVeges = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { all, loading } = useSelector((state: RootState) => state.vegetables);

    const [searchText, setSearchText] = useState<string>("");
    const [filteredVeges, setFilteredVeges] = useState<Vegetable[]>([]);

    const allVeges: Vegetable[] = all?.data || [];

    useEffect(() => {
        dispatch(fetchAllVegetables());
        dispatch(fetchFavoriteVegetables());
    }, [dispatch]);

    useEffect(() => {
        const filtered = allVeges.filter((veg) =>
            veg.Itm_Name.toLowerCase().includes(searchText.toLowerCase())
        );
        setFilteredVeges(filtered);
    }, [searchText, allVeges]);

    const handleAddToFav = async (vege: Vegetable) => {
        try {
            const res = await AddToFavorite({ itemId: vege.Itm_ID });
            console.log("res: ", res);
            dispatch(fetchFavoriteVegetables());
            message.success("Added vege to favorites Successfully!");
        } catch (error) {
            const apiError = error as APIError;
            if (apiError.response?.data?.message) {
                message.error(apiError.response.data.message);
            } else {
                message.error("An unexpected error occurred.");
            }
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
            title: "Sale Rate (₹)",
            dataIndex: "Sale_Rate",
            key: "Sale_Rate",
        },
        {
            title: "Action",
            key: "action",
            render: (_: unknown, record: Vegetable) => (
                <Button type="primary" onClick={() => handleAddToFav(record)}>
                    Add to Favorite
                </Button>
            ),
        },
    ];

    return (
        <div className="p-4">
            <h2 className="text-xl font-semibold mb-4">All Vegetables</h2>

            <Space direction="vertical" style={{ width: "100%" }}>
                <Input.Search
                    placeholder="Search by vegetable name"
                    allowClear
                    onChange={(e) => setSearchText(e.target.value)}
                    value={searchText}
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

export default AllVeges;
