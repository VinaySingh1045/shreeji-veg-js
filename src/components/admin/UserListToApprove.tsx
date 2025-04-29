import { useEffect, useState } from 'react';
import { Button, Input, message, Table, TableProps, theme } from 'antd';
import { IColumns } from '../../types/IUserList';
import { ApproveUser, getUsersToApprove } from '../../services/adminAPI';


const UserListToApprove = () => {
    const [users, setUsers] = useState<IColumns[]>([]);
    const [loading, setLoading] = useState(false);
    const { token } = theme.useToken();

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
            title: 'Code',
            dataIndex: 'approvalCode',
            key: 'approvalCode',
            render: (_, record) => (
                <Input
                    defaultValue={record.approvalCode || ''}
                    style={{ width: 120 }}
                    onChange={(e) => record.approvalCode = e.target.value}
                />
            ),
        },
        {
            title: 'Action',
            key: 'action',
            render: (_, record) => (
                <Button
                    type="primary"
                    onClick={() => record.Id && handleStatusChange(record.Id, record.approvalCode || '')}
                >
                    Approve
                </Button>
            ),
        },
    ];

    const handleStatusChange = async (id: string, status: string) => {

        try {
            const payload = {
                Ac_Id: id,
                approvalCode: status,
            };
            await ApproveUser(payload);
            message.success('Status updated successfully');
            fetchUsers();
        } catch (error) {
            console.error('Error updating status:', error);
            message.error('Error updating status');
        }
    };


    const fetchUsers = async () => {
        setLoading(true);
        try {
            const response = await getUsersToApprove();
            setUsers(response.data);
        } catch (error) {
            console.error('Error fetching users:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2 style={{ marginBottom: "10px" }} className={token.colorBgLayout === "White" ? "BgTextBefore" : "BgText"}>Users Pending Approval</h2>
            <Table
                columns={columns}
                dataSource={users}
                rowKey="_id"
                loading={loading}
                pagination={{ pageSize: 20 }}
                bordered
                scroll={{ x: 'max-content' }}
            />
        </div>
    );
};

export default UserListToApprove;
