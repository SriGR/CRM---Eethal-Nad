import React, { useState } from 'react';
import './App.css';
import User from './Components/User';
import Lead from './Components/Lead';
import { LuMenu, LuLogOut } from "react-icons/lu";
import { MdOutlineSpaceDashboard } from "react-icons/md";
import { IoFolderOutline } from "react-icons/io5";

const menuItems = [
    { name: 'User', icon: <MdOutlineSpaceDashboard style={{ fontSize: "20px" }} /> },
    { name: 'Lead', icon: <IoFolderOutline style={{ fontSize: "18px" }} /> }
];

const App = () => {
    const [activeMenu, setActiveMenu] = useState('Lead');

    const renderComponent = () => {
        switch (activeMenu) {
            case 'User':
                return <User />;
            case 'Lead':
                return <Lead />;
            default:
                return null;
        }
    };

    return (
        <div className='DashboardParent'>
            {/* sidebar section */}
            <section className='SidebarParent'>
                <div className='ProjectNameSec'>
                    <div className='ProjectNameSubSec'>
                        <LuMenu className='LuMenu' />
                        <span className='ProjectName'>Eethal Nad</span>
                    </div>
                </div>

                <div className='SidebarListsDiv'>
                    {menuItems.map((item) => (
                        <div
                            key={item.name}
                            className='ModuleNameSec'
                            style={{
                                color: activeMenu === item.name ? '#000' : '#747474',
                                fontWeight: activeMenu === item.name ? '600' : '500',
                                borderLeft: activeMenu === item.name ? '3px solid #000' : '3px solid transparent'
                            }}
                            onClick={() => setActiveMenu(item.name)}
                        >
                            {item.icon}
                            <span style={{ fontSize: "15px", marginLeft: "8px" }}>{item.name}</span>
                        </div>
                    ))}
                </div>

                <div className='LogoutSection'>
                    <div className='logoutSubSection'>
                        <LuLogOut className='LuLogOut' />
                        <a className='LogoutNameTxt' href='/'>Logout</a>
                    </div>
                </div>
            </section>

            {/* Dashboard Section */}
            <section className='DashboardSection'>
                <div className='TopBarParent'>
                    <span className='ActiveMenuText'>{activeMenu}</span>
                    <div className='TopbarUserNameSec'>
                        <div className='UserProfileDiv'>
                            <span className='UserName'>Sree Gokul Ranjith</span>
                            <span className='UserInitiall'>SG</span>
                        </div>
                    </div>
                </div>

                <div className='ComponentRendersParent'>
                    {renderComponent()}
                </div>
            </section>
        </div>
    );
}

export default App;
