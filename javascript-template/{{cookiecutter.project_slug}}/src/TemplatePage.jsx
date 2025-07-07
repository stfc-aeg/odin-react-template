import { TitleCard } from "odin-react"

import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export const TemplatePage = () => {

    return (
        <Container>
        <Row>
        <Col>
            <TitleCard title="Demo {{cookiecutter.project_name}} Card">
                Feel free to delete this Titlecard if required.
            </TitleCard>
        </Col>
        </Row>
        </Container>
    )
}