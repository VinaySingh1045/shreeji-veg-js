import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllVegetables,
    fetchFavoriteVegetables,
} from "../../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../../redux/store";
import { Table, Input, Space, Button, message, theme } from "antd";
import { AddToFavorite, RemoveFavorite } from "../../services/vegesAPI";
import { useNavigate } from "react-router-dom";

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
    const navigate = useNavigate();
    const { token } = theme.useToken();
    const { favorites, all, loading } = useSelector((state: RootState) => state.vegetables);
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

    const favoriteIds = favorites?.data?.map((f) => f.Itm_Id) || [];

    const handleAddToFav = async (vege: Vegetable) => {
        try {
            await AddToFavorite({ itemId: vege.Itm_ID });
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
            render: (_: unknown, record: Vegetable) => {
                const isFavorite = favoriteIds.includes(record.Itm_ID);

                return isFavorite ? (
                    <Button danger onClick={() => handleRemoveFav(record)}>
                        Remove Favorite
                    </Button>
                ) : (
                    <Button type="primary" onClick={() => handleAddToFav(record)}>
                        Add Favorite
                    </Button>
                );
            },
        },
    ];

    const handleRemoveFav = async (vege: Vegetable) => {
        try {
            await RemoveFavorite({ itemId: vege.Itm_ID });
            dispatch(fetchFavoriteVegetables());
            message.success("Removed from favorites!");
        } catch {
            message.error("Error removing from favorites");
        }
    };

    return (
        <div className="p-4">
            <div className="flex justify-between items-center mb-4">
                <h2 className={token.colorBgLayout === "White" ? "BgTextBefore" : "BgText"}>All Vegetables</h2>
                <Button onClick={() => navigate("/")} type="primary">View Favorite</Button>
            </div>
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
