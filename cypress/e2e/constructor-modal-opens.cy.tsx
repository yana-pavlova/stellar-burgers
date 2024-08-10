/// <reference types="cypress" />

import ingredients from './ingredients.json';

describe('проверяем, что модальное окно с ингредиентом открывается и закрывается', () => {
  beforeEach(() => {
    // мок серверного запроса ингредиентов
    cy.intercept('GET', '**/ingredients', { body: ingredients }).as(
      'getIngredients'
    );
    // идём на главную страницу
    cy.visit('/');
    // ждём, пока выполнится запрос ингредиентов
    cy.wait('@getIngredients');
  });

  it('открываем модальное окно при клике на контейнер с ингредиентом', () => {
    // кликаем на первый ингредиент
    cy.get('[data-test="ingredient-link"]').first().click();
    cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
  });

  it('закрываем модальное окно при нажатии на кнопку закрытия', () => {
    // открываем модальное окно
    cy.get('[data-test="ingredient-link"]').first().click();
    // проверяем, что модальное окно открыто
    cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
    // нажимаем на кнопку закрытия
    cy.get('#modals').find('[data-test="modal-close-button"]').click();
    // проверяем, что модальное окно закрылось
    cy.get('#modals')
      .find('[data-test="ingredient-modal"]')
      .should('not.exist');
  });

  it('закрываем модальное окно при нажатии на клавишу Escape', () => {
    // открываем модальное окно
    cy.get('[data-test="ingredient-link"]').first().click();
    // проверяем, что модальное окно открыто
    cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
    // нажимаем на клавишу Escape
    cy.get('body').type('{esc}');
    // проверяем, что модальное окно закрылось
    cy.get('#modals')
      .find('[data-test="ingredient-modal"]')
      .should('not.exist');
  });

  it('закрываем модальное окно при клике на оверлей', () => {
    // открываем модальное окно
    cy.get('[data-test="ingredient-link"]').first().click();
    // проверяем, что модальное окно открыто
    cy.get('#modals').find('[data-test="ingredient-modal"]').should('exist');
    // нажимаем на оверлей
    cy.get('#modals')
      .find('[data-test="modal-overlay"]')
      // { force: true } нужно, потому что оверлей перекрывается молальным окном в разметке
      .click({ force: true });
    // проверяем, что модальное окно закрылось
    cy.get('#modals')
      .find('[data-test="ingredient-modal"]')
      .should('not.exist');
  });
});
