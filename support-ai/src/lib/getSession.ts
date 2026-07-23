import { cookies } from "next/headers";
import { scalekit } from './scalekit';

export async function getSession(){
    const session = await cookies()
    const token = session.get("access_token")?.value
    if(!token){
        return null
    }
    try {
        const result:any = await scalekit.validateToken(token)
        const user = await scalekit.user.getUser(result.sub)
        return user
    } catch(error){
        console.log(error)
    }
}


/**
forward-logs-shared.ts:95
Download the React DevTools for a better development experience:
https://react.dev/link/react-devtools
Server
v{aud: Array(1), client_id: 'skc_109487480339760643', custom_claims: { ... }, exp: 17
69331278, iat: 1769330978, ... } i
aud: ['skc_109487480339760643']
client_id: "skc_109487480339760643"
custom_claims: {}
exp: 1769331278
iat: 1769330978
iss: "https://supportai.scalekit.dev"
jti: "tkn_109494451608487185"
nbf: 1769330978
oid: "org_109492567258695171"
roles: ['admin']
scope: "openid profile email"
scopes: (3) ['openid', 'profile', 'email']
sid: "ses_109492567426467331"
sub: "usr_109492567275472387"
[[Prototype]]: Object

getSession.ts:12


Let's break this down line by line.

---

## What This Entire File Does — Big Picture First

This is a **session helper function.**

Every time a user visits a protected page — you need to know: *"Is this person actually logged in? Who are they?"*

This function answers that question. It:
1. Reads the cookie we set in the previous file
2. Validates it's genuine and not expired or tampered with
3. Fetches the actual user's data
4. Returns the user — or null if not logged in

Every protected page in your app will call this function first.

---

## Line By Line

---

```typescript
import { cookies } from "next/headers";
```

**What:** Imports the `cookies` function from Next.js.

**What does it do:** Gives you access to the cookies attached to the incoming request — specifically the server-side cookies that `httpOnly` cookies live in.

**Why from `next/headers` specifically:** In Next.js App Router, `next/headers` is how you read request data (cookies, headers) on the server side. You can't use `document.cookie` here because this code runs on the server, not the browser.

**Real world analogy:** This is your tool to read the wristband the user is wearing. You can't see it with your eyes (browser) — you need a scanner (server-side cookie reader).

---

```typescript
import { scalekit } from './scalekit';
```

**What:** Same Scalekit client we saw in the previous file.

**Why again:** This file needs Scalekit for two things — validating the token and fetching user data. So it needs the client imported.

**`./scalekit`** — notice the `./` instead of `@/lib/scalekit`. This means the scalekit file is in the **same folder** as this file. Relative import path.

---

```typescript
export async function getSession() {
```

**`export`** — makes this function available to be imported and used in other files. Any page or component that needs to check if someone is logged in will import and call `getSession()`.

**`async`** — this function does slow things — reading cookies, making network calls to Scalekit. `async` allows it to wait for those without freezing everything.

**`getSession`** — the name. Descriptive — it gets the current user's session. This is the standard naming convention for this type of function in real production codebases.

---

```typescript
const session = await cookies()
```

**`cookies()`** — calls the Next.js cookies function. In newer versions of Next.js this is asynchronous — hence the `await`.

**`const session`** — stores the cookies object. This object has methods like `.get()`, `.set()`, `.delete()` for reading and manipulating cookies.

**Naming note:** Calling it `session` here is slightly confusing — it's actually the cookies store, not the session itself. A senior dev might name it `cookieStore` for clarity. But it works.

---

```typescript
const token = session.get("access_token")?.value
```

This is one of the most important lines. Let's break every piece:

**`session.get("access_token")`** — looks for a cookie named `"access_token"` — the exact same name we used when setting it in the previous file. Returns a cookie object or `undefined` if not found.

**`?.value`** — the `?.` is called **optional chaining.**

Without it:
```typescript
session.get("access_token").value
// If get() returns undefined → .value crashes with TypeError
```

With it:
```typescript
session.get("access_token")?.value
// If get() returns undefined → returns undefined safely, no crash
```

**`const token`** — stores either the actual token string, or `undefined` if the cookie doesn't exist.

**Real world analogy:** You ask "does this person have a wristband?" If yes — read what's written on it. If no wristband — don't try to read it (that would cause an error) — just note that it's missing.

---

```typescript
if (!token) {
    return null
}
```

**`if (!token)`** — if token is undefined, null, or empty string — this runs.

**`return null`** — immediately exits the function and returns null. Null means "no user, not logged in."

**Why return null specifically:** The calling code (your pages and components) will check `if (user === null)` to decide whether to show the page or redirect to login. Returning null is the standard convention for "no authenticated user."

**Real world analogy:** Security check at the door. "Do you have a wristband?" No wristband — "You can't enter" — stop right there. Don't proceed further.

---

```typescript
try {
```

**What:** Opens a try-catch block.

**Why:** The next two lines make network calls to Scalekit's servers. Network calls can fail — server down, timeout, invalid token, expired token. Without try-catch, any failure would crash your entire app.

**Senior dev rule:** Always wrap external API calls in try-catch. You never fully control external services.

---

```typescript
const result: any = await scalekit.validateToken(token)
```

**`scalekit.validateToken(token)`** — sends the token to Scalekit's servers and asks: "Is this token genuine, not expired, and not tampered with?"

**What Scalekit does internally:**
- Checks the token's cryptographic signature
- Verifies it hasn't expired
- Verifies it was issued by Scalekit (not forged)
- Returns the decoded token payload if valid
- Throws an error if invalid

**`await`** — waits for Scalekit to respond before moving on.

**`const result`** — stores what Scalekit returned. The decoded token payload typically contains:
```json
{
  "sub": "user_abc123",
  "email": "abhishek@gmail.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

**`sub`** — short for "subject." This is the unique user ID. Standard JWT convention.

**`: any`** — TypeScript type annotation. `any` means "I'm not specifying the type strictly." In production code you'd replace `any` with a proper interface — but `any` works for now.

**Real world analogy:** You send the wristband to the verification center. They check: Is the wristband genuine? Not expired? Not a fake? They send back: "Yes, genuine. This belongs to user ID abc123."

---

```typescript
const user = await scalekit.user.getUser(result.sub)
```

**`result.sub`** — the user ID from the decoded token. Something like `"user_abc123"`.

**`scalekit.user.getUser(result.sub)`** — asks Scalekit: "Give me the full profile for this user ID."

**What it returns:** Full user object:
```json
{
  "id": "user_abc123",
  "email": "abhishek@gmail.com",
  "name": "Abhishek Etam",
  "profilePicture": "https://..."
}
```

**Why two separate calls:** The token only contains minimal info (user ID). The full user profile (name, email, picture) lives in Scalekit's database. So you first validate the token to get the ID, then fetch the full profile using that ID.

**Real world analogy:** The wristband only has a member number. You use that number to look up the member's full profile in the database — name, photo, membership level.

---

```typescript
return user
```

**What:** Returns the full user object to whoever called `getSession()`.

**What the calling code gets:**
```json
{
  "id": "user_abc123",
  "email": "abhishek@gmail.com",
  "name": "Abhishek Etam"
}
```

**How a page uses this:**
```typescript
const user = await getSession()

if (!user) {
  redirect('/login')  // not logged in
}

// user is logged in — show the page
return <Dashboard user={user} />
```

---

```typescript
} catch(error) {
    console.log(error)
}
```

**`catch(error)`** — if ANYTHING in the try block throws an error — execution jumps here.

**Common errors that land here:**
- Token expired — user logged in 25 hours ago, maxAge was 24 hours
- Token tampered — someone modified the cookie manually
- Scalekit server unreachable — network issue
- Token belongs to deleted user

**`console.log(error)`** — logs the error for debugging.

**The silent problem here:** After logging the error — the function returns `undefined` implicitly. Not `null`, but `undefined`. This is actually a subtle bug.

A senior dev would write it as:

```typescript
} catch(error) {
    console.log(error)
    return null  // explicit null return
}
```

This makes the behavior consistent — whether token is missing OR validation fails, the function always returns `null`. Predictable behavior is safer than implicit undefined.

---

## The Complete Flow Visualized

```
User visits /dashboard
↓
Page calls getSession()
↓
getSession reads "access_token" cookie
↓
Cookie exists? No → return null → redirect to /login
↓
Cookie exists → send token to Scalekit for validation
↓
Scalekit says invalid/expired → catch block → return null → redirect to /login
↓
Scalekit says valid → get user ID from result.sub
↓
Fetch full user profile using user ID
↓
Return user object
↓
Page receives user → renders dashboard with user's data
```

---

## How These Two Files Work Together

```
File 1 (callback/route.ts)     File 2 (getSession)
─────────────────────────      ───────────────────
User logs in                   User visits page
↓                              ↓
Set access_token cookie   →    Read access_token cookie
↓                              ↓
Redirect to homepage           Validate token with Scalekit
                               ↓
                               Fetch user profile
                               ↓
                               Return user OR null
```

File 1 puts the wristband on. File 2 reads the wristband every time the user goes somewhere new.

---

## The One Senior Dev Insight

Notice what this function does NOT do:

It doesn't check a database to see if the user is logged in. It validates a **cryptographic token** — which can be done without a database round trip.

This is why JWT-based auth scales well. If you had 100,000 users simultaneously visiting pages — checking a database for every single request would be slow and expensive. Cryptographic token validation happens in memory, in milliseconds, with no database needed.

The only time you need a database call is to get the full user profile — which is the `getUser()` call at the end. And even that can be cached.

That's the architectural reason JWTs exist — fast, stateless, scalable authentication.

---


 */