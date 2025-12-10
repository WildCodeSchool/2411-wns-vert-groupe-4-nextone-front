import { test, expect } from "@playwright/test";

// CONFIG VARIABLES -------------------------
const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || "contact@apple.com";
const OPERATOR_PASSWORD = process.env.OPERATOR_PASSWORD || "nextone";

const SERVICE_NAME_SLUG = "APPLE_Accueil";

const CUSTOMER_NAME = "Lagadec";
const CUSTOMER_FIRSTNAME = "Paul";
const CUSTOMER_EMAIL = "pl@test.com";
const CUSTOMER_PHONE = "0612345678";
// -------------------------------------------

test.describe("E2E: Cycle de vie complet du ticket", () => {
  let ticketCode = "";

  // STEP 1: CUSTOMER TAKES A TICKET AT THE TERMINAL
  test("Client prend un ticket à la borne (/terminal)", async ({ page }) => {
    await test.step("Navigation à la borne et démarrage", async () => {
      await page.goto("/terminal");
      await page.getByTestId("join-queue-button").click();
    });

    await test.step("Étape 1: Choix du service", async () => {
      await page.getByTestId(`service-card-${SERVICE_NAME_SLUG}`).click();

      await page.getByTestId("next-button").click();
      await expect(
        page.getByText("Quel service souhaitez-vous visiter ?")
      ).not.toBeVisible();
    });

    await test.step("Étape 2: Informations personnelles", async () => {
      await page.getByTestId("lastName-input").fill(CUSTOMER_NAME);
      await page.getByTestId("firstName-input").fill(CUSTOMER_FIRSTNAME);
      await page.getByTestId("next-button-step-2").click();
    });

    await test.step("Étape 3: Coordonnées et soumission", async () => {
      await page.getByTestId("email-input").fill(CUSTOMER_EMAIL);
      await page.getByTestId("phone-input").fill(CUSTOMER_PHONE);
      await page.getByTestId("rgpd-checkbox").click();
      await page.getByTestId("submit-ticket-button").click();
    });

    await test.step("Étape 4: Confirmation et récupération du code", async () => {
      await expect(page.getByText(/Votre numéro de ticket :/i)).toBeVisible();

      const ticketCodeElement = page.getByTestId("ticket-number");
      ticketCode = await ticketCodeElement.innerText();

      expect(ticketCode).not.toBe("");
    });
  });

  // STEP 2: OPERATOR LOGS IN AND HANDLES THE TICKET
  test("Opérateur se connecte, voit le ticket, l’appelle et le clôture", async ({
    page,
  }) => {
    if (!ticketCode) {
      test.skip();
      return;
    }

    let ticketId: string | undefined;

    await test.step("1. Connexion de l’opérateur", async () => {
      await page.goto("/login");
      await page.getByTestId("login-email").fill(OPERATOR_EMAIL);
      await page.getByTestId("login-password").fill(OPERATOR_PASSWORD);
      await page.getByTestId("login-submit").click();

      await page.waitForURL("/dashboard");
    });

    await test.step("2. Navigation vers la liste des tickets et localisation", async () => {
      await page.goto("/dashboard/tickets");
      await expect(page.getByText("Tickets")).toBeVisible();

      const ticketRow = page.locator(`[data-testid^="ticket-row-"]`, {
        hasText: CUSTOMER_NAME,
      });
      await expect(ticketRow).toBeVisible();
      const ticketIdAttribute = await ticketRow.getAttribute("data-testid");
      ticketId = ticketIdAttribute?.replace("ticket-row-", "");

      expect(ticketId).toBeDefined();

      const statusBadge = page.getByTestId(`ticket-status-${ticketId}`);
      await expect(statusBadge).toHaveText(/Créé|En attente/i);
    });

    await test.step("3. Opérateur appelle le ticket (INPROGRESS)", async () => {
      const takeButton = page.getByTestId(`take-ticket-button-${ticketId}`);
      await takeButton.click();
      await expect(page.locator("div.fixed.bottom-6.right-6")).toBeVisible();
    });

    await test.step("4. Opérateur clôture le ticket (DONE) via le badge", async () => {
      const processingBadge = page.locator("div.fixed.bottom-6.right-6");
      await processingBadge.getByRole("button").click();

      await page
        .getByRole("menuitem", { name: /Marquer le ticket comme traité/i })
        .click();

      await expect(processingBadge).not.toBeVisible();

      await page.reload();

      const finalStatusBadge = page.getByTestId(`ticket-status-${ticketId}`);
      await expect(finalStatusBadge).toHaveText(/Traité/i);
    });
  });
});
