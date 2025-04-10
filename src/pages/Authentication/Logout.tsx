import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Row, Col } from "reactstrap";

// hooks
import { useRedux } from "../../hooks/index";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import withRouter from "../../components/withRouter";

// actions
import { logoutUser } from "../../redux/actions";

const Logout = () => {
  const { dispatch } = useRedux();
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  useEffect(() => {
    const doLogout = async () => {
      await dispatch(logoutUser());
      setIsLoggedOut(true);
    };
    doLogout();
  }, [dispatch]);

  return (
    <NonAuthLayoutWrapper>
      <Row className="justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4 text-center">
            <div className="avatar-xl mx-auto">
              <div className="avatar-title bg-soft-primary text-primary h1 rounded-circle">
                <i className="bx bxs-user"></i>
              </div>
            </div>
            <div className="mt-4 pt-2">
              <h5>Has cerrado sesión</h5>
              <p className="text-muted font-size-15">
                Gracias por usar{" "}
                <span className="fw-semibold text-dark">ChattingBot</span>
              </p>

              {isLoggedOut ? (
                <div className="mt-4">
                  <Link
                    to="/auth-login"
                    className="btn btn-primary w-100 waves-effect waves-light"
                  >
                    Inicia sesión
                  </Link>
                </div>
              ) : (
                <p className="mt-4">Cerrando sesión...</p>
              )}
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default withRouter(Logout);
