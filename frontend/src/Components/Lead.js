import React, { useReducer, useState, useEffect } from 'react';
import '../App.css';

const initialState = {
    name: '',
    email: '',
    phone: '',
    company: '',
    assignedTo: '',
    statusIdpk: '',
    statusName: ''
};

const LeadReducer = (state, action) => {
    switch (action.type) {
        case 'name':
            return { ...state, name: action.value };
        case 'email':
            return { ...state, email: action.value };
        case 'phone':
            return { ...state, phone: action.value };
        case 'company':
            return { ...state, company: action.value };
        case 'assignedTo':
            return { ...state, assignedTo: action.value };
        case 'status':
            return { ...state, statusIdpk: action.value, statusName: action.statusName };
        case 'reset':
            return { ...initialState };
        case 'edit':
            return {
                ...state,
                name: action.payload.name,
                email: action.payload.email,
                phone: action.payload.phone,
                company: action.payload.company,
                assignedTo: action.payload.assignedTo,
                statusIdpk: action.payload.statusIdpk,
                statusName: action.payload.statusName
            };
        default:
            return state;
    }
};

const Lead = () => {
    const [state, dispatch] = useReducer(LeadReducer, initialState);
    const [leads, setLeads] = useState([]);
    const [users, setUsers] = useState([]);
    const [editingLead, setEditingLead] = useState(null);

    const StatuList = [
        { statusIdpk: 1, statusName: 'New' },
        { statusIdpk: 2, statusName: 'Contacted' },
        { statusIdpk: 3, statusName: 'Qualified' },
        { statusIdpk: 4, statusName: 'Lost' },
    ];

    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    useEffect(() => {
        fetch('http://localhost:5000/api/lead')
            .then((response) => response.json())
            .then((data) => setLeads(data))
            .catch((error) => console.error('Error fetching leads:', error));
    }, []);

    const handleSave = () => {
        const leadData = { ...state };

        if (editingLead) {
            fetch(`http://localhost:5000/api/lead/update/${editingLead._id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
            })
                .then((response) => response.json())
                .then((updatedLead) => {
                    setLeads((prevLeads) =>
                        prevLeads.map((lead) =>
                            lead._id === updatedLead._id ? updatedLead : lead
                        )
                    );
                    setEditingLead(null);
                    dispatch({ type: 'reset' });
                })
                .catch((error) => console.error('Error updating lead:', error));
        } else {
            fetch('http://localhost:5000/api/lead/save', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(leadData)
            })
                .then((response) => response.json())
                .then((newLead) => {
                    setLeads([...leads, newLead]);
                    dispatch({ type: 'reset' });
                })
                .catch((error) => console.error('Error saving lead:', error));
        }
    };

    const handleEdit = (lead) => {
        setEditingLead(lead);
        dispatch({
            type: 'edit',
            payload: lead
        });
    };

    return (
        <div className='UserPageParent'>
            <div className='UserInputsParent1'>
                <div className='UserInputsParent'>
                    <input
                        type="text"
                        value={state.name}
                        onChange={(e) => dispatch({ type: 'name', value: e.target.value })}
                        placeholder="Enter lead name"
                        className='InputStyle'
                    />
                    <input
                        type="email"
                        value={state.email}
                        onChange={(e) => dispatch({ type: 'email', value: e.target.value })}
                        placeholder="Enter email"
                        className='InputStyle'
                    />
                    <input
                        type="text"
                        value={state.phone}
                        onChange={(e) => dispatch({ type: 'phone', value: e.target.value })}
                        placeholder="Enter phone number"
                        className='InputStyle'
                    />
                    <input
                        type="text"
                        value={state.company}
                        onChange={(e) => dispatch({ type: 'company', value: e.target.value })}
                        placeholder="Enter company"
                        className='InputStyle'
                    />
                    <select
                        value={state.assignedTo}
                        onChange={(e) => dispatch({ type: 'assignedTo', value: e.target.value })}
                        className='InputStyle'
                    >
                        <option value="">Select User</option>
                        {users.map((user) => (
                            <option key={user._id} value={user.name}>
                                {user.name}
                            </option>
                        ))}
                    </select>

                    <select
                        value={state.statusIdpk}
                        onChange={(e) => {
                            const selectedStatus = StatuList.find(
                                (status) => status.statusIdpk === parseInt(e.target.value)
                            );
                            dispatch({
                                type: 'status',
                                value: selectedStatus.statusIdpk,
                                statusName: selectedStatus.statusName
                            });
                        }}
                        className='InputStyle'
                    >
                        <option value="">Select Status</option>
                        {StatuList.map((status) => (
                            <option key={status.statusIdpk} value={status.statusIdpk}>
                                {status.statusName}
                            </option>
                        ))}
                    </select>
                </div>

                <div className='UserSaveResetSec'>
                    <button className='ResetBtn' onClick={() => dispatch({ type: 'reset' })}>Reset</button>
                    <button className='SaveBtn' onClick={handleSave}>Save</button>
                </div>
            </div>

            <div className='TableSectionParent'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Phone</th>
                            <th>Company</th>
                            <th>Status</th>
                            <th>Assigned To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {leads.map((lead) => (
                            <tr key={lead._id}>
                                <td>{lead.name}</td>
                                <td>{lead.email}</td>
                                <td>{lead.phone}</td>
                                <td>{lead.company}</td>
                                <td>{lead.statusName}</td>
                                <td>{lead.assignedTo}</td>
                                <td>
                                    <button className='EditBtn' onClick={() => handleEdit(lead)}>Edit</button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Lead;
