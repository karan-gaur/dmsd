import React, { useState } from "react";
import styled from "styled-components";
import NavigationItem from '../Navigation/NavigationItems/NavigationItem/NavigationItem';


const DropDownContainer = styled("div")`
    position: relative;
`;


const DropDownHeader = styled("div")`
    color: white;
    height: 100%;
    padding: 16px 10px;
    border-bottom: 4px solid transparent;
    cursor:pointer;
`;

const DropDownListContainer = styled("div")`
    position:absolute;
    top:55px;
`;

const DropDownList = styled("ul")`
    padding: 0;
    margin: 0;
    background: #5c86f5;
    box-sizing: border-box;
    color: #3faffa;
`;


const options = [
    { name: 'Add Document', link: '/add/document' },
    { name: 'Add Document Copy', link: '/add/documentCopy' },
    { name: 'Add Reader', link: '/add/reader' },
    { name: 'Add Publisher', link: '/add/publisher' },
    { name: 'List Branches', link: '/list/branches' },
    { name: 'List Publishers', link: '/list/publisher' },
];

function Dropdown() {
    const [isOpen, setIsOpen] = useState(false);

    const toggling = () => setIsOpen(!isOpen);

    return (
        <DropDownContainer>
            <DropDownHeader onClick={toggling}>
                Manager Options
            </DropDownHeader>
            {isOpen && (
                <DropDownListContainer>
                    <DropDownList>
                        {options.map((option, index) => (
                            <NavigationItem key={index} link={option.link} onClick={toggling}>{option.name}</NavigationItem>
                        ))}
                    </DropDownList>
                </DropDownListContainer>
            )}
        </DropDownContainer>
    );
}

export default Dropdown;