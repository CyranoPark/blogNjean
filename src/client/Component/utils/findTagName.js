export default function findTagName(tagId, tagList) {
  for (let i = 0; i < tagList.length; i++) {
    if (tagList[i].id === tagId) {
      return tagList[i].name;
    }
  }
  return null;
}
