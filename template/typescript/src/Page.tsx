import { TitleCard, ParamController } from "@dssg/odin-react";
import type { AdapterEndpoint } from "@dssg/odin-react";
import { Container, Row, Col } from 'react-bootstrap';
import { type EndpointParams } from "./App";

interface PageProps {
    endpoint: AdapterEndpoint<EndpointParams>
}

const Page = ({
    endpoint
}: PageProps) => {

    return (
        <Container>
            <Row>
                <Col>
                    <TitleCard title="Demo">
                        A Basic page using Bootstrap's Row/Col grid layout.
                        <br />
                        Below is an auto-generated set of controls for your Adapter.
                        This should not be used in the final GUI, but is a helpful demo.
                    </TitleCard>
                </Col>
            </Row>
            <Row>
                <Col>
                    <ParamController endpoint={endpoint} title="Demo" />
                </Col>
            </Row>
        </Container>
    )
}

export default Page;