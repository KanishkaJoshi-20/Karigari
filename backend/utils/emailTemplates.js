/**
 * Generates a clean, professional HTML email for order confirmation.
 *
 * @param {Object} params
 * @param {string} params.customerName    - The customer's full name
 * @param {string} params.orderId         - The MongoDB order ID
 * @param {Array}  params.orderItems      - Array of { name, qty, price }
 * @param {number} params.itemsPrice      - Subtotal (items only)
 * @param {number} params.shippingPrice   - Shipping charge
 * @param {number} params.totalPrice      - Grand total
 * @param {Object} params.shippingAddress - { address, city, postalCode, country }
 * @param {string} params.paymentMethod   - e.g. "Razorpay", "COD"
 * @returns {string} HTML string
 */
const orderConfirmationTemplate = ({
  customerName,
  orderId,
  orderItems,
  itemsPrice,
  shippingPrice,
  totalPrice,
  shippingAddress,
  paymentMethod,
}) => {
  const itemRows = orderItems
    .map(
      (item) => `
        <tr>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f0e6e0; font-size: 14px; color: #333;">
            ${item.name}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f0e6e0; font-size: 14px; color: #333; text-align: center;">
            ${item.qty}
          </td>
          <td style="padding: 12px 16px; border-bottom: 1px solid #f0e6e0; font-size: 14px; color: #333; text-align: right;">
            ₹${(item.price * item.qty).toLocaleString("en-IN")}
          </td>
        </tr>
      `
    )
    .join("");

  const { address, city, postalCode, country } = shippingAddress;
  const shortOrderId = String(orderId).slice(-8).toUpperCase();

  return `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Order Confirmation — Karigari</title>
</head>
<body style="margin: 0; padding: 0; background-color: #fdf8f5; font-family: 'Helvetica Neue', Arial, sans-serif;">

  <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
    <tr>
      <td align="center" style="padding: 40px 20px;">

        <!-- Card Wrapper -->
        <table role="presentation" width="600" cellspacing="0" cellpadding="0"
          style="background: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 24px rgba(0,0,0,0.08); max-width: 600px; width: 100%;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #8b5e3c 0%, #c4916a 100%); padding: 36px 40px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 28px; font-weight: 700; letter-spacing: 1px;">
                Karigari
              </h1>
              <p style="margin: 6px 0 0; color: rgba(255,255,255,0.85); font-size: 13px; letter-spacing: 2px; text-transform: uppercase;">
                Handmade Crochet Creations
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 40px 20px;">

              <!-- Greeting -->
              <p style="margin: 0 0 8px; font-size: 22px; font-weight: 700; color: #2d2d2d;">
                Thank you, ${customerName}! 🎉
              </p>
              <p style="margin: 0 0 28px; font-size: 15px; color: #666; line-height: 1.6;">
                Your order has been placed successfully. We'll get it packed with love and ship it to you soon!
              </p>

              <!-- Order ID Badge -->
              <div style="background: #fdf0e8; border: 1px solid #e8c9b0; border-radius: 8px; padding: 14px 20px; margin-bottom: 28px; display: inline-block;">
                <p style="margin: 0; font-size: 13px; color: #8b5e3c; text-transform: uppercase; letter-spacing: 1px;">Order ID</p>
                <p style="margin: 4px 0 0; font-size: 20px; font-weight: 700; color: #5a3825; letter-spacing: 2px;">
                  #${shortOrderId}
                </p>
              </div>

              <!-- Order Items Table -->
              <p style="margin: 0 0 12px; font-size: 14px; font-weight: 700; color: #2d2d2d; text-transform: uppercase; letter-spacing: 0.5px;">
                Items Ordered
              </p>
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0"
                style="border-collapse: collapse; border: 1px solid #f0e6e0; border-radius: 8px; overflow: hidden; margin-bottom: 28px;">
                <thead>
                  <tr style="background: #fdf0e8;">
                    <th style="padding: 10px 16px; font-size: 12px; font-weight: 700; color: #8b5e3c; text-align: left; text-transform: uppercase; letter-spacing: 0.5px;">Product</th>
                    <th style="padding: 10px 16px; font-size: 12px; font-weight: 700; color: #8b5e3c; text-align: center; text-transform: uppercase; letter-spacing: 0.5px;">Qty</th>
                    <th style="padding: 10px 16px; font-size: 12px; font-weight: 700; color: #8b5e3c; text-align: right; text-transform: uppercase; letter-spacing: 0.5px;">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  ${itemRows}
                </tbody>
              </table>

              <!-- Price Summary -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 28px;">
                <tr>
                  <td style="font-size: 14px; color: #666; padding: 4px 0;">Subtotal</td>
                  <td style="font-size: 14px; color: #333; text-align: right; padding: 4px 0;">₹${Number(itemsPrice).toLocaleString("en-IN")}</td>
                </tr>
                <tr>
                  <td style="font-size: 14px; color: #666; padding: 4px 0;">Shipping</td>
                  <td style="font-size: 14px; color: #333; text-align: right; padding: 4px 0;">
                    ${Number(shippingPrice) === 0 ? '<span style="color: #4caf50; font-weight: 600;">FREE</span>' : `₹${Number(shippingPrice).toLocaleString("en-IN")}`}
                  </td>
                </tr>
                <tr>
                  <td colspan="2" style="padding: 8px 0;"><hr style="border: none; border-top: 2px solid #f0e6e0; margin: 0;"/></td>
                </tr>
                <tr>
                  <td style="font-size: 16px; font-weight: 700; color: #2d2d2d; padding: 4px 0;">Total</td>
                  <td style="font-size: 18px; font-weight: 700; color: #8b5e3c; text-align: right; padding: 4px 0;">₹${Number(totalPrice).toLocaleString("en-IN")}</td>
                </tr>
              </table>

              <!-- Two-column: Shipping + Payment -->
              <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="margin-bottom: 32px;">
                <tr>
                  <td width="50%" style="vertical-align: top; padding-right: 12px;">
                    <div style="background: #fdf8f5; border-radius: 8px; padding: 16px;">
                      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #8b5e3c; text-transform: uppercase; letter-spacing: 0.5px;">📦 Shipping To</p>
                      <p style="margin: 0; font-size: 13px; color: #444; line-height: 1.6;">
                        ${address}<br/>
                        ${city}, ${postalCode}<br/>
                        ${country}
                      </p>
                    </div>
                  </td>
                  <td width="50%" style="vertical-align: top; padding-left: 12px;">
                    <div style="background: #fdf8f5; border-radius: 8px; padding: 16px;">
                      <p style="margin: 0 0 8px; font-size: 12px; font-weight: 700; color: #8b5e3c; text-transform: uppercase; letter-spacing: 0.5px;">💳 Payment</p>
                      <p style="margin: 0; font-size: 13px; color: #444; line-height: 1.6;">${paymentMethod}</p>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- CTA Button -->
              <div style="text-align: center; margin-bottom: 12px;">
                <a href="${process.env.FRONTEND_URL}/my-orders"
                  style="display: inline-block; background: linear-gradient(135deg, #8b5e3c, #c4916a); color: #ffffff;
                         text-decoration: none; font-size: 15px; font-weight: 700; padding: 14px 36px;
                         border-radius: 8px; letter-spacing: 0.5px;">
                  View My Orders →
                </a>
              </div>

            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background: #fdf0e8; padding: 24px 40px; text-align: center; border-top: 1px solid #f0e6e0;">
              <p style="margin: 0 0 4px; font-size: 13px; color: #8b5e3c; font-weight: 600;">Karigari by Nisha Khitoliya</p>
              <p style="margin: 0 0 4px; font-size: 12px; color: #999;">Indore, Madhya Pradesh</p>
              <p style="margin: 0; font-size: 12px; color: #999;">
                Questions? 
                <a href="mailto:${process.env.EMAIL_USER}" style="color: #8b5e3c; text-decoration: none;">Contact Us</a>
              </p>
            </td>
          </tr>

        </table>
        <!-- End Card -->

      </td>
    </tr>
  </table>

</body>
</html>
  `.trim();
};

export default orderConfirmationTemplate;
