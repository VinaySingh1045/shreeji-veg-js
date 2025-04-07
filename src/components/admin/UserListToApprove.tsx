import { useEffect, useState } from 'react';
import { message, Select, Table, TableProps } from 'antd';
import { IColumns } from '../../types/IUserList';
import { ApproveUser, getUsersToApprove } from '../../services/adminAPI';


const UserListToApprove = () => {
    const [users, setUsers] = useState<IColumns[]>([]);
    const [loading, setLoading] = useState(false);

    const columns: TableProps<IColumns>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'Ac_Name',
            key: 'Ac_Name',
        },
        {
            title: 'Mobile No',
            dataIndex: 'Mobile_No',
            key: 'Mobile_No',
        },
        {
            title: 'Status',
            dataIndex: 'approvalCode',
            key: 'approvalCode',
            render: (_, record) => (

                <Select
                    defaultValue="pending"
                    style={{ width: 120 }}
                    onChange={(value) => record.Id && handleStatusChange(record.Id, value)}
                    options={[
                        { value: "pending", label: "Pending" },
                        { value: "approve", label: "Approved" },
                    ]}
                />
            ),
        },
    ];

    const handleStatusChange = async (id: string, status: string) => {
        console.log(`User ID: ${id}, New Status: ${status}`);

        try {
            const payload = {
                userId: id,
                approvalCode: status,
            };
            const response = await ApproveUser(payload);
            console.log("Fetched Users:", response);
            setUsers(prevUsers =>
                prevUsers.map(user =>
                    user.Id === id ? { ...user, approvalCode: status } : user
                )
            );
            message.success('Status updated successfully');
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Error updating status');
        }

    };

    useEffect(() => {
        const fetchUsers = async () => {
            setLoading(true);
            try {
                const response = await getUsersToApprove();
                console.log("Fetched Users:", response);
                setUsers(response.data); // assuming API returns an array in `data`
            } catch (error) {
                console.error('Error fetching users:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Users Pending Approval</h2>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="_id" // ensures correct row rendering
                loading={loading}
                pagination={{ pageSize: 5 }}
                bordered
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default UserListToApprove;
