"use client";

import { useLogin, useRegister } from "@/components/hooks/auth/useAuth";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./authForm.scss";

interface IProps {
  mode: "login" | "register";
}

const schema = z.object({
  name: z.string().trim().max(60, "Name is too long"),
  email: z.string().trim().email("Enter a valid email"),
  password: z.string().min(8, "At least 8 characters").max(72, "Too long"),
});

type FormValues = z.infer<typeof schema>;

const AuthForm = ({ mode }: IProps) => {
  const isRegister = mode === "register";
  const login = useLogin();
  const signUp = useRegister();
  const { isPending, error } = isRegister ? signUp : login;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { name: "", email: "", password: "" },
  });

  const onSubmit = (values: FormValues) => {
    if (isRegister && !values.name) {
      setError("name", { message: "Enter your name" });
      return;
    }

    if (isRegister) {
      signUp.mutate(values);
    } else {
      login.mutate({ email: values.email, password: values.password });
    }
  };

  const serverMessage = isAxiosError(error)
    ? (error.response?.data?.message as string | undefined)
    : error
      ? "Something went wrong, try again"
      : undefined;

  return (
    <section id="authForm">
      <form className="authForm" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1 className="title">{isRegister ? "Create account" : "Welcome back"}</h1>
        <p className="subtitle">
          {isRegister
            ? "Organizers need an account to create events. Guests never do."
            : "Log in to see your events."}
        </p>

        {isRegister && (
          <div className="field">
            <label>Name</label>
            <input
              className="input"
              type="text"
              autoComplete="name"
              placeholder="Anna"
              {...register("name")}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
        )}

        <div className="field">
          <label>Email</label>
          <input
            className="input"
            type="email"
            autoComplete="email"
            placeholder="anna@example.com"
            {...register("email")}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="field">
          <label>Password</label>
          <input
            className="input"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder={isRegister ? "At least 8 characters" : "Your password"}
            {...register("password")}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        <button className="submitBtn" type="submit" disabled={isPending}>
          {isPending ? "Please wait..." : isRegister ? "Create account" : "Log in"}
        </button>
        {serverMessage && <span className="error">{serverMessage}</span>}

        <p className="switch">
          {isRegister ? "Already have an account? " : "New here? "}
          <Link href={isRegister ? "/login" : "/register"}>
            {isRegister ? "Log in" : "Create an account"}
          </Link>
        </p>
      </form>
    </section>
  );
};

export default AuthForm;
