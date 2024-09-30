import React, { useState } from 'react';
import { Button, Container, Row, Col, Form } from 'react-bootstrap';
import '/src/App.css';

const Home = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');

  const handleButtonClick = () => {
    setOutput(`You entered: ${inputValue}`);
  };

  const handleInputChange = (event) => {
    setInputValue(event.target.value);
  };

  return (
    <Container className="mt-5">
      {/* Welcome Section */}
      <Row className="mb-4">
        <Col>
          <h1 className="text-center">Welcome </h1>
          <p className="text-center">
            testing for Project Numerical Method
          </p>
        </Col>
      </Row>

      {/* Interactive Section */}
      <Row className="mb-4">
        <Col md={6}>
          <Form>
            <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
              <Form.Label>Enter Some Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={inputValue}
                onChange={handleInputChange}
                placeholder="Type something here..."
              />
            </Form.Group>
            <Button variant="primary" onClick={handleButtonClick} className="w-100">
              Submit
            </Button>
          </Form>
        </Col>
        <Col md={6}>
          <div className="result-box">
            <h4>Output</h4>
            <p>{output}</p>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default Home;
