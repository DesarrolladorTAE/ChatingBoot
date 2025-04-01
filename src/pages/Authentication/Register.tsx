import React from "react";
import { useEffect } from "react"; // Asegúrate de importar esto
import {
  Alert,
  Row,
  Col,
  Form,
  Button,
  UncontrolledTooltip,
  FormGroup,
  Label,
  FormFeedback,
} from "reactstrap";

// hooks
import { useRedux } from "../../hooks/index";

// router
import { Link, Navigate } from "react-router-dom";

// validations
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useForm } from "react-hook-form";

// hooks
import { useProfile } from "../../hooks";
import { createSelector } from "reselect";
//actions
import { registerUser } from "../../redux/actions";

// components
import NonAuthLayoutWrapper from "../../components/NonAutnLayoutWrapper";
import AuthHeader from "../../components/AuthHeader";
import FormInput from "../../components/FormInput";
import Loader from "../../components/Loader";

interface RegisterProps {}

type Role = "admin" | "supervisor" | "agent";

interface RegisterFormValues {
  name: string;
  email: string;
  number: string;
  password: string;
  confirmPassword: string;
  role: Role;
}

const Register = (props: RegisterProps) => {
  // global store
  const { dispatch, useAppSelector } = useRedux();

  // const { user, registrationError, regLoading } = useAppSelector(state => ({
  //   user: state.Register.user,
  //   registrationError: state.Register.registrationError,
  //   regLoading: state.Register.loading,
  //   isUserRegistered: state.Register.isUserRegistered,
  // }));

  const errorData = createSelector(
    (state: any) => state.Register,
    state => ({
      user: state.user,
      registrationError: state.registrationError,
      regLoading: state.loading,
      isUserRegistered: state.isUserRegistered,
    }),
  );
  // Inside your component
  const { user, registrationError, regLoading } = useAppSelector(errorData);

  const resolver = yupResolver(
    yup.object({
      name: yup.string().required(),
      email: yup.string().required().email(),
      number: yup
        .string()
        .required()
        .matches(/^\d{10}$/, "Debe tener 10 dígitos"),
      password: yup
        .string()
        .required()
        .min(8)
        .matches(/[A-Z]/)
        .matches(/[a-z]/)
        .matches(/\d/)
        .matches(/[@$!%*?&]/),
      confirmPassword: yup
        .string()
        .required()
        .oneOf([yup.ref("password")], "Las contraseñas no coinciden"),
      role: yup
        .mixed<Role>()
        .oneOf(["admin", "supervisor", "agent"])
        .required(),
    }),
  );

  // const defaultValues = {
  //   name: "",
  //   email: "",
  //   number: "",
  //   password: "",
  //   confirmPassword: "",
  //   role: "agent", // puede ser fijo o un selector
  // };

  const methods = useForm<RegisterFormValues>({
    defaultValues: {
      name: "",
      email: "",
      number: "",
      password: "",
      confirmPassword: "",
      role: "admin",
    },
    resolver,
  });

  const {
    handleSubmit,
    register,
    control,
    formState: { errors },
    setError,
  } = methods;

  useEffect(() => {
    if (
      registrationError &&
      typeof registrationError === "object" &&
      registrationError.type === "validation"
    ) {
      Object.entries(registrationError.errors).forEach(([field, messages]) => {
        setError(field as keyof RegisterFormValues, {
          type: "server",
          message: (messages as string[])[0],
        });
      });
    }
  }, [registrationError, setError]);

  const onSubmitForm = (values: any) => {
    const { confirmPassword, ...user } = values; // omitimos confirmPassword
    dispatch(registerUser(user));
  };

  const { userProfile, loading } = useProfile();

  // if (userProfile && !loading) {
  //   return <Navigate to={{ pathname: "/dashboard" }} />;
  // }

  if (userProfile && !loading) {
    return <Navigate to="/dashboard" />;
  }

  return (
    <NonAuthLayoutWrapper>
      <Row className=" justify-content-center my-auto">
        <Col sm={8} lg={6} xl={5} className="col-xxl-4">
          <div className="py-md-5 py-4">
            <AuthHeader
              title="Register Account"
              subtitle="Get your free Doot account now."
            />

            {user && user ? (
              <Alert color="success">Usuario Registrado Exitosamente</Alert>
            ) : null}

            {registrationError && (
              <Alert color="danger">
                {typeof registrationError === "object"
                  ? registrationError.message
                  : registrationError}
              </Alert>
            )}

            <Form
              onSubmit={handleSubmit(onSubmitForm)}
              className="position-relative"
            >
              {regLoading && <Loader />}
              <div className="mb-3">
                <FormInput
                  label="Nombre"
                  type="text"
                  name="name"
                  placeholder="Ej. Juan Pérez"
                  register={register}
                  errors={errors}
                  control={control}
                  className="form-control"
                />

                <FormInput
                  label="Correo electrónico"
                  type="email"
                  name="email"
                  placeholder="ejemplo@correo.com"
                  register={register}
                  errors={errors}
                  control={control}
                  className="form-control"
                />

                <FormInput
                  label="Número de WhatsApp"
                  type="text"
                  name="number"
                  placeholder="5512345678"
                  register={register}
                  errors={errors}
                  control={control}
                  className="form-control"
                />

                <FormInput
                  label="Contraseña"
                  type="password"
                  name="password"
                  register={register}
                  errors={errors}
                  control={control}
                  className="form-control"
                />

                <FormInput
                  label="Confirmar contraseña"
                  type="password"
                  name="confirmPassword"
                  register={register}
                  errors={errors}
                  control={control}
                  className="form-control"
                />

                <FormGroup className="mb-3">
                  <Label htmlFor="role" className="form-label">
                    Rol
                  </Label>
                  <select
                    id="role"
                    className={`form-control ${errors.role ? "is-invalid" : ""}`}
                    {...register("role")}
                    defaultValue=""
                  >
                    <option value="" disabled>
                      Selecciona un rol
                    </option>
                    <option value="admin">Administrador</option>
                    <option value="supervisor">Supervisor</option>
                    <option value="agent">Agente</option>
                  </select>
                  {errors.role && (
                    <FormFeedback>{errors.role.message}</FormFeedback>
                  )}
                </FormGroup>
              </div>

              <div className="mb-4">
                <p className="mb-0">
                  Dale a tu cuerpo alegría, Macarena{" "}
                  {/* <Link to="#" className="text-primary">
                    Terms of Use
                  </Link> */}
                </p>
              </div>

              <div className="text-center mb-3">
                <Button
                  color="primary"
                  className="w-100  waves-effect waves-light"
                  type="submit"
                >
                  Register
                </Button>
              </div>
              {/* <div className="mt-4 text-center">
                <div className="signin-other-title">
                  <h5 className="font-size-14 mb-4 title">Sign up using</h5>
                </div>
                <Row className="">
                  <div className="col-4">
                    <div>
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="facebook"
                      >
                        <i className="mdi mdi-facebook text-indigo"></i>
                      </button>
                    </div>
                    <UncontrolledTooltip placement="top" target="facebook">
                      Facebook
                    </UncontrolledTooltip>
                  </div>
                  <div className="col-4">
                    <div>
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="twitter"
                      >
                        <i className="mdi mdi-twitter text-info"></i>
                      </button>
                    </div>
                    <UncontrolledTooltip placement="top" target="twitter">
                      Twitter
                    </UncontrolledTooltip>
                  </div>
                  <div className="col-4">
                    <div>
                      <button
                        type="button"
                        className="btn btn-light w-100"
                        id="google"
                      >
                        <i className="mdi mdi-google text-danger"></i>
                      </button>
                    </div>
                    <UncontrolledTooltip placement="top" target="google">
                      Google
                    </UncontrolledTooltip>
                  </div>
                </Row>
              </div> */}
            </Form>

            <div className="mt-5 text-center text-muted">
              <p>
                Already have an account ?{" "}
                <Link
                  to="/auth-login"
                  className="fw-medium text-decoration-underline"
                >
                  Login
                </Link>
              </p>
            </div>
          </div>
        </Col>
      </Row>
    </NonAuthLayoutWrapper>
  );
};

export default Register;
