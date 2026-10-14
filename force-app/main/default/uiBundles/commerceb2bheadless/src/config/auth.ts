/**
 * [Dev Note] Centralized configuration for Auth routes.
 * Each route contains both the path and page title.
 * Using constants prevents typos in route paths across the application.
 */
export const ROUTES = {
	LOGIN: {
		PATH: "/login",
		TITLE: "Login | Carrier Comfort360",
	},
	REGISTER: {
		PATH: "/register",
		TITLE: "Create Account | Carrier Comfort360",
	},
	FORGOT_PASSWORD: {
		PATH: "/forgot-password",
		TITLE: "Recover Password | Carrier Comfort360",
	},
	RESET_PASSWORD: {
		PATH: "/reset-password",
		TITLE: "Reset Password | Carrier Comfort360",
	},
	PROFILE: {
		PATH: "/profile",
		TITLE: "My Profile | Carrier Comfort360",
	},
	CHANGE_PASSWORD: {
		PATH: "/change-password",
		TITLE: "Change Password | Carrier Comfort360",
	},
} as const;

/**
 * [Dev Note] Centralized configuration for API endpoints.
 * These are server-side endpoints, not client-side routes.
 */
export const API_ROUTES = {
	/**
	 * Apex REST endpoint that resolves the canonical logout URL via
	 * Site.getBaseUrl() — mirrors the LWR pattern where AppContextAdapter
	 * provides logoutUrl. Read once at app boot and cache.
	 *
	 * No hardcoded fallback: on shared orgs the prefix-less /secur/logout.jsp
	 * 301-redirects to whichever Site is alphabetically/createdDate first,
	 * which can be a different community entirely. The resolver is the only
	 * trustworthy source — see logout() in AuthContext for the await dance.
	 */
	LOGOUT_URL_RESOLVER: "/services/apexrest/auth/logout-url",
} as const;

/**
 * [Dev Note] Query parameter key used to store the return URL.
 * e.g. /login?startUrl=/profile
 */
export const AUTH_REDIRECT_PARAM = "startUrl";

/**
 * Placeholder text constants for authentication form inputs.
 */
export const AUTH_PLACEHOLDERS = {
	EMAIL: "buyer@dealer.example.com",
	PASSWORD: "",
	PASSWORD_CREATE: "",
	PASSWORD_CONFIRM: "",
	PASSWORD_NEW: "",
	PASSWORD_NEW_CONFIRM: "",
	FIRST_NAME: "Jordan",
	LAST_NAME: "Rivera",
	USERNAME: "jrivera",
} as const;
