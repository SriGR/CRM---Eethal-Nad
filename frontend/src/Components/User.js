import React, { useReducer, useEffect, useState } from 'react';
import '../App.css';

const UserReducer = (state, action) => {
    switch (action.type) {
        case 'name':
            return { ...state, name: action.value };
        case 'email':
            return { ...state, email: action.value };
        case 'role':
            return { ...state, roleIdpk: action.value, roleName: action.roleName };
        case "reset":
            return { ...state, name: '', email: '', roleIdpk: '', roleName: '' };
        default:
            return state;
    }
};

const initialState = {
    name: '',
    email: '',
    roleIdpk: '',
    roleName: '',
};

const User = () => {
    const [state, dispatch] = useReducer(UserReducer, initialState);
    const [users, setUsers] = useState([]);
    console.log(users, "users");


    const RoleList = [
        { roleIdpk: 1, roleName: 'Admin' },
        { roleIdpk: 2, roleName: 'Sales Rep' },
    ];

    useEffect(() => {
        fetch('http://localhost:5000/api/users')
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error fetching users:', error));
    }, []);

    const handleChange = (e, type) => {
        dispatch({ type: type, value: e.target.value });
    };

    const handleRoleChange = (e) => {
        const selectedRole = RoleList.find(role => role.roleIdpk === Number(e.target.value));
        dispatch({ type: 'role', value: selectedRole.roleIdpk, roleName: selectedRole.roleName });
    };

    const Validation = () => {
        if (!state.name) {
            alert("Kindly enter the name");
            return
        } else if (!state.email) {
            alert("Kindly enter the email");
            return
        } else if (!state.roleName) {
            alert("Kindly enter the role");
            return
        }

        handleSave();
    }
    const handleSave = () => {
        fetch('http://localhost:5000/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: state.name,
                email: state.email,
                roleIdpk: state.roleIdpk,
                roleName: state.roleName,
            }),
        })
            .then((response) => response.json())
            .then((data) => {
                alert('User added successfully!');
                dispatch({ type: 'reset' });
                return fetch('http://localhost:5000/api/users');
            })
            .then((response) => response.json())
            .then((data) => setUsers(data))
            .catch((error) => console.error('Error saving user:', error));
    };

    return (
        <div className='UserPageParent'>
            <div className='UserInputsParent1'>
                <div className='UserInputsParent'>
                    <input
                        type="text"
                        placeholder="Enter name here"
                        value={state.name}
                        onChange={(e) => handleChange(e, 'name')}
                        className='InputStyle'
                    />
                    <input
                        type="email"
                        placeholder="Enter email here"
                        value={state.email}
                        onChange={(e) => handleChange(e, 'email')}
                        className='InputStyle'
                    />
                    <select
                        value={state.roleIdpk}
                        onChange={handleRoleChange}
                        className='InputStyle'
                    >
                        <option value="">Select role</option>
                        {RoleList.map((role) => (
                            <option key={role.roleIdpk} value={role.roleIdpk}>
                                {role.roleName}
                            </option>
                        ))}
                    </select>
                </div>
                <div className='UserSaveResetSec'>
                    <button className='ResetBtn' onClick={() => dispatch({ type: 'reset' })}>Reset</button>
                    <button className='SaveBtn' onClick={Validation}>Save</button>
                </div>
            </div>

            <div className='TableSectionParent'>
                <table>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user._id}>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td>{user.roleName}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default User;
