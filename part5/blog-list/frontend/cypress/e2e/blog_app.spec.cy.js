describe('Blog app', function () {
  beforeEach(function () {
    cy.request('POST', 'http://localhost:3003/api/testing/reset');
    const user = {
      name: 'Rick',
      username: 'Rick',
      password: 'secret',
    };
    cy.request('POST', 'http://localhost:3003/api/users/', user);
    cy.visit('http://localhost:3000');
  });

  it('Front page can be opened', function () {
    cy.contains('log in to application');
    cy.contains('username');
    cy.contains('password');
    cy.contains('login');
  });

  it('Login form is shown', function () {
    cy.contains('login').click();
    cy.contains('Wrong username or password');
  });

  describe('Login', function () {
    it('succeeds with correct credentials', function () {
      cy.contains('login').click();
      cy.get('#username').type('Rick');
      cy.get('#password').type('secret');
      cy.get('#login-button').click();
      cy.contains('Rick logged in');
    });

    it('fails with wrong credentials', function () {
      cy.contains('login').click();
      cy.get('#username').type('Rick');
      cy.get('#password').type('1234');
      cy.get('#login-button').click();

      //Cypress requires the colors to be given as rgb.
      cy.get('#notification')
        .should('contain', 'Wrong username or password')
        .and('have.css', 'color', 'rgb(255, 0, 0)')
        .and('have.css', 'border-color', 'rgb(255, 0, 0)');

      cy.get('html').should('not.contain', 'Rick logged in');
    });
  });

  describe('When logged in', function () {
    beforeEach(function () {
      /**
       * The Cypress documentation gives us the following advice:
       * Fully test the login flow – but only once!.
       * So instead of logging in a user using the form in the beforeEach block,
       * Cypress recommends that we bypass the UI and do an HTTP request to the backend to log in.
       * The reason for this is that logging in with an HTTP request is much faster than filling a form.
       */
      cy.login({ username: 'Rick', password: 'secret' });
      /** The code below is move to function login in cypress/support/command as utils */
      // cy.request('POST', 'http://localhost:3003/api/login', {
      //   username: 'Rick',
      //   password: 'secret',
      // }).then((response) => {
      //   localStorage.setItem(
      //     'loggedBlogappUser',
      //     JSON.stringify(response.body)
      //   );
      //   cy.visit('http://localhost:3000');
      // });

      // cy.get('#username').type('Rick');
      // cy.get('#password').type('secret');
      // cy.get('#login-button').click();
    });

    it('A blog can be created', function () {
      cy.contains('new blog').click();
      cy.get('#title').type('Cypress');
      cy.get('#author').type('Rick');
      cy.get('#url').type('www.google.com');
      cy.get('#blog-post-button').click();
      cy.contains('Cypress Rick');
    });

    describe('A blog exists', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'another blog cypress',
          author: 'Aris',
          url: 'www.google.com',
        });
      });

      it('User can like a blog', function () {
        cy.contains('another blog cypress Aris')
          .parent()
          .contains('view')
          .click()
          .parent()
          .contains('like')
          .click()
          .parent()
          .contains('likes 1')
          .parent()
          .contains('like')
          .click()
          .parent()
          .contains('likes 2');
      });

      it('User who created a blog can delete it', function () {
        cy.contains('another blog cypress Aris')
          .parent()
          .contains('view')
          .click()
          .parent()
          .contains('remove')
          .click();
        cy.contains('another blog cypress Aris').should('not.exist');
      });

      it('other users cannot delete the blog that is not created by them', function () {
        const user = {
          name: 'Aris',
          username: 'Aris',
          password: 'secret',
        };
        cy.request('POST', 'http://localhost:3003/api/users/', user);
        cy.login({ username: user.username, password: user.password });
        cy.contains('another blog cypress Aris')
          .parent()
          .contains('view')
          .click()
          .parent()
          .contains('remove')
          .should('not.exist');
      });
    });

    describe('Several blogs exist', function () {
      beforeEach(function () {
        cy.createBlog({
          title: 'The title with the second most likes',
          author: 'Rick',
          url: 'www.google.com',
          likes: 10,
        });
        cy.createBlog({
          title: 'The title with the third most likes',
          author: 'Tom',
          url: 'www.google.com',
          likes: 5,
        });
        cy.createBlog({
          title: 'The title with the forth most likes',
          author: 'Aris',
          url: 'www.google.com',
          likes: 0,
        });
        cy.createBlog({
          title: 'The title with the most likes',
          author: 'Aris',
          url: 'www.google.com',
          likes: 20,
        });
      });

      it('Blogs are ordered according to likes with the blog with the most likes being first', function () {
        cy.get('.blog span')
          .eq(0)
          .should('contain', 'The title with the most likes Aris');
        cy.get('.blog span')
          .eq(1)
          .should('contain', 'The title with the second most likes Rick');
        cy.get('.blog span')
          .eq(2)
          .should('contain', 'The title with the third most likes Tom');
        cy.get('.blog span')
          .eq(3)
          .should('contain', 'The title with the forth most likes Aris');
      });
    });
  });
});
