import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AppBootstrap } from "./components/AppBootstrap";
import { Layout } from "./components/layout";
import {
  HomePage,
  PropertiesPage,
  PropertyDetailsPage,
  FavoritesPage,
  ComparePage,
  LoginPage,
  RegisterPage,
  DashboardPage,
  DashboardPropertiesPage,
  AddPropertyPage,
  EditPropertyPage,
  AgentsPage,
} from "./pages";
import Chat from "./pages/TestMessage";

function App() {
  return (
    <BrowserRouter>
      <AppBootstrap>
        <Routes>
          {/* Public routes with layout */}
          <Route
            path="/"
            element={
              <Layout>
                <HomePage />
              </Layout>
            }
          />
          <Route
            path="/properties"
            element={
              <Layout>
                <PropertiesPage />
              </Layout>
            }
          />
          <Route
            path="/properties/:id"
            element={
              <Layout>
                <PropertyDetailsPage />
              </Layout>
            }
          />
          <Route
            path="/agents"
            element={
              <Layout>
                <AgentsPage />
              </Layout>
            }
          />
          <Route
            path="/favorites"
            element={
              <Layout>
                <FavoritesPage />
              </Layout>
            }
          />
          <Route
            path="/compare"
            element={
              <Layout>
                <ComparePage />
              </Layout>
            }
          />

          {/* Auth routes (no layout) */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Protected routes with layout */}
          <Route
            path="/dashboard"
            element={
              <Layout>
                <DashboardPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard/properties"
            element={
              <Layout>
                <DashboardPropertiesPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard/add-property"
            element={
              <Layout>
                <AddPropertyPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard/properties/:id/edit"
            element={
              <Layout>
                <EditPropertyPage />
              </Layout>
            }
          />
          <Route
            path="/dashboard/messages"
            element={
              <Layout>
                <Chat />
              </Layout>
            }
          />
        </Routes>
      </AppBootstrap>
    </BrowserRouter>
  );
}

export default App;
