import { Link } from "react-router-dom";

export function IdPwdForm({
    onSubmit,
    onUsernameChange,
    onPwdChange,
    onFocus,
    onBlur,
    variant,
    usernameRef,
    username,
    loading,
    minLength,
    password,
    isInvalid,
    error,
    showPwdGuide,
    passwordGuide,
}) {
    const defaults = variant === "register"
  ? {
      authFormName: "Create account",
      loadingText: "Registering...",
      submitButtonText: "Create account",
      switchLabelText: "Have an account?",
      switchLinkAddress: "/login",
      switchLinkText: "Log in",
    }
  : {
      authFormName: "Log in",
      loadingText: "Logging in...",
      submitButtonText: "Login",
      switchLabelText: "No account?",
      switchLinkAddress: "/register",
      switchLinkText: "Sign up",
    };

    return (
        <>
            <h2>{defaults.authFormName}</h2>
            <form onSubmit={onSubmit} className="auth-form" aria-busy={loading}>
                <label htmlFor="username">Username</label>
                <input
                    id="username"
                    name="username"
                    ref={usernameRef}
                    disabled={loading}
                    type="text"
                    value={username}
                    onChange={onUsernameChange}
                    required
                />
                <label htmlFor="password">Password</label>
                <input
                    id="password"
                    name="password"
                    aria-describedby="password-help"
                    type="password"
                    disabled={loading}
                    value={password}
                    minLength={minLength}
                    onChange={onPwdChange}
                    onFocus={onFocus}
                    onBlur={onBlur}
                    required
                />
                <button
                    disabled={loading || isInvalid}
                    aria-disabled={loading}
                    type="submit">
                        {loading ? defaults.loadingText : defaults.submitButtonText}
                </button>
                {
                    error
                    ?
                        <p className="error" role="alert">{error}</p>
                    :
                        showPwdGuide
                    ?
                        <small
                            id="password-help"
                            className="password-guide"
                            aria-live="polite"
                        >
                            {passwordGuide}
                        </small>
                    :
                        null
                }
                <label>{defaults.switchLabelText}</label>
                <Link to={defaults.switchLinkAddress}>{defaults.switchLinkText}</Link>
            </form>
        </>   
    );
}