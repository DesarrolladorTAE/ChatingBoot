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

// Definición de la interfaz para el formulario
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

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [verificationCode, setVerificationCode] = useState<string>("");

  // Obtener el estado de Redux
  const {
    registrationError,
    regLoading,
    user,
    isUserRegistered,
    codeVerified,
  } = useSelector((state: any) => state.Register);

  // Validaciones de formulario con Yup
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

  // Hook de react-hook-form
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver,
  });

  // Función de envío del formulario
  const onSubmitForm: SubmitHandler<RegisterFormValues> = values => {
    const { confirmPassword, ...user } = values;
    console.log("Formulario enviado con datos: ", user);
    dispatch(registerUser(user)); // Despachamos la acción para registrar al usuario
  };

  // Función para verificar el código
  const onVerifyCode = () => {
    console.log("Verificando código: ", verificationCode);
    dispatch(verifyCode(verificationCode)); // Despachamos la acción para verificar el código
  };
  
  useEffect(() => {
    console.log("Estado de usuario registrado: ", isUserRegistered);
    console.log("Usuario registrado: ", user);
    if (isUserRegistered && user) {
      setIsModalOpen(true); // Mostrar el modal de verificación después de registrar
    }
  }, [isUserRegistered, user]);

  // **Redirección al dashboard** solo si el código es verificado
  useEffect(() => {
    console.log("Estado de código verificado:", codeVerified); // Verifica el valor de codeVerified
    if (codeVerified) {
      console.log("Código verificado, cerrando el modal y redirigiendo...");
      setIsModalOpen(false); // Cerrar el modal
      navigate("/dashboard"); // Redirigir al dashboard si el código es verificado
    }
  }, [codeVerified, navigate]); // Escucha los cambios de `codeVerified` y `navigate`

  return (
    <>
      <Row className="justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <h3 className="text-center mb-4">Register Account</h3>

            {user && (
              <Alert color="success">
                ✅ Registro exitoso. Te enviamos un código por WhatsApp para
                verificar tu número.
              </Alert>
            )}

            {registrationError && (
              <Alert color="danger">{registrationError}</Alert>
            )}

            <Form onSubmit={handleSubmit(onSubmitForm)}>
              <div className="mb-3">
                <label>Nombre</label>
                <input
                  {...register("name")}
                  className={`form-control ${errors.name ? "is-invalid" : ""}`}
                  placeholder="Ej. Juan Pérez"
                />
                {errors.name && (
                  <div className="invalid-feedback">{errors.name.message}</div>
                )}

                <label>Correo electrónico</label>
                <input
                  {...register("email")}
                  className={`form-control ${errors.email ? "is-invalid" : ""}`}
                  placeholder="ejemplo@correo.com"
                />
                {errors.email && (
                  <div className="invalid-feedback">{errors.email.message}</div>
                )}

                <label>Número de WhatsApp</label>
                <input
                  {...register("number")}
                  className={`form-control ${errors.number ? "is-invalid" : ""}`}
                  placeholder="5512345678"
                />
                {errors.number && (
                  <div className="invalid-feedback">
                    {errors.number.message}
                  </div>
                )}

                <label>Contraseña</label>
                <input
                  type="password"
                  {...register("password")}
                  className={`form-control ${errors.password ? "is-invalid" : ""}`}
                  placeholder="********"
                />
                {errors.password && (
                  <div className="invalid-feedback">
                    {errors.password.message}
                  </div>
                )}

                <label>Confirmar contraseña</label>
                <input
                  type="password"
                  {...register("confirmPassword")}
                  className={`form-control ${errors.confirmPassword ? "is-invalid" : ""}`}
                  placeholder="********"
                />
                {errors.confirmPassword && (
                  <div className="invalid-feedback">
                    {errors.confirmPassword.message}
                  </div>
                )}
              </div>

              <div className="text-center mb-3">
                <Button color="primary" className="w-100" type="submit">
                  {regLoading ? "Registrando..." : "Registrar"}
                </Button>
              </div>
            </Form>
          </div>
        </Col>
      </Row>

      {/* Modal de verificación de código */}
      <Modal isOpen={isModalOpen} toggle={() => setIsModalOpen(!isModalOpen)}>
        <ModalHeader toggle={() => setIsModalOpen(!isModalOpen)}>
          Verificar Número
        </ModalHeader>
        <ModalBody>
          <label>Código de Verificación</label>
          <input
            type="text"
            value={verificationCode}
            onChange={e => {
              console.log("Código de verificación ingresado: ", e.target.value);
              setVerificationCode(e.target.value);
            }}
            className="form-control"
            placeholder="Ingresa el código que recibiste por WhatsApp"
          />
          {registrationError && (
            <div className="text-danger">{registrationError}</div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="primary" onClick={onVerifyCode}>
            Verificar
          </Button>
          <Button color="secondary" onClick={() => setIsModalOpen(false)}>
            Cancelar
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default Register;
