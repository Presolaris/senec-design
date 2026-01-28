import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, protectedProcedure, router } from "./_core/trpc";
import { z } from "zod";
import { createContactInquiry, getAllContactInquiries, getContactInquiryById, updateContactInquiryStatus } from "./db";
import { notifyOwner } from "./_core/notification";

// Input validation schema for contact form
const contactInquiryInput = z.object({
  name: z.string().min(2, "Name muss mindestens 2 Zeichen haben"),
  email: z.string().email("Ungültige E-Mail-Adresse"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Nachricht muss mindestens 10 Zeichen haben"),
  interest: z.enum(["pv-anlage", "speicher", "wallbox", "service", "gewerbe", "sonstiges"]).optional(),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  // Contact inquiry endpoints
  contact: router({
    // Public endpoint to submit a contact inquiry
    submit: publicProcedure
      .input(contactInquiryInput)
      .mutation(async ({ input }) => {
        try {
          const inquiry = await createContactInquiry({
            name: input.name,
            email: input.email,
            phone: input.phone || null,
            subject: input.subject || null,
            message: input.message,
            interest: input.interest || null,
          });

          if (!inquiry) {
            return { success: false, error: "Anfrage konnte nicht gespeichert werden" };
          }

          // Notify the owner about the new inquiry
          await notifyOwner({
            title: `Neue Kontaktanfrage von ${input.name}`,
            content: `
**Neue Anfrage eingegangen**

- **Name:** ${input.name}
- **E-Mail:** ${input.email}
- **Telefon:** ${input.phone || "Nicht angegeben"}
- **Interesse:** ${input.interest || "Nicht angegeben"}
- **Betreff:** ${input.subject || "Nicht angegeben"}

**Nachricht:**
${input.message}
            `.trim(),
          });

          return { success: true, id: inquiry.id };
        } catch (error) {
          console.error("Failed to submit contact inquiry:", error);
          return { success: false, error: "Ein Fehler ist aufgetreten" };
        }
      }),

    // Protected endpoints for admin to manage inquiries
    list: protectedProcedure.query(async () => {
      return await getAllContactInquiries();
    }),

    getById: protectedProcedure
      .input(z.object({ id: z.number() }))
      .query(async ({ input }) => {
        return await getContactInquiryById(input.id);
      }),

    updateStatus: protectedProcedure
      .input(z.object({
        id: z.number(),
        status: z.enum(["new", "in_progress", "completed", "archived"]),
      }))
      .mutation(async ({ input }) => {
        const success = await updateContactInquiryStatus(input.id, input.status);
        return { success };
      }),
  }),
});

export type AppRouter = typeof appRouter;
