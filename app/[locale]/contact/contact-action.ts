import z from "zod";

import { createClient } from "@/utils/supabase/client";
import { sendMail } from "@/lib/mail/send-mail";
import { send } from "node:process";
import { sub } from "date-fns";
import { contactSchema } from "@/lib/zodSchema";

export const contactSchemaBE = z.object({
  name: z.string().min(1),
  email: z.email(),
  phone_number: z.string().min(5),
  message: z.string().min(3),
  subject: z.string().min(1),
});

export async function sendContactMessage(data: z.infer<typeof contactSchema>) {
  const validatedData = contactSchema.parse(data);

  if (!validatedData) {
    throw new Error("Invalid contact data");
  }

  try {
    const supabase = await createClient();

    const { data: insertData, error } = await supabase
      .from("contact_messages")
      .insert([
        {
          name: validatedData.name,
          email: validatedData.email,
          phone_number: validatedData.phone_number,
          message: validatedData.message,
          subject: validatedData.subject,
        },
      ])
      .select("*");

    const sendToEmail = await sendMail({
      email: `Contact Messages <developer@m-health.id>`,
      sendTo: "info@m-health.id",
      subject: `Incoming Contact Message from ${data.name}`,
      text: `
        You have received a new contact message.

        Name: ${data.name}
        Email: ${data.email}
        Phone Number: ${data.phone_number}
        Message: ${data.message}

        Salam hangat kami,
        M HEALTH Development Team`,
    });

    if (error) {
      return {
        success: false,
        error: {
          id: "Koneksi Gagal Terhubung",
          en: "Connection Failed",
        },
        message: {
          id: "Gagal menyimpan pesan kontak.",
          en: "Failed to save contact message.",
        },
      };
    } else if (sendToEmail?.error) {
      return {
        success: false,
        error: {
          id: "Gagal mengirim email",
          en: "Failed to send email",
        },
        message: {
          id: "Pesan terkirim, tetapi gagal mengirim email notifikasi.",
          en: "Message sent, but failed to send notification email.",
        },
      };
    }

    return {
      success: true,
      message_id: insertData![0].id,
      message: {
        id: "Pesan berhasil terkirim!",
        en: "Message sent successfully!",
      },
    };
  } catch (error) {
    console.error("Error sending contact message:", error);
    return {
      success: false,
      error: {
        id: "Terjadi kesalahan saat mengirim pesan.",
        en: "An error occurred while sending the message.",
      },
      message: {
        id: "Terjadi kesalahan tak terduga.",
        en: "An unexpected error occurred.",
      },
    };
  }
}
