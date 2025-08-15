/// <reference types="cypress" />
import { TIngredient } from '../../src/utils/types';
import { TIngredientsResponse } from '../../src/utils/burger-api';
import {
  mockUser,
  mockOrder,
  mockTokens,
  mockApiResponses
} from '../support/api-mocks';

const testUrl = 'http://localhost:4000';
const modalSelector = '[data-cy="modal"]';
const modalCloseButtonSelector = '[data-cy="modal-close-button"]';
const constructorFillingSelector = '[data-cy="constructor-filling"]';
const constructorBun1Selector = '[data-cy="constructor-bun_1"]';
const constructorBun2Selector = '[data-cy="constructor-bun_2"]';

describe('проверяем доступность приложения', function () {
  it('сервис должен быть доступен по адресу localhost:4000', function () {
    cy.visit(testUrl);
  });
});

describe('Тест API ингредиентов', function () {
  before(function () {
    cy.fixture('ingredients.json').as('ingredientsFixture');
  });

  it('Должен перехватить запрос ингредиентов и подменить ответ', function () {
    cy.intercept(
      'GET',
      'api/ingredients',
      (req) => {
        req.reply({
          statusCode: 200,
          body: this.ingredientsFixture,
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
    ).as('ingredientsRequest');

    cy.visit(testUrl);

    cy.wait('@ingredientsRequest').then((interception: any) => {
      expect(interception.request.method).to.equal('GET');
      expect(interception.response?.statusCode).to.equal(200);
      expect(interception.response?.body).to.deep.equal(
        this.ingredientsFixture
      );
    });
  });
});

describe('Тест модальных окон', function () {
  let testIngredient: TIngredient;

  before(function () {
    cy.fixture('ingredients.json').then((ingredients: TIngredientsResponse) => {
      testIngredient = ingredients.data[0];
    });
  });

  beforeEach(function () {
    cy.intercept('GET', 'api/ingredients', {
      fixture: 'ingredients.json'
    });
    cy.visit(testUrl);
  });

  it('Должен открывать и закрывать модальное окно', function () {
    cy.get(`[data-cy="${testIngredient._id}"]`).click({ force: true });
    cy.get(modalSelector).should('exist');
    cy.url().should('include', `/ingredients/${testIngredient._id}`);
    cy.get(modalSelector).within(() => {
      cy.get('[data-cy="ingredient-title"]').should(
        'have.text',
        testIngredient.name
      );
    });
    cy.get(modalCloseButtonSelector).click();
    cy.get(modalSelector).should('not.exist');
  });

  it('Должен закрывать модальное окно по клику на оверлей', function () {
    cy.get(`[data-cy="${testIngredient._id}"]`).click({ force: true });
    cy.get(modalSelector).should('be.visible');
    cy.get('[data-cy="modal-overlay"]').click({ force: true });
    cy.get(modalSelector).should('not.exist');
    cy.url().should('include', testUrl);
  });
});
describe('Тест добавления ингредиентов в заказ', function () {
  let testIngredientBun: TIngredient;
  let testIngredientMain: TIngredient;
  before(function () {
    cy.fixture('ingredients.json').then((ingredients: TIngredientsResponse) => {
      testIngredientBun = ingredients.data[0];
      testIngredientMain = ingredients.data[1];
    });
  });
  beforeEach(function () {
    cy.visit(testUrl);
  });
  it('Должен добавить ингредиент в заказ', function () {
    cy.get(constructorFillingSelector)
      .should('exist')
      .and('contain.text', 'Выберите начинку');
    cy.get(constructorBun1Selector)
      .should('exist')
      .and('contain.text', 'Выберите булки');
    cy.get(constructorBun2Selector)
      .should('exist')
      .and('contain.text', 'Выберите булки');
    cy.get(`[data-cy="ingredient_${testIngredientMain._id}"]`).as(
      'mainIngredient'
    );
    cy.get('@mainIngredient').within(() => {
      cy.contains('button', 'Добавить').should('exist').click();
    });
    cy.get(`[data-cy="ingredient_${testIngredientBun._id}"]`).as(
      'bunIngredient'
    );
    cy.get('@bunIngredient').within(() => {
      cy.contains('button', 'Добавить').should('exist').click();
    });
    cy.get(constructorFillingSelector).should('not.exist');
    cy.get(constructorBun1Selector).should('not.exist');
    cy.get(constructorBun2Selector).should('not.exist');
  });
});

describe('проверка авторизации пользователя', function () {
  let testIngredientBun: TIngredient;
  let testIngredientMain: TIngredient;
  beforeEach(() => {
    cy.intercept('GET', '**/api/auth/user', {
      statusCode: 200,
      body: mockApiResponses.getUser
    }).as('getUser');

    cy.intercept('POST', '**/api/orders', {
      statusCode: 200,
      body: mockApiResponses.createOrder
    }).as('createOrder');

    cy.intercept('GET', '**/api/orders/12345', {
      statusCode: 200,
      body: {
        success: true,
        orders: [mockOrder]
      }
    }).as('getOrderDetails');
    cy.setCookie('accessToken', mockTokens.accessToken);
    window.localStorage.setItem('refreshToken', mockTokens.refreshToken);
    cy.fixture('ingredients.json').then((ingredients: TIngredientsResponse) => {
      testIngredientBun = ingredients.data[0];
      testIngredientMain = ingredients.data[1];
    });
  });

  it('пользователь авторизован', function () {
    cy.visit(testUrl);
    cy.wait('@getUser');
    cy.get('[data-cy="profile-name"]').contains('Test User').should('exist');
  });

  it('делаем заказ', function () {
    cy.visit(testUrl);
    cy.wait('@getUser');
    cy.get(`[data-cy="ingredient_${testIngredientMain._id}"]`).as(
      'mainIngredient'
    );
    cy.get('@mainIngredient').within(() => {
      cy.contains('button', 'Добавить').should('exist').click();
    });
    cy.get(`[data-cy="ingredient_${testIngredientBun._id}"]`).as(
      'bunIngredient'
    );
    cy.get('@bunIngredient').within(() => {
      cy.contains('button', 'Добавить').should('exist').click();
    });
    cy.get('[data-cy="constructor"]')
      .find('button')
      .contains('Оформить заказ')
      .click();
    cy.wait('@createOrder')
      .its('request.body')
      .should('deep.equal', {
        ingredients: [
          testIngredientBun._id,
          testIngredientBun._id,
          testIngredientMain._id
        ]
      });
    cy.wait('@getOrderDetails');
    cy.get(modalSelector).should('be.visible');
    cy.get('[data-cy="order-number"]').should('contain', mockOrder.number);
    cy.get(modalCloseButtonSelector).click();
    cy.get(constructorFillingSelector)
      .should('exist')
      .and('contain.text', 'Выберите начинку');
    cy.get(constructorBun1Selector)
      .should('exist')
      .and('contain.text', 'Выберите булки');
    cy.get(constructorBun2Selector)
      .should('exist')
      .and('contain.text', 'Выберите булки');
  });
});
