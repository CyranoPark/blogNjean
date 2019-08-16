export function getPostList(limit, sort, pageIndex) {
  const url = `/api/v1/articles?limit=${limit}&sort=${sort}&pageIndex=${pageIndex}`;

  return (
    fetch(url)
      .then(res => res.json())
  );
}

export function getAllTags() {
  const url = '/api/v1/tags';

  return (
    fetch(url)
      .then(res => res.json())
  );
}

export function getTagInfo(tagId) {
  const url = `/api/v1/tags/${tagId}`;

  return (
    fetch(url)
      .then(res => res.json())
  );
}

export function getCommentsOnArticle(articleId) {
  const url = `/api/v1/articles/${articleId}/comments`;

  return (
    fetch(url)
      .then(res => res.json())
  );
}

export function getArticleDetail(articleId) {
  const url = `/api/v1/articles/${articleId}`;

  return (
    fetch(url)
      .then(res => res.json())
  );
}

export function deleteArticle(articleId) {
  const url = `/api/v1/articles/${articleId}`;
  return (
    fetch(url, {
      method: 'DELETE'
    }).then(res => res.json())
  );
}
