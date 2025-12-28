import { ThemeProvider } from "@/components/theme-provider";
import { Layout } from "@/components/layout";
import { HomePage } from "@/pages/home";

/**
 * Main application
 */
function App() {
  return (
    <ThemeProvider>
      <Layout>
        <HomePage />
      </Layout>
    </ThemeProvider>
  );
}

export default App;
