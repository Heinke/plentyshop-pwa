import page from '../pages/factory';

context('Order placement', () => {
  beforeEach(function init () {
    cy.fixture('test-data/e2e-place-order').then((fixture) => {
      this.fixtures = {
        data: fixture
      };
    });

    page.home.visit();
  });

  it(['happyPath', 'regression'], 'Should successfully place an order as a guest user', function test () {
    const data = this.fixtures.data;

    // With the current data, the first category does not have items. Therefore, we need to replace the
    // following selector: page.home.header.categories.first().click();
    cy.get('[data-e2e*="app-header"]').eq(1).find('a').click().wait(1000);
    page.category.products.first().click().wait(1000);

    cy.intercept('/api/plentymarkets/*').as('networkRequests');
    page.product.addToCartButton.click();
    cy.wait('@networkRequests').wait(500);

    page.product.header.openCart();
    page.cart.goToCheckoutButton.click();
    cy.wait(500);

    page.checkout.checkoutlogin.continueAsGuest.click();

    cy.intercept('/api/plentymarkets/*').as('networkRequests');
    // page.checkout.billing.heading.should('be.visible');
    page.checkout.billing.url();
    page.checkout.billing.fillForm(data.customer);
    page.checkout.billing.continueToShipping.click();
    cy.wait('@networkRequests').wait(500);

    cy.intercept('/api/plentymarkets/*').as('networkRequests');
    page.checkout.shipping.heading.should('be.visible');
    page.checkout.shipping.fillForm(data.customer);
    page.checkout.shipping.continueToPaymentButton.click();
    cy.wait('@networkRequests').wait(500);

    cy.intercept('/api/plentymarkets/*').as('networkRequests');
    page.checkout.payment.paymentMethods.first().click();
    page.checkout.payment.terms.click();
    page.checkout.payment.makeAnOrderButton.click();
    cy.wait('@networkRequests').wait(1000);

    page.checkout.thankyou.heading.should('be.visible');
  });
});
