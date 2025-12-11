import { test, expect } from "@playwright/test";

const OPERATOR_EMAIL = process.env.OPERATOR_EMAIL || "contact@apple.com";
const OPERATOR_PASSWORD = process.env.OPERATOR_PASSWORD || "nextone";

const SERVICE_NAME_SLUG = "APPLE_Accueil";
const CUSTOMER_NAME = "Lagadec";
const CUSTOMER_FIRSTNAME = "Paul";
const CUSTOMER_EMAIL = "pl@test.com";
const CUSTOMER_PHONE = "0612345678";

test.describe("E2E: Cycle de vie complet du ticket", () => {
  test("Cycle complet : Client crée un ticket → Opérateur le traite", async ({
    page,
  }) => {
    let ticketCode = "";
    let ticketId: string | undefined;

    // ============================================
    // PARTIE 1 : CLIENT CRÉE UN TICKET À LA BORNE
    // ============================================

    await test.step("Client - Navigation à la borne", async () => {
      await page.goto("/terminal");
      await page.waitForLoadState("networkidle");

      const joinButton = page.getByTestId("join-queue-button");
      await expect(joinButton).toBeVisible({ timeout: 10000 });
      await joinButton.click();
    });

    await test.step("Client - Étape 1: Choix du service", async () => {
      await expect(
        page.getByText("Quel service souhaitez-vous visiter ?")
      ).toBeVisible();

      await page.getByTestId(`service-card-${SERVICE_NAME_SLUG}`).click();

      const nextButton = page.getByTestId("next-button");
      await expect(nextButton).toBeEnabled();
      await nextButton.click();

      await expect(
        page.getByText("Quel service souhaitez-vous visiter ?")
      ).not.toBeVisible();
    });

    await test.step("Client - Étape 2: Informations personnelles", async () => {
      await expect(page.getByText("Informations personnelles")).toBeVisible();

      await page.getByTestId("lastName-input").fill(CUSTOMER_NAME);
      await page.getByTestId("firstName-input").fill(CUSTOMER_FIRSTNAME);

      const nextButton = page.getByTestId("next-button-step-2");
      await expect(nextButton).toBeEnabled();
      await nextButton.click();
    });

    await test.step("Client - Étape 3: Coordonnées et soumission", async () => {
      await expect(page.getByText("Coordonnées")).toBeVisible();

      await page.getByTestId("email-input").fill(CUSTOMER_EMAIL);
      await page.getByTestId("phone-input").fill(CUSTOMER_PHONE);
      await page.getByTestId("rgpd-checkbox").check();

      const submitButton = page.getByTestId("submit-ticket-button");
      await expect(submitButton).toBeEnabled();

      const responsePromise = page.waitForResponse(
        (resp) => resp.url().includes("graphql") && resp.status() === 200,
        { timeout: 15000 }
      );

      await submitButton.click();
      await responsePromise;
    });

    await test.step("Client - Confirmation et récupération du code", async () => {
      await expect(page.getByText(/Votre numéro de ticket/i)).toBeVisible({
        timeout: 10000,
      });

      const ticketCodeElement = page.getByTestId("ticket-number");
      await expect(ticketCodeElement).toBeVisible();

      ticketCode = (await ticketCodeElement.innerText()).trim();

      expect(ticketCode).toMatch(/^APP-\d+$/);
      console.log("✅ Ticket créé:", ticketCode);
    });

    // ============================================
    // PARTIE 2 : OPÉRATEUR TRAITE LE TICKET
    // ============================================

    await test.step("Opérateur - Connexion", async () => {
      await page.goto("/login");
      await page.waitForLoadState("networkidle");

      await page.getByTestId("login-email").fill(OPERATOR_EMAIL);
      await page.getByTestId("login-password").fill(OPERATOR_PASSWORD);

      const loginResponse = page.waitForResponse(
        (resp) => resp.url().includes("graphql") && resp.status() === 200,
        { timeout: 15000 }
      );

      await page.getByTestId("login-submit").click();
      await loginResponse;

      await expect(page).toHaveURL(/\/dashboard/, { timeout: 10000 });
      console.log("✅ Opérateur connecté");
    });

    await test.step("Opérateur - Navigation vers services", async () => {
      await page.goto("/dashboard/services");
      await page.waitForLoadState("networkidle");

      await expect(
        page.getByRole("heading", { name: SERVICE_NAME_SLUG })
      ).toBeVisible();
      console.log("✅ Page services chargée");
    });

    await test.step("Opérateur - Localisation du ticket", async () => {
      const ticketRow = page.locator(`[data-testid^="ticket-row-"]`, {
        hasText: ticketCode,
      });

      await expect(ticketRow).toBeVisible({ timeout: 10000 });

      const ticketIdAttribute = await ticketRow.getAttribute("data-testid");
      ticketId = ticketIdAttribute?.replace("ticket-row-", "");

      expect(ticketId).toBeDefined();
      console.log("✅ Ticket trouvé:", ticketCode, "ID:", ticketId);

      const statusBadge = page.getByTestId(`ticket-status-${ticketId}`);
      await expect(statusBadge).toContainText(/En attente/i);
    });

    await test.step("Opérateur - Prendre le ticket", async () => {
      const takeButton = page.getByTestId(`take-ticket-button-${ticketId}`);
      await expect(takeButton).toBeVisible();

      const responsePromise = page.waitForResponse(
        (resp) => resp.url().includes("graphql") && resp.status() === 200,
        { timeout: 15000 }
      );

      await takeButton.click();
      await responsePromise;

      const processingWidget = page.locator("div.fixed.bottom-6.right-6");
      await expect(processingWidget).toBeVisible({ timeout: 5000 });
      await expect(processingWidget).toContainText(ticketCode);

      console.log("✅ Ticket pris en charge");
    });

    await test.step("Opérateur - Vérifier statut 'En cours'", async () => {
      const statusBadge = page.getByTestId(`ticket-status-${ticketId}`);
      await expect(statusBadge).toContainText(/En cours/i, { timeout: 5000 });
      console.log("✅ Statut: En cours");
    });

    await test.step("Opérateur - Simulation traitement", async () => {
      await page.waitForTimeout(3000);

      const processingWidget = page.locator("div.fixed.bottom-6.right-6");
      await expect(
        processingWidget.locator("text=/00:00:0[3-9]/")
      ).toBeVisible();
      console.log("✅ Timer fonctionne");
    });

    await test.step("Opérateur - Marquer comme traité", async () => {
      const processingWidget = page.locator("div.fixed.bottom-6.right-6");

      // Trouver le bouton menu (...)
      const menuButton = processingWidget.locator("button").last();
      await menuButton.click();

      await expect(
        page.getByRole("menuitem", { name: /Marquer le ticket comme traité/i })
      ).toBeVisible();

      const responsePromise = page.waitForResponse(
        (resp) => resp.url().includes("graphql") && resp.status() === 200,
        { timeout: 15000 }
      );

      await page
        .getByRole("menuitem", { name: /Marquer le ticket comme traité/i })
        .click();
      await responsePromise;

      console.log("✅ Ticket marqué comme traité");
    });

    await test.step("Opérateur - Vérifier notification succès", async () => {
      await expect(page.locator("text=/succès|réussi|traité/i")).toBeVisible({
        timeout: 5000,
      });
      console.log("✅ Notification affichée");
    });

    await test.step("Opérateur - Vérifier widget disparu", async () => {
      const processingWidget = page.locator("div.fixed.bottom-6.right-6");
      await expect(processingWidget).not.toBeVisible({ timeout: 5000 });
      console.log("✅ Widget disparu");
    });

    await test.step("Opérateur - Vérifier statut final 'Traité'", async () => {
      await page.reload();
      await page.waitForLoadState("networkidle");

      const finalStatusBadge = page.getByTestId(`ticket-status-${ticketId}`);
      await expect(finalStatusBadge).toContainText(/Traité/i, {
        timeout: 10000,
      });

      console.log("✅ Statut final: Traité");
    });

    console.log(`
      ╔════════════════════════════════════════╗
      ║  ✅ CYCLE COMPLET RÉUSSI !            ║
      ║  Ticket: ${ticketCode}                ║
      ║  Statut: Créé → En cours → Traité     ║
      ╚════════════════════════════════════════╝
    `);
  });
});
