/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter, Routes, Route } from "react-router-dom";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import RootLayout from "./app/layout";
import LandingPage from "./app/page";
import DashboardPage from "./app/dashboard/page";
import ProfilePage from "./app/profile/page";
import JobsPage from "./app/jobs/page";
import JobReviewPage from "./app/jobs/id/page";
import ApplicationsPage from "./app/applications/page";

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route element={<RootLayout />}>
            <Route path="/" element={<LandingPage />} />
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/jobs" element={<JobsPage />} />
            <Route path="/jobs/:id" element={<JobReviewPage />} />
            <Route path="/applications" element={<ApplicationsPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
