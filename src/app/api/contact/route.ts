import { NextResponse } from "next/server";
import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { name, email, projectType, message } = await req.json();

    // 1. Validate the data
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 },
      );
    }

    // 2. Configure the email transporter
    const transporter = nodemailer.createTransport({
      service: "gmail", // or use 'smtps' for other providers
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // 3. Define the email options
    const mailOptions = {
      from: process.env.EMAIL_USER, // Sender address (your server)
      to: process.env.EMAIL_USER, // Receiver address (YOU)
      replyTo: email, // When you hit reply, it goes to the client
      subject: `New Portfolio Inquiry: ${projectType} from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Project Type: ${projectType}
        
        Message:
        ${message}
      `,
      html: `
        <h3>New Contact Form Submission</h3>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Project Type:</strong> ${projectType}</p>
        <br/>
        <p><strong>Message:</strong></p>
        <p>${message.replace(/\n/g, "<br>")}</p>
      `,
    };

    // 4. Send the email
    await transporter.sendMail(mailOptions);

    return NextResponse.json(
      { message: "Email sent successfully" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error sending email:", error);
    return NextResponse.json(
      { error: "Failed to send email" },
      { status: 500 },
    );
  }
}
