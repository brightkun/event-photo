"use client";

import { useLogin, useRegister } from "@/components/hooks/auth/useAuth";
import { useT } from "@/components/i18n/useT";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import Link from "next/link";
import { useMemo } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import "./authForm.scss";

interface IProps {
  mode: "login" | "register";
}

const AuthForm = ({ mode }: IProps) => {
  const { t } = useT();
  const isRegister = mode === "register";
  const login = useLogin();
  const signUp = useRegister();
  const { isPending, error } = isRegister ? signUp : login;

  const schema = useMemo(
    () =>
      z.object({
        name: z.string().trim().max(60, t.auth.nameLong),
        email: z.string().trim().email(t.auth.emailInvalid),
        password: z
          .string()
          .min(8, t.auth.passwordShort)
          .max(72, t.auth.passwordLong),
      }),
    [t],
  );

  type FormValues = z.infer<typeof schema>;

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
      setError("name", { message: t.auth.nameRequired });
      return;
    }

    if (isRegister) {
      signUp.mutate(values);
    } else {
      login.mutate({ email: values.email, password: values.password });
    }
  };

  // Бэк отвечает по-английски, поэтому по коду ответа показываем свой текст
  const serverMessage = !error
    ? undefined
    : isAxiosError(error) && error.response?.status === 401
      ? t.auth.wrongCredentials
      : isAxiosError(error) && error.response?.status === 409
        ? t.auth.emailTaken
        : t.common.somethingWrong;

  return (
    <section id="authForm">
      <form className="authForm" onSubmit={handleSubmit(onSubmit)} noValidate>
        <h1 className="title">
          {isRegister ? t.auth.registerTitle : t.auth.loginTitle}
        </h1>
        <p className="subtitle">
          {isRegister ? t.auth.registerSubtitle : t.auth.loginSubtitle}
        </p>

        {isRegister && (
          <div className="field">
            <label>{t.auth.name}</label>
            <input
              className="input"
              type="text"
              autoComplete="name"
              placeholder={t.auth.namePlaceholder}
              {...register("name")}
            />
            {errors.name && <span className="error">{errors.name.message}</span>}
          </div>
        )}

        <div className="field">
          <label>{t.auth.email}</label>
          <input
            className="input"
            type="email"
            autoComplete="email"
            placeholder={t.auth.emailPlaceholder}
            {...register("email")}
          />
          {errors.email && <span className="error">{errors.email.message}</span>}
        </div>

        <div className="field">
          <label>{t.auth.password}</label>
          <input
            className="input"
            type="password"
            autoComplete={isRegister ? "new-password" : "current-password"}
            placeholder={
              isRegister
                ? t.auth.passwordNewPlaceholder
                : t.auth.passwordPlaceholder
            }
            {...register("password")}
          />
          {errors.password && (
            <span className="error">{errors.password.message}</span>
          )}
        </div>

        <button className="submitBtn" type="submit" disabled={isPending}>
          {isPending
            ? t.auth.wait
            : isRegister
              ? t.auth.submitRegister
              : t.auth.submitLogin}
        </button>
        {serverMessage && <span className="error">{serverMessage}</span>}

        <p className="switch">
          {isRegister ? t.auth.haveAccount : t.auth.newHere}
          <Link href={isRegister ? "/login" : "/register"}>
            {isRegister ? t.auth.toLogin : t.auth.toRegister}
          </Link>
        </p>
      </form>
    </section>
  );
};

export default AuthForm;
