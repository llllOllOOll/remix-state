// import { createCookieSessionStorage } from "@remix-run/node";

// type SessionData = {
//   userID: string;
// };

// type SessionFlashData = {
//   error: string;
// };

// const { getSession, commitSession, destroySession } =
//   createCookieSessionStorage<SessionData, SessionFlashData>({
//     cookie: {
//       name: "_session",
//       domain: "localhost",
//       httpOnly: true,
//       maxAge: 60 * 60 * 24 * 30,
//       someSite: true,
//       secrets: ["some-secret"],
//       secure: false,
//     },
//   });

// export { getSession, commitSession, destroySession };
import { createCookie, createFileSessionStorage } from "@remix-run/node"; // or cloudflare/deno

// In this example the Cookie is created separately.
const sessionCookie = createCookie("__session", {
  secrets: ["r3m1xr0ck5"],
  maxAge: 60 * 60 * 24 * 30,
  sameSite: true,
});

const { getSession, commitSession, destroySession } = createFileSessionStorage({
  dir: "./sessions",
  cookie: sessionCookie,
});

export { getSession, commitSession, destroySession };
