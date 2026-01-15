import '../../App.css'
import {
    useOutlet,
} from "react-router-dom";

import {Col, Container, Row} from "react-bootstrap";
import BackToTopButton from "../structural_components/BackToTopButton.tsx";
import {ReactNode} from "react";

interface Props {
    children?: ReactNode; // make children optional, then the component can work with either outlet or children, and you won’t get the error when React Router renders it as a layout wrapper.
}

export default function OverviewAndFormLayout({ children }: Readonly<Props>) {
    const outlet = useOutlet();
    return (
        <div>
            <Container
                className="bootstrap-container-component"
                id="container"
            >
                <Row className="justify-content-center"> {/* Center the content */}

                    <Col md={12} lg={8} xl={7} className="px-0"> {/* Adjust the column widths for different screen sizes */}
                        {/*px-0 sets both horizontal paddings (left and right) to zero for all breakpoints, including extra small screens*/}
                        {/*To set the left and right padding to zero on your <Col> for extra small screens (less than 576px) in React Bootstrap, use the Bootstrap utility class px-0*/}

                        {/*<Col md={12} lg={8} xl={7} className="px-0 px-sm-3">*/}
                        {/*This approach ensures the column has no left/right padding on screens smaller than 576px, but regains standard padding on larger screens*/}
                        {/*<Outlet />*/}
                        {outlet || children}
                    </Col>
                </Row>
                <BackToTopButton
                    parentId="container"
                    rightPercent={0.10} // !!!!! x% inside from parent's right edge !!!!!
                />
            </Container>
        </div>
    );
}