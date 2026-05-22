import pkg from "@prisma/client";
import { createRequire } from "module";

const require = createRequire(import.meta.url);

console.log("Prisma Client resolved from:");
console.log(require.resolve("@prisma/client"));

console.log("\nServiceType enum from Prisma Client:");
console.log(pkg.ServiceType);
