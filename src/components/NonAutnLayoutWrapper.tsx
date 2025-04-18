import React from "react";
import { Container, Row, Col } from "reactstrap";

import { Link } from "react-router-dom";

// images
import authImage from "../assets/images/auth-img.png";

interface NonAuthLayoutWrapperProps {
  children: any;
}

const NonAuthLayoutWrapper = (props: NonAuthLayoutWrapperProps) => {
  return (
    <>
      <div className="auth-bg">
        <Container fluid className="p-0">
          <Row className=" g-0">
            <Col xl={3} lg={4}>
              <div className="p-4 pb-0 p-lg-5 pb-lg-0 auth-logo-section">
                <div className="text-white-50">
                  <h3>
                    <Link to="/" className="text-white">
                      <i className="bx bxs-message-alt-detail align-middle text-white h3 mb-1 me-2"></i>{" "}
                      ChattingBot
                    </Link>
                  </h3>
                  {/* <p className="font-size-16">
                    Responsive Bootstrap 5 Chat App
                  </p> */}
                </div>
                <div className="mt-auto">
                  <img src={authImage} alt="auth" className="auth-img" />
                </div>
              </div>
            </Col>

            <Col xl={9} lg={8}>
              <div className="authentication-page-content">
                <div className="d-flex flex-column h-100 px-4 pt-4">
                  {props.children}

                  <Row className="">
                    <Col xl={12}>
                      <div className="text-center text-muted p-4">
                        <p className="mb-0">
                          &copy; {new Date().getFullYear()} Hecho con{" "}
                          <i className="mdi mdi-heart text-danger"></i> por
                          TAElad
                        </p>
                      </div>
                    </Col>
                  </Row>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
};

export default NonAuthLayoutWrapper;
