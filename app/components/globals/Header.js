import React from "react";
import { Navbar, Nav, Container } from 'react-bootstrap';
import Image from 'next/image';


console.log("Navbar.Brand:", Navbar.Brand);

export default function Header() {
    return (
        <>
            <div className="logo-container d-none d-lg-block">
                <img
                    src="https://comelec.gov.ph/images/logo/com_logo_grayed_small.png"
                    alt="Comelec Logo"
                    height="80"
                    className="d-inline-block align-top logo-comelec"
                />
                <div className="tagline-container">
                    <p className="tag-rep">Republic of the Philippines</p>
                    <p className="tag-comelec">COMMISSION ON ELECTIONS</p>
                    <p className="tag-pfad">POLITICAL FINANCE AND AFFAIRS DEPARTMENT</p>
                </div>
            </div>


        </>
    );
}