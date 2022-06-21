'use strict';

const MAX_LONG_STRING = 100;
const cutLongString = (string, maxlength) => string.length > maxlength ? `${string.slice(0, maxlength - 1)}…` : string;

(() => {
  const SERVER_URL = `http://localhost:3000`;
  const COUNT_SECTION_ELEMENT = 4;

  const socket = io(SERVER_URL);

  const updateCommentsSection = (comments) => {
    return comments.map((item) =>
      `<li class="last__list-item">
        <img class="last__list-image" src="/img/${item.users.avatar}" alt="Аватар пользователя" width="20" height="20">
        <b class="last__list-name">${item.users.firstName} ${item.users.lastName}</b>
        <a class="last__list-link" href="/articles/${item.articleId}">${cutLongString(item.text, MAX_LONG_STRING)}</a>
      </li>`
    ).join(``);
  };

  const updateHotArticlesSection = (articles) => {
    return articles.map(item =>
      `<li class="hot__list-item">
        <a class="hot__list-link" href="/articles/${item.id}">${cutLongString(item.announce, MAX_LONG_STRING)}<sup class="hot__link-sup">${item.commentsCount}</sup></a>
      </li>`
    ).join(``);
  }

  const updateMainPageSections = async () => {
    const pathArticles = `/api/articles/?limitSection=${COUNT_SECTION_ELEMENT}&comments=true`;
    const pathComments = `/api/comments/?limit=${COUNT_SECTION_ELEMENT}`;

    const [{commented}, comments] = await Promise.all([
      fetch(`${SERVER_URL}${pathArticles}`).then(response => response.json()),
      fetch(`${SERVER_URL}${pathComments}`).then(response => response.json()),
    ]);

    const mainPageListPreviewElement = document.querySelector('.main-page__list');
    const mainPageSectionFlexElement = document.querySelectorAll('.main-page__section-flex')[0];
    const mainPageSectionsTemplate = document.querySelector('#main-page-sections');
    const mainPageSectionsElement = mainPageSectionsTemplate.cloneNode(true).content;
    const hotArticleListElement = mainPageSectionsElement.querySelector('.hot__list');
    const commentListElement = mainPageSectionsElement.querySelector('.last__list');

    hotArticleListElement.innerHTML = `${updateHotArticlesSection(commented)}`;
    commentListElement.innerHTML = updateCommentsSection(comments);
    mainPageSectionFlexElement.remove();
    mainPageListPreviewElement.before(mainPageSectionsElement);
  }

  socket.addEventListener('comment:update', () => {
    updateMainPageSections();
  })

})();
