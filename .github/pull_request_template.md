## 📌 Summary
<!-- 1–3 sentences. What changed? For whom? -->
Closes #<issue-number>

---

## 🧠 Context / Why
<!-- Problem the user had; why this matters for EMOZINE (privacy, mental-health-friendly UX, reliability). -->

---

## 📋 Changes
**Frontend**
- …

**Backend / API**
- …

**Docs**
- …

---

## 🔐 Auth / Security (EMOZINE focus)
- [ ] JWT included on protected requests
- [ ] 401 handled (logout + redirect, no leaks of private data)
- [ ] Owner-only data enforced (server-side)
- [ ] No sensitive data in logs/errors

---

## ♿ Accessibility (a11y)
- [ ] Interactive elements keyboard-reachable
- [ ] Error messages announced (`role="alert"` / `aria-live`)
- [ ] Loading states conveyed (`aria-busy`, button disabled text)
- [ ] Labels/alt/aria-label for icons/emoji

---

## 🧪 Test Plan (manual)
Steps:
1. …
2. …
3. Expect …

Check:
- [ ] Happy path
- [ ] Error/edge states (server error, validation)
- [ ] Auth flow (missing/expired token → redirect to `/login`)
- [ ] Empty states
- [ ] Accessibility (Tab/Shift+Tab, screen reader announcement)

_(Attach Postman request or curl if API changed)_

---

## 🖼️ Screenshots / GIFs (UI)
<!-- Before/After or short GIF: loading states, errors, a11y demo if possible -->

---

## 🧩 API Notes (if applicable)
Endpoint(s):
- `GET /api/...`
- `POST /api/...`

Request/Response example (redact sensitive fields):
```json
{
  "example": "payload"
}