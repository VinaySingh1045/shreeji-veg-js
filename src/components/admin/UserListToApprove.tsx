import { useEffect } from 'react';
import { Select, Table, TableProps } from 'antd';
import { IColumns } from '../../types/IUserList';
import { getUsersToApprove } from '../../services/adminAPI';

// Sample data — replace this with real API data later
const users = [
    {
        key: '1',
        name: 'Vinay Singh',
        email: 'vinay@example.com',
        role: 'Intern',
        status: 'Pending',
    },
    {
        key: '2',
        name: 'Neha Patel',
        email: 'neha@example.com',
        role: 'Intern',
        status: 'Pending',
    },
    // Add more users as needed
];



// Table columns

const UserListToApprove = () => {

    const columns: TableProps<IColumns>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'Ac_Name',
            key: 'Ac_Name',
            responsive: ['xs', 'sm', 'md', 'lg'],
        },
        {
            title: 'Mobile No',
            dataIndex: 'Mobile_No',
            key: 'Mobile_No',
            responsive: ['sm', 'md', 'lg'],
        },
        {
            title: 'Status',
            dataIndex: 'approvalCode',
            key: 'approvalCode',
            responsive: ['xs', 'sm', 'md', 'lg'],
            render: (_, record) => (
                <div>
                    {
                        < Select
                            style={{ width: "25%" }}
                            defaultValue={record.status}
                            onChange={(value) => handleStatusChange(record._id, value)}
                            options={[
                                { value: "pending", label: "Pending" },
                                { value: "aprove", label: "Approved" },
                            ]}
                        />
                    }
                </div>
            ),
        },
    ];


    const handleStatusChange = (id: string, status: string) => {
        // Handle the status change logic here
        console.log(`User ID: ${id}, New Status: ${status}`);
    }

    useEffect(() => {

        const fetchUsers = async () => {
            try {
                const response = await getUsersToApprove();
                console.log("response unApproved", response);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();

    }, [])

    return (
        <div style={{ padding: '20px' }}>
            <h2>Users Pending Approval</h2>
            <Table
                columns={columns}
                dataSource={users}
                pagination={{ pageSize: 5 }}
                bordered
                scroll={{ x: 'max-content' }}
                responsive
            />
        </div>
    );
};

export default UserListToApprove;
