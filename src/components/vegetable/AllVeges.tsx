import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    fetchAllVegetables,
    fetchFavoriteVegetables,
} from "../../redux/actions/vegesAction";
import { AppDispatch, RootState } from "../../redux/store";
import { Table, Input, Space, Button, message, theme, Card, Row, Col } from "antd";
import { AddToFavorite, RemoveFavorite } from "../../services/vegesAPI";
import { useNavigate } from "react-router-dom";
import Title from "antd/es/typography/Title";

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
    const { user } = useSelector((state: RootState) => state.auth) as { user: { Ac_Name?: string, isAdmin: boolean } | null };

    const allVeges: Vegetable[] = all?.data || [];

    useEffect(() => {
        dispatch(fetchAllVegetables());
        
        if (user && !user.isAdmin) {
            dispatch(fetchFavoriteVegetables());
        }
    }, [dispatch, user]);

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
        // {
        //     title: "Action",
        //     key: "action",
        //     render: (_: unknown, record: Vegetable) => {
        //         const isFavorite = favoriteIds.includes(record.Itm_ID);

        //         return isFavorite ? (
        //             <Button danger onClick={() => handleRemoveFav(record)}>
        //                 Remove Favorite
        //             </Button>
        //         ) : (
        //             <Button type="primary" onClick={() => handleAddToFav(record)}>
        //                 Add Favorite
        //             </Button>
        //         );
        //     },
        // },
    ];

    if (user && !user.isAdmin) {
        columns.push({
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
        });
    }

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
        <div style={{ minHeight: "100vh", background: "#f0f2f5", padding: "2rem 1rem" }}>
            <Card
                style={{
                    maxWidth: 1200,
                    margin: "0 auto",
                    borderRadius: "12px",
                    boxShadow: "0 15px 40px rgba(0,0,0,0.05)",
                }}
                bodyStyle={{ padding: "2rem" }}
            >
                <Row gutter={[16, 16]} align="middle" justify="space-between">
                    <Col xs={24} md={12}>
                        <Title level={3} style={{ margin: 0 }}>
                            All Vegetables
                        </Title>
                    </Col>
                    <Col xs={24} md={12} style={{ textAlign: "right" }}>
                        {user && !user.isAdmin && (
                            <Button type="primary" onClick={() => navigate("/favourites")}>
                                View Favorites
                            </Button>
                        )}
                    </Col>
                </Row>

                <Row style={{ marginTop: "1.5rem" }}>
                    <Col xs={24} sm={16} md={12} lg={8}>
                        <Input.Search
                            placeholder="Search by vegetable name"
                            allowClear
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            enterButton
                            size="large"
                        />
                    </Col>
                </Row>

                <div style={{ marginTop: "2rem" }}>
                    <Table
                        columns={columns}
                        dataSource={filteredVeges}
                        rowKey={(record) => record.Itm_ID}
                        loading={loading}
                        pagination={{ pageSize: 5, showSizeChanger: false }}
                        scroll={{ x: true }}
                        bordered
                    />
                </div>
            </Card>
        </div>
    );
};

export default AllVeges;
