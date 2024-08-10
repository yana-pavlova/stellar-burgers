/// <reference types="cypress" />

import user from './user.json';
import orderSuccess from './order-success.json';
import ingredients from './ingredients.json';

describe('оформляем заказ', () => {
  beforeEach(() => {
    // Мок запроса данных пользователя
    cy.intercept('GET', 'https://norma.nomoreparties.space/api/auth/user', {
      statusCode: 200,
      body: {
        success: true,
        user: user.user
      }
    }).as('getUser');

    // Мок серверного запроса ингредиентов
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as(
      'getIngredients'
    );

    // Мок серверного запроса создания заказа
    cy.intercept('POST', '**/orders', (req) => {
      req.reply({
        statusCode: 200,
        body: orderSuccess
      });
    }).as('createOrder');

    // Устанавливаем токены перед каждым тестом
    cy.then(() => {
      window.localStorage.setItem('refreshToken', 'fake-refresh-token');
      cy.setCookie('accessToken', 'Bearer fake-access-token');
    });

    // идём на главную страницу
    cy.visit('/');
  });

  it('успешно оформляем заказ', () => {
    // кликаем на кнопку добавления первой булки
    cy.get('.add-button-bun').first().click({ force: true });
    // кликаем на кнопку добавления первой основной начинки
    cy.get('.add-button-main').first().click({ force: true });
    // кликаем кнопку оформления заказа
    cy.get('[data-test="order-button"]').first().click({ force: true });
    // проверяем, что модальное окно с заказом открылось
    cy.get('#modals').find('[data-test="order-modal"]').should('exist');
    // проверяем, что номер заказа совпадает
    cy.get('[data-test="order-number"').should(
      'contain',
      orderSuccess.order.number
    );
    // кликаем на кнопку, чтобы закрыть модалку
    cy.get('#modals').find('[data-test="modal-close-button"]').click();
    // проверяем, что модальное окно закрылось
    cy.get('#modals').find('[data-test="order-modal"]').should('not.exist');
    // проверяем, что в конструкторе нет элементов
    cy.get('.constructor-element').should('not.exist');
  });
});
