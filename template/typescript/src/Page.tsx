import { TitleCard } from "@dssg/odin-react";
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
                        Modify or even delete this page if required.
                    </TitleCard>
                </Col>
            </Row>
            <Row>
                <Col>
                    <TitleCard title="Endpoint Data">
                        Full Data from the Adapter as a JSON object:
                        <pre style={{ border: "1px solid black" }}>
                            <code>
                                {JSON.stringify(endpoint.data, undefined, 2)}
                            </code>
                        </pre>
                    </TitleCard>
                </Col>
            </Row>
        </Container>
    )
}

export default Page;