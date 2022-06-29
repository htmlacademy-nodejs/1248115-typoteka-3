'use strict';

const SERVER_URL = `http://localhost:8080`;

const MAX_LONG_STRING = 100;
const cutLongString = (string, maxlength) => string.length > maxlength ? `${string.slice(0, maxlength - 1)}…` : string;
const COUNT_SECTION_ELEMENT = 4;

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
};

const updateMainPageSections = async () => {
  const [{commentedArticles}, comments] = await fetch(`${SERVER_URL}/sections/?limit=${COUNT_SECTION_ELEMENT}`).then(response => response.json());

  const mainPageListPreviewElement = document.querySelector('.main-page__list');
  const mainPageSectionFlexElement = document.querySelectorAll('.main-page__section-flex')[0];
  const mainPageSectionsTemplate = document.querySelector('#main-page-sections');
  const mainPageSectionsElement = mainPageSectionsTemplate.cloneNode(true).content;
  const hotArticleListElement = mainPageSectionsElement.querySelector('.hot__list');
  const commentListElement = mainPageSectionsElement.querySelector('.last__list');

  hotArticleListElement.innerHTML = updateHotArticlesSection(commentedArticles);
  commentListElement.innerHTML = updateCommentsSection(comments);

  if (mainPageSectionFlexElement) {
    mainPageSectionFlexElement.remove();
  }

  if (mainPageListPreviewElement) {
    mainPageListPreviewElement.before(mainPageSectionsElement);
  }
};

(() => {
  const socket = io(SERVER_URL);

  socket.addEventListener('comment:update', () => {
    updateMainPageSections();
  })

})();
