import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Header.css"; // Import your custom CSS file
import {Link} from "react-router-dom";
import {staticFilePathFrontend} from "../../utils/config.ts";

function Header() {
    return (
        <Navbar expand="lg" className="custom-navbar fs-5">
            <Container>
                <Navbar.Brand as={Link} to="/">
                    <img
                        src={staticFilePathFrontend + "bilder/allgemein/Pupille-Logo.svg"}

                        alt="Pupille Logo"
                        className="pupille-logo-header"
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="ms-auto">

                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        <NavDropdown title="Programm" id="basic-nav-dropdown" className="custom-dropdown">
                            <NavDropdown.Item as={Link} to="/semester">Semesterübersicht</NavDropdown.Item>
                            <NavDropdown.Item href="#action/1.1">Heft als pdf</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/archive">Archiv</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Infos & Service" id="basic-nav-dropdown" className="custom-dropdown">
                            <NavDropdown.Item href="#action/2.1">Kinobesuch</NavDropdown.Item>
                            <NavDropdown.Item href="#action/2.2">
                                Triggerwarnungen & Content Notes
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/2.3">Filme zeigen</NavDropdown.Item>
                            <NavDropdown.Item href="#action/2.4">Unsere Kinogeschichte</NavDropdown.Item>

                            <NavDropdown.Divider />

                            <NavDropdown.Item href="#action/2.5">
                                Kontakt
                            </NavDropdown.Item>
                            <NavDropdown.Item href="#action/2.6">
                                Impressum
                            </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link href="#fb">FB</Nav.Link>

                        <Nav.Link href="#insta">Insta</Nav.Link>

                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default Header;