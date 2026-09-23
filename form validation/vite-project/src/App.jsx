import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./App.css";

// Validation rules
const schema = z
  .object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().min(1, "Email is required").email("Invalid email"),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, "Enter a valid 10-digit mobile number"),
    password: z
      .string()
      .min(8, "Min 8 characters")
      .regex(/[A-Z]/, "Add at least one uppercase letter")
      .regex(/[0-9]/, "Add at least one number"),
    confirm: z.string(),
    terms: z.boolean().refine((v) => v === true, {
      message: "You must accept the terms",
    }),
  })
  .refine((d) => d.password === d.confirm, {
    message: "Passwords don't match",
    path: ["confirm"],
  });

function Field({ label, name, type = "text", register, error, placeholder }) {
  return (
    <div className="field">
      <label htmlFor={name}>{label}</label>
      <input
        id={name}
        type={type}
        placeholder={placeholder}
        className={error ? "input input-error" : "input"}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
        {...register(name)}
      />
      {error && (
        <p id={`${name}-error`} className="error">
          {error.message}
        </p>
      )}
    </div>
  );
}

export default function App() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    // Replace with your API call
    await new Promise((r) => setTimeout(r, 800));
    console.log("Submitted:", data);
    reset();
  };

  return (
    <div className="page">
      <form className="card" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h2>Sign up</h2>

        <Field label="Full name" name="name" register={register} error={errors.name} placeholder="Yogi" />
        <Field label="Email" name="email" type="email" register={register} error={errors.email} placeholder="you@example.com" />
        <Field label="Mobile" name="phone" register={register} error={errors.phone} placeholder="9876543210" />
        <Field label="Password" name="password" type="password" register={register} error={errors.password} />
        <Field label="Confirm password" name="confirm" type="password" register={register} error={errors.confirm} />

        <div className="field">
          <label className="checkbox">
            <input type="checkbox" {...register("terms")} /> I accept the terms
          </label>
          {errors.terms && <p className="error">{errors.terms.message}</p>}
        </div>

        <button type="submit" className="btn" disabled={isSubmitting}>
          {isSubmitting ? "Submitting..." : "Create account"}
        </button>

        {isSubmitSuccessful && <p className="success">Account created ✔</p>}
      </form>
    </div>
  );
}
