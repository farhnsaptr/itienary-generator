import app from "./app";
import { env } from "./config/env";

const PORT = env.PORT || 5000;

app.listen(PORT, "0.0.0.0", () => {
  console.log(`=================================`);
  console.log(`Server running on port ${PORT} (host: 0.0.0.0)`);
  console.log(`Environment: ${env.NODE_ENV}`);
  console.log(`Swagger Docs: http://localhost:${PORT}/api-docs`);
  console.log(`=================================`);
});
