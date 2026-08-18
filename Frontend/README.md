#

## Generate API with Open API

Voor het genereren van de API maken we gebruik van Orval.

```sh
npm run generate-api
```

### Orval
https://orval.dev/


Settings staan in `orval.config.ts`

```ts
import { defineConfig } from "orval";

export default defineConfig({
  api: {
    input: {
      target: "https://localhost:7229/openapi/v1.json",
    },
    output: {
      target: "./generated/api.ts",
      schemas: "./generated/models",
      client: "fetch",
      mode: "split",
      clean: true,
      baseUrl: "https://localhost:7229",
    },
  },
});
```