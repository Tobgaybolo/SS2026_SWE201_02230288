import { render, screen } from "@testing-library/react";
import App from "./App";
import { ThemeProvider } from "./context/ThemeContext";

test("renders task board title", () => {
  render(
    <ThemeProvider>
      <App />
    </ThemeProvider>
  );

  const heading = screen.getByRole("heading", { name: /reactive task board/i });
  expect(heading).toBeInTheDocument();
});
