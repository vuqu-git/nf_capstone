import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css'
import Header from "./components/Header.tsx";
import Gallery from "./components/Gallery.tsx";
import {Route, Routes} from "react-router-dom";
import {Col, Container, Row} from "react-bootstrap";

import AddNews from "./components/news/AddNews.tsx";
import EditDeleteNews from "./components/news/EditDeleteNews.tsx";
import FilmForm from "./components/filme/FilmForm.tsx";
import TerminForm from "./components/termine/TerminForm.tsx";

import TerminverknuepfungForm from "./components/terminverkuepfungen/TerminverknuepfungForm.tsx";

import ScreeningDetails from "./components/ScreeningDetails.tsx";
import OverviewArchive from "./components/OverviewArchive.tsx";
import OverviewSemester from "./components/OverviewSemester.tsx";
import Admin from "./components/Admin.tsx";
import BackToTopButton from "./components/BackToTopButton.tsx";

function App() {

    return (

        <div className="app-container">
            {/* outside Routes and hence Header is always displayed */}
            <Header />
            <main>
                <Container
                    style={{ width: '80%', margin: '0 auto' }}
                    id="container"
                >
                    <Row className="justify-content-center"> {/* Center the content */}
                        {/*<Col md={8} lg={8}> /!* Adjust the column widths for different screen sizes *!/*/}
                        {/*<Col md={7} > /!* Adjust the column widths for different screen sizes *!/*/}
                        <Col sm={10} md={7}> {/* Adjust the column widths for different screen sizes */}

                            <Routes>
                                <Route path="/" element={<Gallery />} />

                                <Route path="/addnews" element={<AddNews />} />
                                <Route path="/editnews" element={<EditDeleteNews />} />
                                <Route path="/deletenews" element={<EditDeleteNews />} />


                                <Route path="/adminfilme" element={<FilmForm />} />
                                <Route path="/admintermine" element={<TerminForm />} />
                                <Route path="/admintvennew" element={<TerminverknuepfungForm />} />

                                <Route path="/details/:tnr" element={<ScreeningDetails />} />
                                <Route path="/details" element={<ScreeningDetails />} />

                                <Route path="/archive" element={<OverviewArchive />} />
                                <Route path="/semester" element={<OverviewSemester />} />

                                <Route path="/admin" element={<Admin />} />
                            </Routes>

                        </Col>
                    </Row>
                    <BackToTopButton
                        parentId="container"
                        rightPercent={0.05} // !!!!! 5% inside from parent's right edge !!!!!
                    />
                </Container>
            </main>
        </div>
    )
}

export default App
