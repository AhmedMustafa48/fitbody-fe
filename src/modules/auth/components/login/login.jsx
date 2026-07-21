import useLogin from "@modules/auth/components/login/use-login";
import InputField from "@components/input-field/input-field";

const Login = () => {
  const { form, onSubmit, serverError } = useLogin();
  const {
    register,
    formState: { errors, isSubmitting },
  } = form;

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 flex flex-col items-center gap-2 text-center">
          <img
            src="/JYM%20LOGO.png"
            alt="FitBody"
            className="h-24 w-auto object-contain"
          />
          <p className="text-sm text-muted-foreground">Admin Dashboard</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl border border-border bg-card p-8 shadow-sm">
          <h2 className="mb-1 text-lg font-semibold text-foreground">Welcome back</h2>
          <p className="mb-6 text-sm text-muted-foreground">
            Sign in to manage your gym
          </p>

          <form onSubmit={onSubmit} className="space-y-4">
            <InputField
              id="email"
              label="Email"
              type="email"
              placeholder="admin@fitbody.com"
              registration={register("email")}
              error={errors.email}
            />
            <InputField
              id="password"
              label="Password"
              type="password"
              placeholder="••••••••"
              registration={register("password")}
              error={errors.password}
            />

            {serverError && (
              <p className="rounded-lg bg-destructive/10 px-3 py-2 text-sm text-destructive">
                {serverError}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full rounded-lg bg-primary py-2.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-60"
            >
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
