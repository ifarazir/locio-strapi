import { createBrowserRouter } from "react-router-dom";

import OnboardingPage from "./pages/Onboarding";
// import ErrorPage from "./error-page";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <OnboardingPage />,
        // errorElement: <ErrorPage />
    }
]);