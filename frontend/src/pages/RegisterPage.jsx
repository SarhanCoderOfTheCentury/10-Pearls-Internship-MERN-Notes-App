import { useLocation, useNavigate, Link } from "react-router-dom";
import useAuth from "../hooks/useAuth";
import { useForm } from "react-hook-form";
import Button from "../components/Button";
import Icon from "../components/Icon";
import { Notebook1Outlined } from "@lineiconshq/free-icons";

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { registerUser } = useAuth();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = async (data) => {
    await registerUser(data);
    reset();
    navigate("/dashboard", { state: { from: location } });
  };

  return (
    <div
      className="flex min-h-screen items-center justify-center px-4 py-12"
      style={{ backgroundColor: "var(--color-paper)" }}
    >
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div
            className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl"
            style={{ backgroundColor: "var(--color-accent-soft)" }}
          >
            <Icon icon={Notebook1Outlined} size={28} color="var(--color-accent)" />
          </div>
          <h1
            className="font-display text-3xl font-semibold tracking-tight"
            style={{ color: "var(--color-ink)" }}
          >
            Create your account
          </h1>
          <p className="mt-2 text-sm" style={{ color: "var(--color-ink-muted)" }}>
            Start capturing your thoughts with Notely
          </p>
        </div>

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="rounded-2xl border p-6 sm:p-8 space-y-5"
          style={{
            backgroundColor: "var(--color-paper-3)",
            borderColor: "var(--color-border)",
            boxShadow: "var(--shadow-md)",
          }}
        >
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
              Full name
            </label>
            <input
              id="name"
              type="text"
              placeholder="Jane Doe"
              className="input-field"
              {...register("name", {
                required: "Name is required",
                maxLength: { value: 80, message: "Can't be greater than 80 characters" },
                minLength: { value: 2, message: "Must be at least 2 characters" },
              })}
            />
            {errors.name && (
              <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                {errors.name.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="input-field"
              {...register("email", {
                required: "Email is required",
                pattern: { value: /^\S+@\S+$/i, message: "Enter a valid email" },
              })}
            />
            {errors.email && (
              <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1.5">
            <label htmlFor="password" className="text-sm font-medium" style={{ color: "var(--color-ink)" }}>
              Password
            </label>
            <input
              id="password"
              type="password"
              placeholder="••••••••"
              className="input-field"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 8, message: "Password must be at least 8 characters" },
              })}
            />
            {errors.password && (
              <p className="text-xs" style={{ color: "var(--color-danger)" }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" variant="primary" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Creating account…" : "Create account"}
          </Button>

          <p className="text-center text-sm" style={{ color: "var(--color-ink-muted)" }}>
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-medium underline underline-offset-2"
              style={{ color: "var(--color-accent)" }}
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
