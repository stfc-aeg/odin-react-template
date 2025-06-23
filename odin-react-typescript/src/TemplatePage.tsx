import { TitleCard } from "odin-react"

import Container from "react-bootstrap/Container";
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';


export const TemplatePage: React.FC = () => {

    return (
        <Container>
        <Row>
        <Col>
            <TitleCard title="Demo">
                Test Test Test
            </TitleCard>
        </Col>
        </Row>
        </Container>
    )
}