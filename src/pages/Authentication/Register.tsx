import React, { useState, useEffect } from "react";
import {
  Row,
  Col,
  Form,
  Button,
  Alert,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import { useForm, SubmitHandler } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useDispatch, useSelector } from "react-redux";
import { registerUser, verifyCode } from "../../redux/actions";

interface RegisterFormValues {
  name: string;
  email: string;
  number: string;
  password: string;
  confirmPassword: string;
}

const Register: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [verificationCode, setVerificationCode] = useState("");

  const {
    registrationError,
    verificationError,
    regLoading,
    user,
    isUserRegistered,
    codeVerified,
  } = useSelector((state: any) => state.Register);

  const resolver = yupResolver(
    yup.object({
      name: yup.string().required("El nombre es obligatorio"),
      email: yup
        .string()
        .required("El correo es obligatorio")
        .email("Correo inválido"),
      number: yup
        .string()
        .required("El número es obligatorio")
        .matches(/^\d{10}$/, "Debe tener 10 dígitos"),
      password: yup
        .string()
        .required("La contraseña es obligatoria")
        .min(8, "Mínimo 8 caracteres"),
      confirmPassword: yup
        .string()
        .required("Confirmar contraseña es obligatorio")
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
    }),
  );

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({ resolver });

  const onSubmitForm: SubmitHandler<RegisterFormValues> = values => {
    const { confirmPassword, ...userData } = values;
    dispatch(registerUser(userData));
  };

  const onVerifyCode = () => {
    dispatch(verifyCode(verificationCode));
  };

  useEffect(() => {
    if (isUserRegistered && user) {
      setIsModalOpen(true);
    }
  }, [isUserRegistered, user]);

  useEffect(() => {
    if (codeVerified) {
      const token = localStorage.getItem("authUser");
      if (token) {
        setIsModalOpen(false);
        navigate("/dashboard");
      }
    }
  }, [codeVerified, navigate]);

  return (
    <>
      <Row className="justify-content-center min-vh-100 align-items-center bg-light">
        <Col sm={10} md={8} lg={6} xl={5}>
          <div className="shadow-lg rounded-4 bg-white p-4 p-md-5">
            <h3 className="text-center mb-4 fw-bold">Crear cuenta</h3>

            {user && (
              <Alert color="success">
                ✅ Registro exitoso. Te enviamos un código por WhatsApp para verificar tu número.
              </Alert>
            )}

            {registrationError && (
              <Alert color="danger">
                {typeof registrationError === "string"
                  ? registrationError
                  : registrationError.message || JSON.stringify(registrationError)}
              </Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Nombre completo</label>
                <input
                  {...register("name")}
                  className={`form-control rounded-3 ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Ej. Juan Pérez"
                />
                {errors.name && <div className="invalid-feedback">{errors.name.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Correo electrónico</label>
                <input
                  {...register("email")}
                  className={`form-control rounded-3 ${errors.email ? "is-invalid" : ""}`}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && <div className="invalid-feedback">{errors.email.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Número de WhatsApp</label>
                <input
                  {...register("number")}
                  className={`form-control rounded-3 ${errors.number ? "is-invalid" : ""}`}
                  placeholder="5512345678"
                />
                {errors.number && <div className="invalid-feedback">{errors.number.message}</div>}
              </div>

              <div className="mb-3">
                <label className="form-label fw-semibold">Contraseña</label>
                <input
                  type="password"
                  {...register("password")}
                  className={`form-control rounded-3 ${errors.password ? "is-invalid" : ""}`}
                  placeholder="********"
                />
                {errors.password && <div className="invalid-feedback">{errors.password.message}</div>}
              </div>

              <div className="mb-4">
                <label className="form-label fw-semibold">Confirmar contraseña</label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={`form-control rounded-3 ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="********"
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">{errors.confirmPassword.message}</div>
                )}
              </div>

              <div className="d-grid">
                <Button color="primary" className="rounded-3 py-2 fw-bold" type="submit">
                  {regLoading ? "Registrando..." : "Registrar"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>Verificación</ModalHeader>
        <ModalBody>
          <label className="form-label fw-semibold">Código de Verificación</label>
          <input
            type="text"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            className="form-control rounded-3"
            placeholder="Ingresa el código recibido"
          />
          {verificationError && (
            <div className="text-danger mt-2">
              {typeof verificationError === "string"
                ? verificationError
                : verificationError.message || JSON.stringify(verificationError)}
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onVerifyCode}>
            Verificar
          </Button>
          <Button
            color="secondary"
            onClick={() => {
              setVerificationCode("");
              setIsModalOpen(false);
            }}
          >
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Register;
