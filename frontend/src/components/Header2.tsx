import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Header.css";
import pupilleLogo from '../assets/Pupille-Logo.svg';
import {Link} from "react-router-dom";

export default function Header2() {
    return (

        <Navbar expand="lg" className="custom-navbar fs-5">
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    className={"ms-lg-5"}
                >
                    <img
                        src={pupilleLogo}
                        alt="Pupille Logo"
                        height="78"
                        style={{ objectFit: "contain" }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    id="basic-navbar-nav"
                    className="me-lg-5"
                >
                    <Nav className="ms-auto">

                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        <NavDropdown title="Programm" id="basic-nav-dropdown" className="custom-dropdown">
                            <NavDropdown.Item as={Link} to="/semester">als Semesterübersicht</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/pdfprogramm">im PDF-Format</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/archive">Archiv</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Infos & Service" id="basic-nav-dropdown" className="custom-dropdown">
                            <NavDropdown.Item as={Link} to="/kinobesuch">Besuch</NavDropdown.Item>
                            {/*<NavDropdown.Item as={Link} to="/contentnotes">Content Notes</NavDropdown.Item>*/}
                            <NavDropdown.Item as={Link} to="/kinoprojektion">Filme etc. zeigen</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/kinogeschichte">Kinogeschichte</NavDropdown.Item>

                            <NavDropdown.Divider />

                            <NavDropdown.Item as={Link} to="/kontakt">
                                Kontakt
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/impressum">
                                Impressum
                            </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link
                            href="https://www.instagram.com/pupillekino/"
                            rel="noopener noreferrer"
                            target="_blank"
                            className={"link-social-media ms-2"}
                        >
                            <img src="/assets/images/socialmedia/Instagram-Logo.png" alt="instagram"/>
                        </Nav.Link>
                        <Nav.Link
                            href="https://de-de.facebook.com/pupillekino/"
                            rel="noopener noreferrer"
                            target="_blank"
                            className={"link-social-media ms-2"}
                        >
                            <img src="/assets/images/socialmedia/Facebook-Logo.png" alt="facebook"/>
                        </Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}