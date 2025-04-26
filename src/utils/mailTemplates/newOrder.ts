export const newOrder = (id: string, name: string, date: Date, lines: {title: string, format: string, quantity: number, price: number}[], shippingCost: number, ) => (`
<div style="background-color: #e7e7e7; border-radius: 6px; padding: 20px; font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
  <h1 style="font-size: 24px; margin-top: 0;">Pedido #${id}</h1>
  <p style="font-size: 16px; line-height: 1.5;">
    Hola ${name}, aquí tienes el resumen de tu pedido del día ${date.toLocaleString()}.
  </p>

  ${lines.map(line => (`
  <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 10px;">
    <tr>
      <td style="font-size: 14px; line-height: 1.4;">
        <strong>${line.title}</strong><br/>
        ${line.format}<br/>
        Cantidad: ${line.quantity.toString()}
      </td>
      <td style="text-align: right; font-size: 16px; font-weight: bold;">
        ${line.price.toFixed(2)} €
      </td>
    </tr>
  </table>
  `))}

  <table width="100%" cellspacing="0" cellpadding="0" style="margin-top: 10px; margin-bottom: 10px;">
    <tr>
      <td style="font-size: 14px;">Gastos de envío</td>
      <td style="text-align: right; font-size: 16px; font-weight: bold;">
        ${shippingCost.toFixed(2)} €
      </td>
    </tr>
  </table>

  <hr style="border: none; border-top: 1px solid #ccc; margin: 20px 0;" />

  <table width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 20px;">
    <tr>
      <td style="font-size: 16px; font-weight: bold;">Total</td>
      <td style="text-align: right; font-size: 18px; font-weight: bold;">
        ${lines.reduce((sum, line) => sum + (line.price * line.quantity), 0).toFixed(2)} €
      </td>
    </tr>
  </table>

  <p style="font-size: 14px; line-height: 1.5;">
    Encontrarás más información en la sección <strong>Pedidos</strong> de tu perfil.
  </p>

  <p style="font-size: 14px; line-height: 1.5;">
    Con ritmo,<br/>
    El equipo de UnderSounds
  </p>
</div>    
`)