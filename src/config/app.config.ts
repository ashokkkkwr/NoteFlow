import express from 'express'
import sanitizeHtml from 'sanitize-html'
import middleware from '../middleware'
const app = express()
app.use((req, res, next) => {
  res.locals.sanitizeHtml = sanitizeHtml
  next()
})
middleware(app)
export default app
