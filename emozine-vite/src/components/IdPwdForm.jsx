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
        <div className="min-h-screen flex items-center justify-center px-4">
            <div className="w-full max-w-md space-y-6">
                <h2 className="h2-primary text-center">{defaults.authFormName}</h2>
                <form 
                    className="space-y-4"
                    onSubmit={onSubmit} aria-busy={loading}>
                    <div className="space-y-1">
                        <label className="block" htmlFor="username">Username</label>
                        <input
                            className="w-full border border-gray-400 rounded-md"
                            id="username"
                            name="username"
                            ref={usernameRef}
                            disabled={loading}
                            type="text"
                            value={username}
                            onChange={onUsernameChange}
                            required
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="block" htmlFor="password">Password</label>
                        <input
                            className="w-full border border-gray-400 rounded-md"
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
                    </div>
                    
                    <button
                        className="w-full"
                        disabled={loading || isInvalid}
                        aria-disabled={loading}
                        type="submit">
                            {loading ? defaults.loadingText : defaults.submitButtonText}
                    </button>
                    {
                        error
                        ?
                            <p className="error-msg w-full block text-center" role="alert">{error}</p>
                        :
                            showPwdGuide
                        ?
                            <small
                                className="guide-msg w-full block text-center"
                                id="password-help"
                                aria-live="polite"
                            >
                                {passwordGuide}
                            </small>
                        :
                            null
                    }
                    <div className="w-full text-center space-x-2">
                        <label
                            className="text-sm text-gray-400"
                        >
                            {defaults.switchLabelText}
                        </label>
                        <Link
                            className="text-sm font-medium text-gray-400 underline hover:text-gray-950" 
                            to={defaults.switchLinkAddress}>{defaults.switchLinkText}</Link>
                    </div>
                </form>
            </div>
        </div>   
    );
}