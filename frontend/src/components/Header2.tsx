import { Navbar, Container, Nav, NavDropdown } from "react-bootstrap";
import "./Header.css";
import {Link} from "react-router-dom";

export default function Header2() {
    return (

        <Navbar expand="lg" className="custom-navbar fs-5">
            <Container>
                <Navbar.Brand
                    as={Link}
                    to="/"
                    // style={{ paddingLeft: '3rem' }}
                >
                    <img
                        src="https://pupille.org/bilder/allgemein/Pupille-Logo.svg"
                        alt="Pupille Logo"
                        // width="48" // or your preferred size
                        height="78"
                        style={{ objectFit: "contain" }}
                    />
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse
                    id="basic-navbar-nav"
                    // style={{ paddingRight: '3rem' }}
                >
                    <Nav className="ms-auto">

                        <Nav.Link as={Link} to="/">Home</Nav.Link>

                        <NavDropdown title="Programm" id="basic-nav-dropdown" className="custom-dropdown">
                            <NavDropdown.Item as={Link} to="/semester">als Semesterübersicht</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/pdfprogramm">im PDF-Format</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/archive">Archiv</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Infos & Service" id="basic-nav-dropdown" className="custom-dropdown">
                            <NavDropdown.Item as={Link} to="/kinobesuch">Kinobesuch</NavDropdown.Item>
                            {/*<NavDropdown.Item as={Link} to="/contentnotes">Content Notes</NavDropdown.Item>*/}
                            <NavDropdown.Item as={Link} to="/kinoprojektion">Filme etc. zeigen</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/kinogeschichte">Unsere Kinogeschichte</NavDropdown.Item>

                            <NavDropdown.Divider />

                            <NavDropdown.Item as={Link} to="/kontakt">
                                Kontakt
                            </NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/impressum">
                                Impressum
                            </NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link href="#fb">FB</Nav.Link>
                        <Nav.Link href="#insta">Insta</Nav.Link>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    )
}