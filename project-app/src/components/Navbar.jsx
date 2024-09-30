import React from 'react';
import { Navbar, Nav, Container, NavDropdown } from 'react-bootstrap';

const NavigationBar = () => {
  return (
    <Navbar bg="light" data-bs-theme="light">
      <Container >
        <Navbar.Brand href="/">
        <img
              src="/src/imgs/logo.png"
              width="30"
              height="30"
              className="d-inline-block align-top "
              alt="React Bootstrap logo"
            />
          </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className='ms-auto'>
              <Nav.Link href='./Component/Bisection'>Sample</Nav.Link>
              <NavDropdown title="Approach" id="basic-nav-dropdown">
                <NavDropdown.Item href="/">Root of Equation</NavDropdown.Item>
                <NavDropdown.Item href="/">Linear Algrebra</NavDropdown.Item>
                <NavDropdown.Item href="/">Interpolation</NavDropdown.Item>
                <NavDropdown.Item href="/">Extrapolation</NavDropdown.Item>
                <NavDropdown.Item href="/">I knew it u will read</NavDropdown.Item>
                
              </NavDropdown>           
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default NavigationBar;
