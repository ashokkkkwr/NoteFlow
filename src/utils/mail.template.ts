export const generateHtml = (body: string) => {
  return `<!DOCTYPE html>
  <html lang="en">
  
  <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta http-equiv="X-UA-Compatible" content="ie=edge" />
      <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&display=swap" rel="stylesheet" />
  </head>
  
  <body style="
            margin: 0;
            font-family: 'Poppins', sans-serif;
            background: #ffffff;
            font-size: 14px;
          ">
      <main>
          ${body}
      </main>
  </body>
  </html>
`
}
