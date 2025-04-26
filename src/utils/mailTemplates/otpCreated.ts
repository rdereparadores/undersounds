
export const otpCreated = (otp: number, username: string) => (`
    <h1>Hola, ${username}</h1>
    <p>Tu código de un solo uso es:</p>
    <h1>${otp}</h1>
    <p>No compartas este código con nadie. Expirará en 5 minutos.</p>
`)