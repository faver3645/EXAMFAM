import React from 'react';
import { Card, Row, Col } from 'react-bootstrap';

export default function ContactPage() {
  return (
    <div className="container mt-4">
      <h2>Contact Us</h2>
      <p>If you have any questions or need support, feel free to reach out to us using the contact details below.</p>

      <Row className="mt-4">
        <Col md={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>📧 Email</Card.Title>
              <Card.Text>
                <a href="mailto:support@myquiz.com">support@myquiz.com</a>
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>

        <Col md={6} className="mb-3">
          <Card className="shadow-sm h-100">
            <Card.Body>
              <Card.Title>📞 Phone</Card.Title>
              <Card.Text>
                +47 123 45 678
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Card className="shadow-sm mt-3">
        <Card.Body>
          <Card.Title>🏢 Address</Card.Title>
          <Card.Text>
            MyQuiz AS<br />
            Oslo, Norway
          </Card.Text>
        </Card.Body>
      </Card>
    </div>
  );
}
